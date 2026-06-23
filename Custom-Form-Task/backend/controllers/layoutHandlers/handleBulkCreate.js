const { FormConfig } = require('../../models');
const AppError = require('../../utils/appError');
const { v4: uuidv4 } = require('uuid');

module.exports = async (targetModule, fields, t) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    throw new AppError("Fields payload must be a non-empty array.", 400);
  }

  const unifiedFormConfigCode = uuidv4();
  
  const bulkInsertPayload = fields.map(field => {
    if (!field.key || !field.label || !field.type) {
      throw new AppError("Each field structure must possess a valid key, label, and type.", 400);
    }

    const normalizedType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '');
    const targetCanDelete = field.options && field.options.can_delete !== undefined 
      ? (field.options.can_delete === true || field.options.can_delete === 'true') 
      : true;

    const processedOptions = {
      is_multiple: field.options ? (field.options.is_multiple === true || field.options.is_multiple === 'true') : false,
      can_delete: targetCanDelete,
      is_deleted_field: false,
      value: field.options && Array.isArray(field.options.value) ? field.options.value.map(o => String(o).trim()) : [],
      thousand_separator: field.options && field.options.thousand_separator !== undefined ? String(field.options.thousand_separator) : ',',
      decimal_separator: field.options && field.options.decimal_separator !== undefined ? String(field.options.decimal_separator) : '.'
    };

    return {
      config_code: unifiedFormConfigCode,
      client_code: targetModule.client_code,
      module_code: targetModule.module_code,
      key: field.key.trim(),
      label: field.label.trim(),
      type: field.type.trim(),
      is_required: field.is_required === true || field.is_required === 'true',
      length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || null),
      options: processedOptions,
      section_name: field.section_name ? field.section_name.trim() : 'General Information',
      section_order: parseInt(field.section_order, 10) || 1,
      area_name: field.area_name ? field.area_name.trim() : 'Main Group',
      area_order: parseInt(field.area_order, 10) || 1,
      field_order: parseInt(field.field_order, 10) || 1
    };
  });

  await FormConfig.bulkCreate(bulkInsertPayload, { transaction: t });
  
  return { 
    message: "Form configuration fields registered and bound to module successfully.", 
    config_code: unifiedFormConfigCode, 
    status: 201 
  };
};
