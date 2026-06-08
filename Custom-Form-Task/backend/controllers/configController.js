const { Client, FormConfig, Form, sequelize } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

exports.createFormLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { client_name, fields } = req.body;
    const { client_code } = req.params;

    let targetClient = null;

    if (client_code && client_code !== 'new') {
      targetClient = await Client.findOne({ where: { client_code } });
      if (!targetClient) {
        await t.rollback();
        return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
      }
    }

    if (!targetClient) {
      if (!client_name || client_name.trim() === '') {
        await t.rollback();
        return next(new AppError(ErrorMessages.CLIENT.NAME_REQUIRED, 400));
      }
      targetClient = await Client.create({ client_name }, { transaction: t });
    }

    const generatedConfigCode = uuidv4();

    const bulkInsertPayload = fields.map(field => ({
      config_code: generatedConfigCode,
      client_id: targetClient.client_id,
      key: field.key,
      label: field.label,
      type: field.type,
      is_required: field.is_required,
      length: field.length || null
    }));

    await FormConfig.bulkCreate(bulkInsertPayload, { transaction: t });

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Form layout configuration template created successfully.",
      config_code: generatedConfigCode,
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      client_name: targetClient.client_name,
      fields_count: fields.length
    });
  } catch (error) {
    await t.rollback();
    next(new AppError(ErrorMessages.SERVER.CLIENT_SPECS_CREATE, 500));
  }
};

exports.getClientLayout = async (req, res, next) => {
  try {
    const { config_code } = req.params;

    const layouts = await FormConfig.findAll({ where: { config_code } });

    if (!layouts || layouts.length === 0) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const targetClient = await Client.findOne({ where: { client_id: layouts[0].client_id } });

    const formattedFields = layouts.map(l => ({
      key: l.key,
      label: l.label,
      type: l.type,
      is_required: l.is_required,
      length: l.length
    }));

    return res.status(200).json({
      config_code,
      client_id: targetClient ? targetClient.client_id : null,
      client_code: targetClient ? targetClient.client_code : null,
      client_name: targetClient ? targetClient.client_name : null,
      fields: formattedFields
    });
  } catch (error) {
    next(new AppError(ErrorMessages.SERVER.LAYOUT_FETCH, 500));
  }
};

exports.editConfiglayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { client_name, fields } = req.body;

    const existingLayouts = await FormConfig.findAll({ where: { config_code } });
    if (!existingLayouts || existingLayouts.length === 0) {
      await t.rollback();
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const currentClientId = existingLayouts[0].client_id;

    if (client_name) {
      await Client.update({ client_name }, { where: { client_id: currentClientId }, transaction: t });
    }

    await FormConfig.destroy({ where: { config_code }, transaction: t });

    const updatedPayload = fields.map(field => ({
      config_code,
      client_id: currentClientId,
      key: field.key,
      label: field.label,
      type: field.type,
      is_required: field.is_required,
      length: field.length || null
    }));

    await FormConfig.bulkCreate(updatedPayload, { transaction: t });

    await t.commit();

    const targetClient = await Client.findOne({ where: { client_id: currentClientId } });

    return res.status(200).json({
      success: true,
      message: "Form configuration layout template parameters updated successfully.",
      config_code,
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      updated_fields_count: fields.length
    });
  } catch (error) {
    await t.rollback();
    next(new AppError(ErrorMessages.SERVER.CLIENT_SPECS_CREATE, 500));
  }
};

exports.deleteFieldFromLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code, key } = req.params;

    const deletedCount = await FormConfig.destroy({ where: { config_code, key }, transaction: t });

    if (deletedCount === 0) {
      await t.rollback();
      return next(new AppError("The specified field key configuration was not found.", 404));
    }

    await Form.update(
      { custom_values: sequelize.literal(`custom_values - '${key}'`) },
      { where: { config_code }, transaction: t }
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: `Custom form field key '${key}' and all its corresponding historical data answers were cleared successfully.`
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};
