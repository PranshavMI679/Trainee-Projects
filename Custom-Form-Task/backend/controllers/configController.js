const { Client, FormConfig, Form, sequelize } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

exports.getClientLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const layouts = await FormConfig.findAll({ where: { client_id: targetClient.client_id } });

    const formattedFields = layouts.map(layout => {
      return {
        config_code: layout.config_code,
        key: layout.key,
        label: layout.label,
        type: layout.type,
        is_required: layout.is_required,
        length: layout.length,
        options: layout.options 
      };
    });

    return res.status(200).json({
      success: true,
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      client_name: targetClient.client_name,
      fields_count: formattedFields.length,
      fields: formattedFields
    });
  } catch (error) {
    return next(error);
  }
};

exports.processConfigLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { identifier } = req.params; 
    let { fields, key, label, type, is_required, length, options } = req.body;

    const targetClient = await Client.findOne({ where: { client_code: identifier }, transaction: t });

    if (targetClient) {
      if (!fields || !Array.isArray(fields) || fields.length === 0) {
        await t.rollback();
        return next(new AppError("Fields payload must be a non-empty array.", 400));
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
          value: field.options && Array.isArray(field.options.value) ? field.options.value.map(o => String(o).trim()) : [],
          thousand_separator: field.options && field.options.thousand_separator !== undefined ? String(field.options.thousand_separator) : ',',
          decimal_separator: field.options && field.options.decimal_separator !== undefined ? String(field.options.decimal_separator) : '.'
        };

        return {
          config_code: unifiedFormConfigCode,
          client_id: targetClient.client_id,
          key: field.key.trim(),
          label: field.label.trim(),
          type: field.type.trim(),
          is_required: field.is_required === true || field.is_required === 'true',
          length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || null),
          options: processedOptions,
          is_delete: false 
        };
      });

      await FormConfig.bulkCreate(bulkInsertPayload, { transaction: t });
      await t.commit();

      return res.status(201).json({
        success: true,
        message: "Form configuration fields registered successfully.",
        config_code: unifiedFormConfigCode 
      });

    } else {
      if (!fields || !Array.isArray(fields)) {
        if (!key) {
          await t.rollback();
          return next(new AppError("Field identifier 'key' parameter is required.", 400));
        }
        fields = [{ key, label, type, is_required, length, options }];
      }

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i];
        const targetKey = field.key ? field.key.trim() : '';

        const existingLayout = await FormConfig.findOne({ 
          where: { config_code: identifier, key: targetKey }, 
          transaction: t 
        });

        if (!existingLayout) {
          await t.rollback();
          return next(new AppError(`Target field layout not found for key '${targetKey}'.`, 404));
        }

        if (field.is_delete === true || field.is_delete === 'true') {
          const currentOptions = existingLayout.options || {};
          
          if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
            await t.rollback();
            return next(new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403));
          }

          await FormConfig.update(
            { is_delete: true },
            { where: { config_code: identifier, key: targetKey }, transaction: t }
          );

          await Form.update(
            { custom_values: sequelize.literal("custom_values - '" + targetKey + "'") },
            { where: { client_id: existingLayout.client_id }, transaction: t }
          );
          continue; 
        }

        let currentType = field.type ? field.type.trim() : existingLayout.type;
        const normalizedType = currentType.toLowerCase().replace(/[^a-z0-9]/g, '');
        let processedOptions = existingLayout.options || {};

        if (field.options && typeof field.options === 'object') {
          processedOptions = {
            is_multiple: field.options.is_multiple !== undefined ? (field.options.is_multiple === true || field.options.is_multiple === 'true') : !!processedOptions.is_multiple,
            can_delete: field.options.can_delete !== undefined ? (field.options.can_delete === true || field.options.can_delete === 'true') : (processedOptions.can_delete !== undefined ? processedOptions.can_delete : true),
            value: Array.isArray(field.options.value) ? field.options.value.map(o => String(o).trim()) : (processedOptions.value || []),
            thousand_separator: field.options.thousand_separator !== undefined ? String(field.options.thousand_separator) : (processedOptions.thousand_separator || ','),
            decimal_separator: field.options.decimal_separator !== undefined ? String(field.options.decimal_separator) : (processedOptions.decimal_separator || '.')
          };
        }

        await FormConfig.update({
          label: field.label ? field.label.trim() : existingLayout.label,
          type: currentType,
          is_required: field.is_required !== undefined ? (field.is_required === true || field.is_required === 'true') : existingLayout.is_required,
          length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || existingLayout.length),
          options: processedOptions
        }, { 
          where: { config_code: identifier, key: targetKey }, 
          transaction: t 
        });
      }

      await t.commit();
      return res.status(200).json({
        success: true,
        message: "Form configuration updated successfully.",
        config_code: identifier
      });
    }
  } catch (error) {
    try { await t.rollback(); } catch (e) {}
    return next(error);
  }
};

exports.deleteFieldFromLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code, key } = req.params;
    const targetKey = key.trim();

    const existingLayout = await FormConfig.findOne({ 
      where: { 
        config_code, 
        key: targetKey
      }, 
      transaction: t 
    });

    if (!existingLayout) {
      await t.rollback();
      return next(new AppError("The specified field configuration element was not found.", 404));
    }

    const currentOptions = existingLayout.options || {};
    
    if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
      await t.rollback();
      return next(new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403));
    }

    const currentClientId = existingLayout.client_id;

    const updatedOptions = { ...currentOptions, is_deleted_field: true };

    await FormConfig.update(
      { options: updatedOptions },
      { 
        where: { config_code, key: targetKey }, 
        transaction: t 
      }
    );

    await Form.update(
      { custom_values: sequelize.literal("custom_values - '" + targetKey + "'") },
      { where: { client_id: currentClientId }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Form field element key '${targetKey}' was successfully soft-deleted and removed from historical submission payloads.`
    });
  } catch (error) {
    try {
      await t.rollback();
    } catch (rollbackErr) {
    }
    return next(error);
  }
};

