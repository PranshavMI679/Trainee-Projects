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

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      await t.rollback();
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const trackingCodes = [];
    const bulkInsertPayload = fields.map(field => {
      if (!field.key || !field.label || !field.type) {
        throw new AppError("Each field structure must possess a valid key, label, and type.", 400);
      }
      
      const singleFieldConfigCode = uuidv4();
      trackingCodes.push(singleFieldConfigCode);

      return {
        config_code: singleFieldConfigCode, 
        client_id: targetClient.client_id,
        key: field.key.trim(),
        label: field.label.trim(),
        type: field.type.trim(),
        is_required: !!field.is_required,
        length: field.length || null
      };
    });

    await FormConfig.bulkCreate(bulkInsertPayload, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Form configuration fields registered successfully.",
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      fields_count: fields.length,
      generated_config_codes: trackingCodes 
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
      length: layout.length
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
    const { key, label, type, is_required, length } = req.body;

    const existingLayout = await FormConfig.findOne({ where: { config_code } });
    if (!existingLayout) {
      await t.rollback();
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    await FormConfig.update({
      key: key ? key.trim() : existingLayout.key,
      label: label ? label.trim() : existingLayout.label,
      type: type ? type.trim() : existingLayout.type,
      is_required: is_required !== undefined ? !!is_required : existingLayout.is_required,
      length: length || existingLayout.length
    }, { where: { config_code }, transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Form configuration parameter updated successfully.",
      config_code
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};

exports.deleteFieldFromLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;

    const existingLayout = await FormConfig.findOne({ where: { config_code } });
    if (!existingLayout) {
      await t.rollback();
      return next(new AppError("The specified field configuration was not found.", 404));
    }

    const fieldKey = existingLayout.key;

    await FormConfig.destroy({ where: { config_code }, transaction: t });

    await Form.update(
      { custom_values: sequelize.literal(`custom_values - '${fieldKey}'`) },
      { where: { config_code }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Form field configuration and related data cleared successfully.`
    });
  } catch (error) {
    if (t && !t.finished) await t.rollback();
    return next(error);
  }
};
