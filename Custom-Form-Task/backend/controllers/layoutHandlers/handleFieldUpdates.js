const { FormConfig, Section, SectionArea, Field, DeleteHistory, FormDataSubmission, sequelize } = require('../../models');
const AppError = require('../../utils/appError');
const { v4: uuidv4 } = require('uuid');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? fallbackValue : parsed;
};

module.exports = async (identifier, reqBody, t) => {
  let fields = reqBody.fields;
  
  if (!fields || !Array.isArray(fields)) {
    if (!reqBody.key) throw new AppError("Field identifier 'key' parameter is required.", 400);
    fields = [{ 
      key: reqBody.key, 
      label: reqBody.label, 
      type: reqBody.type, 
      is_required: reqBody.is_required, 
      length: reqBody.length, 
      options: reqBody.options,
      section_name: reqBody.section_name,
      section_order: reqBody.section_order,
      area_name: reqBody.area_name,
      area_order: reqBody.area_order,
      field_order: reqBody.field_order,
      is_delete: reqBody.is_delete
    }];
  }

  const historyPayloads = [];
  const keysToPurge = [];
  let currentClientCode = null;
  let currentModuleCode = null;
  const fieldsAffectedAreas = new Set();

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const targetKey = field.key ? String(field.key).trim() : '';
    if (!targetKey) continue;

    const baseConfig = await FormConfig.findOne({ 
      where: { config_code: identifier }, 
      transaction: t 
    });
    if (!baseConfig) throw new AppError("Target form configuration layout context tracing failed.", 404);

    currentClientCode = baseConfig.client_code;
    currentModuleCode = baseConfig.module_code;

    let existingField = await Field.findOne({
      include: [{
        model: SectionArea,
        as: 'parentArea',
        required: true,
        include: [{
          model: Section,
          as: 'parentSection',
          required: true,
          where: { config_code: identifier }
        }]
      }],
      where: { key: targetKey },
      transaction: t
    });

    const targetSectionName = field.section_name ? String(field.section_name).trim() : 'General Information';
    const targetAreaName = field.area_name ? String(field.area_name).trim() : 'Main Group';

    if (field.is_delete === true || field.is_delete === 'true') {
      if (!existingField) throw new AppError(`Target field layout not found for key '${targetKey}'.`, 404);
      
      const currentOptions = existingField.options || {};
      
      if (currentOptions.is_field_deleted === true || currentOptions.is_deleted === true) continue; 

      if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
        throw new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403);
      }

      historyPayloads.push({
        config_code: identifier,
        client_code: currentClientCode,
        module_code: currentModuleCode,
        key: existingField.key,
        action_type: 'SINGLE_FIELD_DISABLE',
        archived_options: currentOptions,
        archived_meta: {
          label: existingField.label,
          type: existingField.type,
          is_required: existingField.is_required,
          length: existingField.length,
          section_name: existingField.parentArea?.parentSection?.section_name,
          section_order: existingField.parentArea?.parentSection?.section_order,
          area_name: existingField.parentArea?.area_name,
          area_order: existingField.parentArea?.area_order,
          field_order: existingField.field_order
        }
      });

      keysToPurge.push(targetKey);

      currentOptions.is_field_deleted = true;
      await existingField.update({ options: currentOptions }, { transaction: t });
      
      fieldsAffectedAreas.add(existingField.area_code);
      continue; 
    }
    
    let [sectionRecord] = await Section.findOrCreate({
      where: { config_code: identifier, section_name: targetSectionName },
      defaults: { section_order: safeInt(field.section_order, 1) },
      transaction: t
    });

    let [areaRecord] = await SectionArea.findOrCreate({
      where: { section_code: sectionRecord.section_code, area_name: targetAreaName },
      defaults: { area_order: safeInt(field.area_order, 1) },
      transaction: t
    });

    const normalizedType = (field.type ? String(field.type).trim() : (existingField ? existingField.type : 'singleline'))
      .toLowerCase().replace(/[^a-z0-9]/g, '');

    const incomingOptions = field.options || (existingField ? existingField.options : {});
    
    delete incomingOptions.is_field_deleted;
    delete incomingOptions.is_deleted;
    delete incomingOptions.is_deleted_field;

    const fieldPayload = {
      area_code: areaRecord.area_code,
      label: field.label ? String(field.label).trim() : (existingField ? existingField.label : 'Untitled Field'),
      type: field.type ? String(field.type).trim() : (existingField ? existingField.type : 'singleline'),
      is_required: field.is_required !== undefined 
        ? (field.is_required === true || field.is_required === 'true') 
        : (existingField ? existingField.is_required : false),
      length: ['date', 'datetime'].includes(normalizedType) 
        ? null 
        : (field.length !== undefined ? safeInt(field.length, null) : (existingField ? existingField.length : null)),
      options: incomingOptions,
      field_order: safeInt(field.field_order, existingField ? existingField.field_order : 1)
    };

    if (existingField) {
      if (existingField.area_code !== areaRecord.area_code) {
        fieldsAffectedAreas.add(existingField.area_code);
      }
      await existingField.update(fieldPayload, { transaction: t });
    } else {
      await Field.create({
        field_code: uuidv4(),
        key: targetKey,
        ...fieldPayload
      }, { transaction: t });
    }
    fieldsAffectedAreas.add(areaRecord.area_code);
  }

  for (const areaCode of fieldsAffectedAreas) {
    const allFields = await Field.findAll({
      where: { area_code: areaCode },
      order: [['field_order', 'ASC']],
      transaction: t
    });
    
    let activeSequenceCounter = 1;
    for (let j = 0; j < allFields.length; j++) {
      const item = allFields[j];
      const opts = item.options || {};
      
      if (opts.is_field_deleted || opts.is_deleted) continue; 
      
      await item.update({ field_order: activeSequenceCounter++ }, { transaction: t });
    }
  }

  if (keysToPurge.length > 0 && currentClientCode) {
    await DeleteHistory.bulkCreate(historyPayloads, { transaction: t });

    const postgresKeysFormattedArray = keysToPurge.map(k => `'${k.replace(/'/g, "''")}'`).join(', ');
    await FormDataSubmission.update(
      { 
        custom_values: sequelize.literal(`custom_values - CAST(ARRAY[${postgresKeysFormattedArray}] AS text[])`) 
      },
      { 
        where: { client_code: currentClientCode }, 
        transaction: t 
      }
    );
  }
  return { message: "Form layout properties and field configuration specifications synchronized successfully.", config_code: identifier };
};
