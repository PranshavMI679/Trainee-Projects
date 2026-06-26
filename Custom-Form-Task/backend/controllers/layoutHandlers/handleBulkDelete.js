const { FormConfig, Section, SectionArea, Field, DeleteHistory, FormDataSubmission, sequelize } = require('../../models');
const AppError = require('../../utils/appError');

module.exports = async (identifier, body, t) => {
  const { target_type, section_name, area_name } = body;
  const baseConfig = await FormConfig.findOne({ where: { config_code: identifier }, transaction: t });
  if (!baseConfig) throw new AppError("Master configuration layout context tracing failed.", 404);

  let parentContextCode = null;
  const archiveFields = [];

  if (target_type === 'SECTION') {
    if (!section_name) throw new AppError("section_name parameter is strictly required for section deactivations.", 400);
    const trimmedSectionName = String(section_name).trim();

    const targetSection = await Section.findOne({
      where: { config_code: identifier, section_name: trimmedSectionName },
      include: [{ 
        model: SectionArea, 
        as: 'areas', 
        required: false,
        include: [{ 
          model: Field, 
          as: 'fields', 
          required: false 
        }] 
      }],
      transaction: t
    });

    if (!targetSection || targetSection.options?.is_delete === true || targetSection.options?.is_delete === 'true') {
      throw new AppError(`No active section named '${trimmedSectionName}' was found in this layout configuration.`, 404);
    }

    parentContextCode = identifier; 

    const currentSecOptions = targetSection.options || {};
    currentSecOptions.is_delete = true;
    await Section.update({ options: currentSecOptions }, { where: { section_code: targetSection.section_code }, transaction: t });
    
    if (targetSection.areas && targetSection.areas.length > 0) {
      targetSection.areas.forEach(a => {
        if (a.fields && a.fields.length > 0) {
          a.fields.forEach(f => {
            if (!f.options?.is_deleted && !f.options?.is_field_deleted) {
              archiveFields.push(f);
            }
          });
        }
      });
    }
  } 
  else if (target_type === 'AREA') {
    if (!section_name || !area_name) {
      throw new AppError("Both section_name and area_name string parameters are required for area deactivations.", 400);
    }
    const trimmedSectionName = String(section_name).trim();
    const trimmedAreaName = String(area_name).trim();

    const targetArea = await SectionArea.findOne({
      include: [{
        model: Section,
        as: 'parentSection',
        required: true,
        where: { config_code: identifier, section_name: trimmedSectionName }
      }, {
        model: Field,
        as: 'fields',
        required: false
      }],
      where: { area_name: trimmedAreaName },
      transaction: t
    });

    if (!targetArea || targetArea.parentSection?.options?.is_delete === true || targetArea.parentSection?.options?.is_delete === 'true') {
      throw new AppError(`No active area named '${trimmedAreaName}' inside section '${trimmedSectionName}' was found in this layout configuration.`, 404);
    }

    parentContextCode = targetArea.section_code; 

    if (targetArea.fields && targetArea.fields.length > 0) {
      targetArea.fields.forEach(f => {
        if (!f.options?.is_deleted && !f.options?.is_field_deleted) {
          archiveFields.push(f);
        }
      });
    }
    
    if (archiveFields.length === 0) {
      throw new AppError(`The layout area '${trimmedAreaName}' is already deactivated or contains no active fields.`, 404);
    }
  } else {
    throw new AppError("Invalid target_type classification code passed. Use SECTION or AREA.", 400);
  }

  const processedKeys = [];
  if (archiveFields.length > 0) {
    for (const field of archiveFields) {
      processedKeys.push(field.key);
      const currentOptions = field.options || {};
      
      currentOptions.is_deleted = true; 

      await Field.update(
        { options: currentOptions },
        { where: { field_code: field.field_code }, transaction: t }
      );
    }

    const historyEntries = archiveFields.map(f => ({
      config_code: baseConfig.config_code,
      client_code: baseConfig.client_code,
      module_code: baseConfig.module_code,
      key: f.key,
      action_type: `CASCADING_${target_type}_DISABLE`,
      archived_options: f.options || {},
      archived_meta: { label: f.label, type: f.type, is_required: f.is_required, length: f.length }
    }));
    await DeleteHistory.bulkCreate(historyEntries, { transaction: t });
  }

  if (target_type === 'SECTION') {
    const allSections = await Section.findAll({
      where: { config_code: parentContextCode },
      order: [['section_order', 'ASC']],
      transaction: t
    });

    let activeSequenceCounter = 1;
    for (let i = 0; i < allSections.length; i++) {
      const sectionInstance = allSections[i];
      if (sectionInstance.options?.is_delete === true || sectionInstance.options?.is_delete === 'true') continue;
      
      await sectionInstance.update({ section_order: activeSequenceCounter++ }, { transaction: t });
    }
  } 
  else if (target_type === 'AREA') {
    const allAreas = await SectionArea.findAll({
      where: { section_code: parentContextCode },
      include: [{ model: Field, as: 'fields' }],
      order: [['area_order', 'ASC']],
      transaction: t
    });

    let activeSequenceCounter = 1;
    for (let i = 0; i < allAreas.length; i++) {
      const areaInstance = allAreas[i];
      let liveFieldsCount = 0;
      
      (areaInstance.fields || []).forEach(f => {
        if (!f.options?.is_deleted && !f.options?.is_field_deleted) liveFieldsCount++;
      });

      if (liveFieldsCount === 0) continue;
      await areaInstance.update({ area_order: activeSequenceCounter++ }, { transaction: t });
    }
  }

  if (processedKeys.length > 0) {
    const postgresKeysFormattedArray = processedKeys.map(key => `'${key.replace(/'/g, "''")}'`).join(', ');
    await FormDataSubmission.update(
      { 
        custom_values: sequelize.literal(`custom_values - CAST(ARRAY[${postgresKeysFormattedArray}] AS text[])`)
      },
      { 
        where: { client_code: baseConfig.client_code }, 
        transaction: t 
      }
    );
  }

  const displayContainerName = target_type === 'SECTION' ? section_name : area_name;
  return { 
    message: `The entire ${target_type.toLowerCase()} layer '${displayContainerName}' was successfully deactivated, soft-deleted fields archived, and operational transaction profiles updated.` 
  };
};
