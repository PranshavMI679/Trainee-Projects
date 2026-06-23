const { FormConfig, Form, DeleteHistory, sequelize } = require('../../models');
const AppError = require('../../utils/appError');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 0 ? fallbackValue : parsed;
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

  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const targetKey = field.key ? String(field.key).trim() : '';
    if (!targetKey) continue;

    const existingLayout = await FormConfig.findOne({ 
      where: { config_code: identifier, key: targetKey }, 
      transaction: t 
    });
    if (!existingLayout) throw new AppError(`Target field layout not found for key '${targetKey}'.`, 404);

    currentClientCode = existingLayout.client_code;
    currentModuleCode = existingLayout.module_code;

    let currentOptions = {};
    if (existingLayout.options) {
      if (typeof existingLayout.options === 'string') {
        try { currentOptions = JSON.parse(existingLayout.options); } catch (e) { currentOptions = {}; }
      } else if (typeof existingLayout.options === 'object') {
        currentOptions = existingLayout.options;
      }
    }

    if (field.is_delete === true || field.is_delete === 'true') {
      if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
        throw new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403);
      }

      historyPayloads.push({
        config_code: identifier,
        client_code: existingLayout.client_code,
        module_code: existingLayout.module_code,
        key: existingLayout.key,
        action_type: 'SINGLE_FIELD_DELETE',
        archived_options: currentOptions,
        archived_meta: {
          label: existingLayout.label,
          type: existingLayout.type,
          is_required: existingLayout.is_required,
          length: existingLayout.length,
          section_name: existingLayout.section_name,
          section_order: existingLayout.section_order,
          area_name: existingLayout.area_name,
          area_order: existingLayout.area_order,
          field_order: existingLayout.field_order
        }
      });

      keysToPurge.push(targetKey);

      const updatedOptions = { ...currentOptions, is_deleted_field: true };
      await FormConfig.update(
        { options: updatedOptions }, 
        { where: { config_code: identifier, key: targetKey }, transaction: t }
      );
      continue; 
    }

    let currentType = field.type ? String(field.type).trim() : existingLayout.type;
    const normalizedType = currentType.toLowerCase().replace(/[^a-z0-9]/g, '');

    const isCurrentlyDeleted = currentOptions.is_deleted_field === true || currentOptions.is_deleted_field === 'true';
    if (isCurrentlyDeleted) {
      currentOptions.is_deleted_field = false;
    }

    if (field.options && typeof field.options === 'object') {
      currentOptions = {
        is_multiple: field.options.is_multiple !== undefined 
          ? (field.options.is_multiple === true || field.options.is_multiple === 'true') 
          : !!currentOptions.is_multiple,
        can_delete: field.options.can_delete !== undefined 
          ? (field.options.can_delete === true || field.options.can_delete === 'true') 
          : (currentOptions.can_delete !== undefined ? currentOptions.can_delete : true),
        value: Array.isArray(field.options.value) 
          ? field.options.value.map(o => String(o).trim()) 
          : (currentOptions.value || []),
        thousand_separator: field.options.thousand_separator !== undefined 
          ? String(field.options.thousand_separator) 
          : (currentOptions.thousand_separator || ','),
        decimal_separator: field.options.decimal_separator !== undefined 
          ? String(field.options.decimal_separator) 
          : (currentOptions.decimal_separator || '.')
      };
    }

    await FormConfig.update({
      label: field.label ? String(field.label).trim() : existingLayout.label,
      type: currentType,
      is_required: field.is_required !== undefined 
        ? (field.is_required === true || field.is_required === 'true') 
        : existingLayout.is_required,
      length: ['date', 'datetime'].includes(normalizedType) ? null : (safeInt(field.length, existingLayout.length)),
      options: currentOptions,
      
      section_name: field.section_name ? String(field.section_name).trim() : existingLayout.section_name,
      section_order: safeInt(field.section_order, existingLayout.section_order),
      area_name: field.area_name ? String(field.area_name).trim() : existingLayout.area_name,
      area_order: safeInt(field.area_order, existingLayout.area_order),
      field_order: safeInt(field.field_order, existingLayout.field_order)
    }, { where: { config_code: identifier, key: targetKey }, transaction: t });
  }

  if (keysToPurge.length > 0 && currentClientCode) {
    await DeleteHistory.bulkCreate(historyPayloads, { transaction: t });
    await Form.update(
      { 
        custom_values: sequelize.literal(`custom_values - CAST(ARRAY[:keysToPurge] AS text[])`) 
      },
      { 
        where: { 
          client_code: currentClientCode,
          module_code: currentModuleCode
        }, 
        replacements: { keysToPurge }, 
        transaction: t 
      }
    );
  }
  return { message: "Form configuration updated successfully.", config_code: identifier };
};
