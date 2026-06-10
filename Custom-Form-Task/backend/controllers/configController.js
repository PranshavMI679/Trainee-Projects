const { Client, FormConfig, Form, sequelize } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

exports.createFormLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { fields } = req.body;
    const { client_code } = req.params;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      await t.rollback();
      return next(new AppError("Fields payload must be a non-empty array.", 400));
    }

    const targetClient = await Client.findOne({ where: { client_code }, transaction: t });
    if (!targetClient) {
      await t.rollback();
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const unifiedFormConfigCode = uuidv4();

    const bulkInsertPayload = fields.map(field => {
      if (!field.key || !field.label || !field.type) {
        throw new AppError("Each field structure must possess a valid key, label, and type.", 400);
      }

      const normalizedType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      const allowsOptions = ['dropdown', 'radio', 'radioselection', 'currency'].includes(normalizedType);

      let processedOptions = null;
      if (allowsOptions && field.options) {
        if (Array.isArray(field.options)) {
          processedOptions = field.options.map(o => String(o).trim());
        } else if (typeof field.options === 'object') {
          processedOptions = field.options;
        }
      }

      return {
        config_code: unifiedFormConfigCode,
        client_id: targetClient.client_id,
        key: field.key.trim(),
        label: field.label.trim(),
        type: field.type.trim(),
        is_required: !!field.is_required,
        length: field.length || null,
        options: processedOptions
      };
    });

    await FormConfig.bulkCreate(bulkInsertPayload, { transaction: t });
    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Form configuration fields registered successfully under a single layout template.",
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      fields_count: fields.length,
      config_code: unifiedFormConfigCode 
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};

exports.getClientLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const layouts = await FormConfig.findAll({ where: { client_id: targetClient.client_id } });

    const formattedFields = layouts.map(layout => ({
      config_code: layout.config_code,
      key: layout.key,
      label: layout.label,
      type: layout.type,
      is_required: layout.is_required,
      length: layout.length,
      options: layout.options 
    }));

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

exports.editConfiglayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { key, label, type, is_required, length, options } = req.body;

    if (!key) {
      await t.rollback();
      return next(new AppError("Field identifier 'key' parameter is required to edit layout elements.", 400));
    }

    const existingLayout = await FormConfig.findOne({ 
      where: { config_code, key: key.trim() }, 
      transaction: t 
    });

    if (!existingLayout) {
      await t.rollback();
      return next(new AppError("Target field layout configuration element not found.", 404));
    }

    const currentType = type ? type.trim() : existingLayout.type;
    const normalizedType = currentType.toLowerCase().replace(/[^a-z0-9]/g, '');
    const allowsOptions = ['dropdown', 'radio', 'radioselection', 'currency'].includes(normalizedType);

    let processedOptions = existingLayout.options;
    if (allowsOptions && options) {
      if (Array.isArray(options)) {
        processedOptions = options.map(o => String(o).trim());
      } else if (typeof options === 'object') {
        processedOptions = options;
      }
    } else if (!allowsOptions) {
      processedOptions = null;
    }

    await FormConfig.update({
      label: label ? label.trim() : existingLayout.label,
      type: currentType,
      is_required: is_required !== undefined ? !!is_required : existingLayout.is_required,
      length: length || existingLayout.length,
      options: processedOptions
    }, { 
      where: { config_code, key: key.trim() }, 
      transaction: t 
    });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Form configuration element template updated successfully.",
      config_code,
      key
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};

exports.deleteFieldFromLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code, key } = req.params;

    const existingLayout = await FormConfig.findOne({ 
      where: { config_code, key: key.trim() }, 
      transaction: t 
    });

    if (!existingLayout) {
      await t.rollback();
      return next(new AppError("The specified field configuration element was not found.", 404));
    }

    const currentClientId = existingLayout.client_id;

    await FormConfig.destroy({ 
      where: { config_code, key: key.trim() }, 
      transaction: t 
    });

    await Form.update(
      { custom_values: sequelize.literal(`custom_values - '${key.trim()}'`) },
      { where: { client_id: currentClientId }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Form field element key '${key}' and related historical entries cleared successfully.`
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};
