const { FormConfig, Form, DeleteHistory, sequelize } = require('../../models');
const AppError = require('../../utils/appError');

module.exports = async (identifier, body, t) => {
  const { target_type, section_name, area_name } = body;
  const deleteWhereClause = { config_code: identifier };
  
  if (target_type === 'SECTION') {
    if (!section_name) {
      throw new AppError("section_name is required for section deactivations.", 400);
    }
    deleteWhereClause.section_name = String(section_name).trim();
  } else {
    if (!section_name || !area_name) {
      throw new AppError("Both section_name and area_name are required for area deactivations.", 400);
    }
    deleteWhereClause.section_name = String(section_name).trim();
    deleteWhereClause.area_name = String(area_name).trim();
  }

  const targetedFields = await FormConfig.findAll({ where: deleteWhereClause, transaction: t });
  if (targetedFields.length === 0) {
    throw new AppError(`No active elements found inside this container block.`, 404);
  }

  const historyPayloads = [];
  const processedKeys = [];
  let currentClientCode = null;
  let currentModuleCode = null;

  for (const fieldRow of targetedFields) {
    let currentOpts = {};
    if (fieldRow.options) {
      if (typeof fieldRow.options === 'string') {
        try { currentOpts = JSON.parse(fieldRow.options); } catch (e) { currentOpts = {}; }
      } else if (typeof fieldRow.options === 'object') {
        currentOpts = fieldRow.options;
      }
    }

    if (currentOpts.is_deleted_field === true || currentOpts.is_deleted_field === 'true') {
      continue; 
    }

    currentClientCode = fieldRow.client_code;
    currentModuleCode = fieldRow.module_code;
    processedKeys.push(fieldRow.key);

    historyPayloads.push({
      config_code: identifier,
      client_code: fieldRow.client_code,
      module_code: fieldRow.module_code,
      key: fieldRow.key,
      action_type: `CASCADING_${target_type}_DELETE`,
      archived_options: currentOpts,
      archived_meta: {
        label: fieldRow.label,
        type: fieldRow.type,
        is_required: fieldRow.is_required,
        length: fieldRow.length,
        section_name: fieldRow.section_name,
        section_order: fieldRow.section_order,
        area_name: fieldRow.area_name,
        area_order: fieldRow.area_order,
        field_order: fieldRow.field_order
      }
    });

    const updatedOptions = { ...currentOpts, is_deleted_field: true };
    await FormConfig.update(
      { options: updatedOptions }, 
      { where: { config_code: identifier, key: fieldRow.key }, transaction: t }
    );
  }

  if (processedKeys.length > 0 && currentClientCode) {
    await DeleteHistory.bulkCreate(historyPayloads, { transaction: t });
    const postgresKeysFormattedArray = processedKeys.map(key => `'${key.replace(/'/g, "''")}'`).join(', ');
    await Form.update(
      { 
        custom_values: sequelize.literal(`custom_values - CAST(ARRAY[${postgresKeysFormattedArray}] AS text[])`)
      },
      { 
        where: { 
          client_code: currentClientCode,
          module_code: currentModuleCode
        }, 
        transaction: t 
      }
    );
  }
  const displayContainerName = target_type === 'SECTION' ? section_name : area_name;
  return { 
    message: `The entire ${target_type.toLowerCase()} layer '${displayContainerName}' was successfully deactivated, soft-deleted fields archived, and custom records purged.` 
  };
};
