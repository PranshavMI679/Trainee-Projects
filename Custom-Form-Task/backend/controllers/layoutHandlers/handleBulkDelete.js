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
      where: { config_code: identifier, section_name: trimmedSectionName, is_active: true },
      include: [{ 
        model: SectionArea, 
        as: 'areas', 
        where: { is_active: true },
        required: false,
        include: [{ 
          model: Field, 
          as: 'fields', 
          where: { is_active: true },
          required: false 
        }] 
      }],
      transaction: t
    });

    if (!targetSection) throw new AppError(`No active section named '${trimmedSectionName}' was found in this layout configuration.`, 404);

    parentContextCode = identifier; 

    await Section.update({ is_active: false }, { where: { section_code: targetSection.section_code }, transaction: t });
    
    if (targetSection.areas && targetSection.areas.length > 0) {
      const areaCodes = targetSection.areas.map(a => a.area_code);
      await SectionArea.update({ is_active: false }, { where: { area_code: areaCodes }, transaction: t });
      
      targetSection.areas.forEach(a => {
        if (a.fields && a.fields.length > 0) archiveFields.push(...a.fields);
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
        where: { config_code: identifier, section_name: trimmedSectionName, is_active: true }
      }, {
        model: Field,
        as: 'fields',
        where: { is_active: true },
        required: false
      }],
      where: { area_name: trimmedAreaName, is_active: true },
      transaction: t
    });

    if (!targetArea) {
      throw new AppError(`No active area named '${trimmedAreaName}' inside section '${trimmedSectionName}' was found in this layout configuration.`, 404);
    }

    parentContextCode = targetArea.section_code; 

    await SectionArea.update({ is_active: false }, { where: { area_code: targetArea.area_code }, transaction: t });
    if (targetArea.fields && targetArea.fields.length > 0) archiveFields.push(...targetArea.fields);
  } else {
    throw new AppError("Invalid target_type classification code passed. Use SECTION or AREA.", 400);
  }

  const processedKeys = [];
  if (archiveFields.length > 0) {
    const activeFieldCodes = archiveFields.map(f => f.field_code);
    
    await Field.update({ is_active: false }, { where: { field_code: activeFieldCodes }, transaction: t });

    const historyEntries = archiveFields.map(f => {
      processedKeys.push(f.key);
      return {
        config_code: baseConfig.config_code,
        client_code: baseConfig.client_code,
        module_code: baseConfig.module_code,
        key: f.key,
        action_type: `CASCADING_${target_type}_DISABLE`,
        archived_options: f.options || {},
        archived_meta: { label: f.label, type: f.type, is_required: f.is_required, length: f.length }
      };
    });
    await DeleteHistory.bulkCreate(historyEntries, { transaction: t });
  }

  if (target_type === 'SECTION') {
    const activeSections = await Section.findAll({
      where: { config_code: parentContextCode, is_active: true },
      order: [['section_order', 'ASC']],
      transaction: t
    });
    for (let i = 0; i < activeSections.length; i++) {
      await activeSections[i].update({ section_order: i + 1 }, { transaction: t });
    }
  } 
  else if (target_type === 'AREA') {
    const activeAreas = await SectionArea.findAll({
      where: { section_code: parentContextCode, is_active: true },
      order: [['area_order', 'ASC']],
      transaction: t
    });
    for (let i = 0; i < activeAreas.length; i++) {
      await activeAreas[i].update({ area_order: i + 1 }, { transaction: t });
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
