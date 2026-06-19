const { FormConfig, Form, DeleteHistory, sequelize } = require('../../models');
const AppError = require('../../utils/appError');

module.exports = async (identifier, body, t) => {
  const { target_type, section_name, area_name } = body;
  const deleteWhereClause = { config_code: identifier };
  
  // 1. Enforce container boundary constraints
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

  // 2. Locate targeted dynamic templates
  const targetedFields = await FormConfig.findAll({ where: deleteWhereClause, transaction: t });
  if (targetedFields.length === 0) {
    throw new AppError(`No active elements found inside this container block.`, 404);
  }

  const historyPayloads = [];
  const processedKeys = [];
  let clientWorkspaceId = null;

  // 3. Process records into vectorized arrays
  for (const fieldRow of targetedFields) {
    // Leverage native JSONB parsing; fallback safely if string relics exist
    let currentOpts = {};
    if (fieldRow.options) {
      if (typeof fieldRow.options === 'string') {
        try { currentOpts = JSON.parse(fieldRow.options); } catch (e) { currentOpts = {}; }
      } else if (typeof fieldRow.options === 'object') {
        currentOpts = fieldRow.options;
      }
    }

    // Skip fields already soft-deleted
    if (currentOpts.is_deleted_field === true || currentOpts.is_deleted_field === 'true') {
      continue; 
    }

    clientWorkspaceId = fieldRow.client_id;
    processedKeys.push(fieldRow.key);

    // Push into batch array to match delete_histories properties
    historyPayloads.push({
      config_code: identifier,
      client_id: fieldRow.client_id,
      key: fieldRow.key,
      label: fieldRow.label,
      type: fieldRow.type,
      is_required: fieldRow.is_required,
      length: fieldRow.length,
      section_name: fieldRow.section_name,
      section_order: fieldRow.section_order,
      area_name: fieldRow.area_name,
      area_order: fieldRow.area_order,
      field_order: fieldRow.field_order,
      archived_options: currentOpts, // Placed cleanly as an object into JSONB
      action_type: `CASCADING_${target_type}_DELETE`
    });

    // Flag the layout field as soft-deleted
    const updatedOptions = { ...currentOpts, is_deleted_field: true };
    await FormConfig.update(
      { options: updatedOptions }, 
      { where: { config_code: identifier, key: fieldRow.key }, transaction: t }
    );
  }

  // 4. Perform optimized high-performance batch updates
  if (processedKeys.length > 0 && clientWorkspaceId) {
    // Logging step writes all histories in one database hit
    await DeleteHistory.bulkCreate(historyPayloads, { transaction: t });

    // SECURE HIGH-PERFORMANCE BATCH PURGE
    // Uses parameterized query replacements to strip all keys safely in a single execution
    await Form.update(
      { 
        custom_values: sequelize.literal(`custom_values - CAST(ARRAY[:processedKeys] AS text[])`)
      },
      { 
        where: { client_id: clientWorkspaceId }, 
        replacements: { processedKeys }, // Immunises database layer from SQL injection
        transaction: t 
      }
    );
  }

  const displayContainerName = target_type === 'SECTION' ? section_name : area_name;
  return { 
    message: `The entire ${target_type.toLowerCase()} layer '${displayContainerName}' was successfully deactivated, soft-deleted fields archived, and custom records purged.` 
  };
};
