const { FormConfig, Form, DeleteHistory } = require('../../models');
const AppError = require('../../utils/appError');
const { sequelize } = require('../../models');

module.exports = async (identifier, body, t) => {
  const { target_type, section_name, area_name } = body;
  const deleteWhereClause = { config_code: identifier };
  
  if (target_type === 'SECTION') {
    if (!section_name) throw new AppError("section_name is required for section deactivations.", 400);
    deleteWhereClause.section_name = String(section_name).trim();
  } else {
    if (!section_name || !area_name) throw new AppError("Both section_name and area_name are required.", 400);
    deleteWhereClause.section_name = String(section_name).trim();
    deleteWhereClause.area_name = String(area_name).trim();
  }

  const targetedFields = await FormConfig.findAll({ where: deleteWhereClause, transaction: t });
  if (targetedFields.length === 0) throw new AppError(`No active elements found inside this container block.`, 404);

  for (const fieldRow of targetedFields) {
    let currentOpts = {};
    if (fieldRow.options) {
      try {
        currentOpts = typeof fieldRow.options === 'string' ? JSON.parse(fieldRow.options) : fieldRow.options;
      } catch (e) { currentOpts = {}; }
    }

    if (currentOpts.is_deleted_field === true || currentOpts.is_deleted_field === 'true') continue; 

    await DeleteHistory.create({
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
      archived_options: fieldRow.options || {},
      action_type: `CASCADING_${target_type}_DELETE`
    }, { transaction: t });

    const updatedOptions = { ...currentOpts, is_deleted_field: true };
    await FormConfig.update({ options: updatedOptions }, { where: { config_code: identifier, key: fieldRow.key }, transaction: t });
    await Form.update({ custom_values: sequelize.literal(`custom_values - '${fieldRow.key}'`) }, { where: { client_id: fieldRow.client_id }, transaction: t });
  }

  return { message: `The entire ${target_type.toLowerCase()} layer '${target_type === 'SECTION' ? section_name : area_name}' was deactivated.` };
};
