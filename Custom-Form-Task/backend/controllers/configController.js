const { sequelize, Client, Module, FormConfig, Section, SectionArea, Field, DeleteHistory } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? fallbackValue : parsed;
};

exports.getCombinedClientLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }
    const baseConfigs = await FormConfig.findAll({
      where: { client_code },
      order: [['created_at', 'ASC']]
    });

    const outputPayload = [];
    for (const config of baseConfigs) {
      const configJson = config.toJSON();
      const sections = await Section.findAll({
        where: { config_code: config.config_code },
        order: [['section_order', 'ASC']],
        raw: true
      });

      const structuredSections = [];

      for (const sec of sections) {
        if (sec.options?.is_delete === true || sec.options?.is_delete === 'true') continue;

        const areas = await SectionArea.findAll({
          where: { section_code: sec.section_code },
          order: [['area_order', 'ASC']],
          raw: true
        });

        const structuredAreas = [];

        for (const ar of areas) {
          const fields = await Field.findAll({
            where: { area_code: ar.area_code },
            order: [['field_order', 'ASC']],
            raw: true
          });

          const activeFields = fields.filter(f => {
            const opts = f.options || {};
            
            const isHidden = opts.is_field_deleted === true || 
                             opts.is_field_deleted === 'true' ||
                             opts.is_deleted === true || 
                             opts.is_deleted === 'true' ||
                             opts.is_deleted_field === true || 
                             opts.is_deleted_field === 'true';
                             
            return !isHidden;
          });

          if (activeFields.length > 0) {
            structuredAreas.push({
              ...ar,
              fields: activeFields
            });
          }
        }

        if (structuredAreas.length > 0) {
          structuredSections.push({
            ...sec,
            areas: structuredAreas
          });
        }
      }
      configJson.sections = structuredSections;
      outputPayload.push(configJson);
    }
    return res.status(200).json({
      success: true,
      data: {
        client_code: targetClient.client_code,
        client_name: targetClient.client_name,
        configurations: outputPayload
      }
    });
  } 
  catch (error) {
    console.error("EXPLICIT POSTGRES ERROR DIAGNOSTIC:", error);
    return next(error);
  }
};

exports.processConfigLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { module_code } = req.params;
    const { config_name, fields } = req.body; 

    const targetModule = await Module.findOne({ where: { module_code }, transaction: t });
    if (!targetModule) {
      await t.rollback();
      return next(new AppError("Target application module was not found in this workspace context.", 404));
    }

    const extractedClientCode = targetModule.client_code;

    let [configRecord] = await FormConfig.findOrCreate({
      where: { client_code: extractedClientCode, module_code },
      defaults: { config_name: config_name.trim() },
      transaction: t
    });

    if (configRecord.config_name !== config_name.trim()) {
      await configRecord.update({ config_name: config_name.trim() }, { transaction: t });
    }

    const config_code = configRecord.config_code;

    for (const field of fields) {
      const targetKey = field.key.trim();

      let existingField = await Field.findOne({
        include: [{
          model: SectionArea,
          as: 'parentArea',
          required: true,
          include: [{
            model: Section,
            as: 'parentSection',
            required: true,
            where: { config_code }
          }]
        }],
        where: { key: targetKey },
        transaction: t
      });

      const sectionName = field.section_name ? field.section_name.trim() : 'General Information';
      const areaName = field.area_name ? field.area_name.trim() : 'Main Group';

      let [sectionRecord] = await Section.findOrCreate({
        where: { config_code, section_name: sectionName },
        defaults: { section_order: safeInt(field.section_order, 1) },
        transaction: t
      });

      let [areaRecord] = await SectionArea.findOrCreate({
        where: { section_code: sectionRecord.section_code, area_name: areaName },
        defaults: { area_order: safeInt(field.area_order, 1) },
        transaction: t
      });

      const normalizedType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const incomingOptions = field.options || {};
      
      if (incomingOptions.can_delete === undefined) {
        incomingOptions.can_delete = true;
      } else {
        incomingOptions.can_delete = (incomingOptions.can_delete === true || incomingOptions.can_delete === 'true');
      }

      if (existingField && existingField.options) {
        if (existingField.options.is_field_deleted !== undefined) {
          incomingOptions.is_field_deleted = existingField.options.is_field_deleted;
        }
        if (existingField.options.is_deleted !== undefined) {
          incomingOptions.is_deleted = existingField.options.is_deleted;
        }
        if (existingField.options.is_deleted_field !== undefined) {
          incomingOptions.is_deleted_field = existingField.options.is_deleted_field;
        }
      } else {
        if (incomingOptions.is_field_deleted !== undefined) delete incomingOptions.is_field_deleted;
        if (incomingOptions.is_deleted !== undefined) delete incomingOptions.is_deleted;
        if (incomingOptions.is_deleted_field !== undefined) delete incomingOptions.is_deleted_field;
      }

      const fieldPayload = {
        area_code: areaRecord.area_code,
        label: field.label.trim(),
        type: field.type.trim(),
        is_required: field.is_required === true || field.is_required === 'true',
        length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || null),
        options: incomingOptions, 
        field_order: safeInt(field.field_order, 1)
      };

      if (existingField) {
        await existingField.update(fieldPayload, { transaction: t });
      } else {
        await Field.create({
          key: targetKey,
          ...fieldPayload
        }, { transaction: t });
      }
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Dynamic configuration forms blueprint state successfully captured and synchronized.",
      config_code
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

exports.swapLayoutPositions = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { target_layer, shifts } = req.body; 

    if (!shifts || !Array.isArray(shifts) || shifts.length === 0) {
      await t.rollback();
      return next(new AppError("Swapping sequence requires an array list coordinate object set.", 400));
    }

    const uppercaseLayer = String(target_layer).toUpperCase().trim();
    if (!['SECTION', 'AREA', 'FIELD'].includes(uppercaseLayer)) {
      await t.rollback();
      return next(new AppError("Invalid layout layer specified target context.", 400));
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const targetLayerMapping = {
      'SECTION': { model: Section, orderField: 'section_order', defaultKey: 'section_code', fallbackKey: 'section_name', useConfigCode: true },
      'AREA': { model: SectionArea, orderField: 'area_order', defaultKey: 'area_code', fallbackKey: 'area_name', useConfigCode: false },
      'FIELD': { model: Field, orderField: 'field_order', defaultKey: 'field_code', fallbackKey: 'key', useConfigCode: false }
    };

    const targetConfig = targetLayerMapping[uppercaseLayer];

    for (const shift of shifts) {
      const targetIdentifier = String(shift.code_identifier || '').trim();
      if (!targetIdentifier) continue;

      const activeLookupColumn = uuidRegex.test(targetIdentifier) 
        ? targetConfig.defaultKey 
        : targetConfig.fallbackKey;

      const whereCondition = { [activeLookupColumn]: targetIdentifier };
      if (targetConfig.useConfigCode) {
        whereCondition.config_code = config_code;
      }

      const existingInstance = await targetConfig.model.findOne({ where: whereCondition, transaction: t });
      
      if (!existingInstance) {
        await t.rollback();
        return next(new AppError(`The structural layout target '${targetIdentifier}' was not found inside your workspace context.`, 404));
      }

      if (uppercaseLayer === 'SECTION' || uppercaseLayer === 'FIELD') {
        const opts = existingInstance.options || {};
        const isSoftDeleted = opts.is_delete === true || 
                             opts.is_delete === 'true' || 
                             opts.is_field_deleted === true || 
                             opts.is_field_deleted === 'true' || 
                             opts.is_deleted === true || 
                             opts.is_deleted === 'true' || 
                             opts.is_deleted_field === true || 
                             opts.is_deleted_field === 'true';

        if (isSoftDeleted) {
          await t.rollback();
          return next(new AppError(`Operation rejected: The layout ${uppercaseLayer.toLowerCase()} component '${targetIdentifier}' has been deleted and cannot be reordered.`, 400));
        }
      }
    }

    for (const shift of shifts) {
      const targetIdentifier = String(shift.code_identifier || '').trim();
      if (!targetIdentifier) continue;

      const cleanOrderIndex = typeof safeInt === 'function'
        ? safeInt(shift.order_index, 1)
        : parseInt(shift.order_index, 10) || 1;

      const activeLookupColumn = uuidRegex.test(targetIdentifier) 
        ? targetConfig.defaultKey 
        : targetConfig.fallbackKey;

      const whereCondition = { [activeLookupColumn]: targetIdentifier };
      if (targetConfig.useConfigCode) {
        whereCondition.config_code = config_code;
      }

      const outOfBoundsSafeIndex = Math.abs(cleanOrderIndex) + 10000;

      await targetConfig.model.update(
        { [targetConfig.orderField]: outOfBoundsSafeIndex },
        { where: whereCondition, transaction: t }
      );
    }

    for (const shift of shifts) {
      const targetIdentifier = String(shift.code_identifier || '').trim();
      if (!targetIdentifier) continue;

      const cleanOrderIndex = typeof safeInt === 'function'
        ? safeInt(shift.order_index, 1)
        : parseInt(shift.order_index, 10) || 1;

      const activeLookupColumn = uuidRegex.test(targetIdentifier) 
        ? targetConfig.defaultKey 
        : targetConfig.fallbackKey;

      const whereCondition = { [activeLookupColumn]: targetIdentifier };
      if (targetConfig.useConfigCode) {
        whereCondition.config_code = config_code;
      }

      await targetConfig.model.update(
        { [targetConfig.orderField]: Math.abs(cleanOrderIndex) },
        { where: whereCondition, transaction: t }
      );
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: `Positional grid layout swaps applied successfully across your ${uppercaseLayer.toLowerCase()} structural layers.`
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    return next(error);
  }
};

exports.disableLayoutElement = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { target_layer, target_code } = req.body; 

    const baseConfig = await FormConfig.findOne({ where: { config_code }, transaction: t });
    if (!baseConfig) {
      await t.rollback();
      return next(new AppError("Master template definition context trace failed.", 404));
    }

    const uppercaseLayer = String(target_layer).toUpperCase().trim();
    const rawTargetCode = String(target_code).trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    let archiveFields = [];
    let parentContextCode = null;

    if (uppercaseLayer === 'SECTION') {
      const sectionLookupColumn = uuidRegex.test(rawTargetCode) ? 'section_code' : 'section_name';
      
      const targetSectionInstance = await Section.findOne({
        where: { config_code, [sectionLookupColumn]: rawTargetCode },
        include: [{ model: SectionArea, as: 'areas', include: [{ model: Field, as: 'fields' }] }],
        transaction: t
      });
      if (!targetSectionInstance) throw new AppError("Section record missing.", 404);

      if (targetSectionInstance.options?.is_delete === true || targetSectionInstance.options?.is_delete === 'true') {
        await t.rollback();
        return next(new AppError(`The layout section '${rawTargetCode}' is already deactivated or unavailable.`, 400));
      }

      const updatedSecOptions = targetSectionInstance.options || {};
      updatedSecOptions.is_delete = true;
      await targetSectionInstance.update({ options: updatedSecOptions }, { transaction: t });

      const targetSection = targetSectionInstance.get({ plain: true });
      parentContextCode = config_code;
      
      if (targetSection.areas) {
        targetSection.areas.forEach(area => {
          if (area.fields) archiveFields.push(...area.fields);
        });
      }
    }
    else if (uppercaseLayer === 'AREA') {
      const areaLookupColumn = uuidRegex.test(rawTargetCode) ? 'area_code' : 'area_name';

      const targetAreaInstance = await SectionArea.findOne({
        where: { [areaLookupColumn]: rawTargetCode },
        include: [{ model: Field, as: 'fields' }],
        transaction: t
      });
      if (!targetAreaInstance) throw new AppError("Section area target missing.", 404);

      const targetArea = targetAreaInstance.get({ plain: true });
      parentContextCode = targetArea.section_code;
      
      if (targetArea.fields) archiveFields.push(...targetArea.fields);
    }
    else if (uppercaseLayer === 'FIELD') {
      const fieldLookupColumn = uuidRegex.test(rawTargetCode) ? 'field_code' : 'key';

      const targetFieldInstance = await Field.findOne({ 
        where: { [fieldLookupColumn]: rawTargetCode }, 
        transaction: t 
      });
      if (!targetFieldInstance) throw new AppError("Field layout component target missing.", 404);

      if (targetFieldInstance.options?.is_field_deleted === true || targetFieldInstance.options?.is_deleted === true) {
        await t.rollback();
        return next(new AppError(`The layout field parameter '${rawTargetCode}' is already deactivated or unavailable.`, 400));
      }

      const targetField = targetFieldInstance.get({ plain: true });
      parentContextCode = targetField.area_code;
      archiveFields.push(targetField);
    }

    if (archiveFields.length > 0) {
      const fieldsToSaveToLog = [];

      for (const field of archiveFields) {
        const currentOptions = field.options || {};
        
        if (uppercaseLayer === 'FIELD' && currentOptions.can_delete === false) {
          await t.rollback();
          return next(new AppError(`The field element '${field.label}' is protected and cannot be deleted.`, 400));
        }

        if (currentOptions.can_delete === false) continue;
        
        if (currentOptions.is_field_deleted === true || currentOptions.is_deleted === true) continue;

        if (uppercaseLayer === 'FIELD') {
          currentOptions.is_field_deleted = true;
        } else {
          currentOptions.is_deleted = true;
        }

        await Field.update(
          { options: currentOptions },
          { where: { field_code: field.field_code }, transaction: t }
        );
        fieldsToSaveToLog.push(field);
      }

      if (fieldsToSaveToLog.length > 0) {
        const historyEntries = fieldsToSaveToLog.map(f => ({
          config_code: baseConfig.config_code,
          client_code: baseConfig.client_code,
          module_code: baseConfig.module_code,
          key: f.key,
          action_type: `CASCADING_${uppercaseLayer}_DISABLE`,
          archived_options: f.options || {},
          archived_meta: { label: f.label, type: f.type, is_required: f.is_required, length: f.length }
        }));
        await DeleteHistory.bulkCreate(historyEntries, { transaction: t });
      }
    }

    if (uppercaseLayer === 'SECTION') {
      const allSections = await Section.findAll({
        where: { config_code: parentContextCode },
        order: [['section_order', 'ASC']],
        transaction: t
      });

      let currentOrder = 1;
      for (const secInstance of allSections) {
        if (secInstance.options?.is_delete === true || secInstance.options?.is_delete === 'true') continue;
        await secInstance.update({ section_order: currentOrder++ }, { transaction: t });
      }
    } 
    else if (uppercaseLayer === 'AREA') {
      const allAreas = await SectionArea.findAll({
        where: { section_code: parentContextCode },
        include: [{ model: Field, as: 'fields' }],
        order: [['area_order', 'ASC']],
        transaction: t
      });

      let currentOrder = 1;
      for (const areaInstance of allAreas) {
        let totalFields = 0;
        let deletedFieldsCount = 0;

        (areaInstance.fields || []).forEach(f => { 
          totalFields++; 
          if (f.options?.is_deleted || f.options?.is_field_deleted || f.options?.is_deleted_field) deletedFieldsCount++; 
        });

        if (totalFields > 0 && totalFields === deletedFieldsCount) continue;
        await areaInstance.update({ area_order: currentOrder++ }, { transaction: t });
      }
    } 
    else if (uppercaseLayer === 'FIELD') {
      const allFields = await Field.findAll({
        where: { area_code: parentContextCode },
        order: [['field_order', 'ASC']],
        transaction: t
      });

      let currentOrder = 1;
      for (const item of allFields) {
        const opts = item.options || {};
        if (opts.is_field_deleted || opts.is_deleted || opts.is_deleted_field) continue; 
        await item.update({ field_order: currentOrder++ }, { transaction: t });
      }
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: `The dynamic structural ${uppercaseLayer.toLowerCase()} segment has been safely deactivated and structural sequence paths seamlessly re-sorted.`
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};

