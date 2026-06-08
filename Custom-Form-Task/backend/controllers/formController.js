const { Form, FormConfig } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

exports.getAllDetails = async (req, res, next) => {
  try {
    const entries = await Form.findAll({
      order: [['employee_id', 'ASC']]
    });

    const payload = [];

    for (const item of entries) {
      const blueprints = await FormConfig.findAll({ 
        where: { config_code: item.config_code } 
      });

      const configMap = blueprints.map(b => ({
        label: b.label,
        key: b.key,
        value: item.custom_values && item.custom_values[b.key] !== undefined ? item.custom_values[b.key] : null,
        type: b.type
      }));

      payload.push({
        id: item.employee_id,
        name: item.name,
        email: item.email,
        config: configMap
      });
    }

    return res.status(200).json(payload);
  } catch (error) {
    next(new AppError(ErrorMessages.SERVER.EMPLOYEE_FETCH, 500));
  }
};

exports.getFormLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const fields = await FormConfig.findAll({
      where: { client_id: client_code }
    });

    if (!fields || fields.length === 0) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const targetConfigCode = fields[0].config_code;
    const targetClientName = fields[0].client_name;

    const layoutBlueprint = fields.map(f => ({
      key: f.key,
      label: f.label,
      type: f.type,
      is_required: f.is_required,
      length: f.length
    }));

    return res.status(200).json({
      config_code: targetConfigCode,
      client_name: targetClientName,
      fields: layoutBlueprint
    });
  } catch (error) {
    next(new AppError(ErrorMessages.SERVER.LAYOUT_FETCH, 500));
  }
};

exports.getEmployeeDetails = async (req, res, next) => {
  try {
    const { employee_code } = req.params;

    const emp = await Form.findOne({ where: { employee_code } });
    if (!emp) {
      return next(new AppError(ErrorMessages.FORM.RECORD_NOT_FOUND, 404));
    }

    const blueprints = await FormConfig.findAll({ 
      where: { config_code: emp.config_code } 
    });

    const configMap = blueprints.map(b => ({
      label: b.label,
      key: b.key,
      value: emp.custom_values && emp.custom_values[b.key] !== undefined ? emp.custom_values[b.key] : null,
      type: b.type
    }));

    return res.status(200).json({
      id: emp.employee_id,
      name: emp.name,
      email: emp.email,
      config: configMap
    });
  } catch (error) {
    next(new AppError(ErrorMessages.SERVER.EMPLOYEE_FETCH, 500));
  }
};

exports.enterDetails = async (req, res, next) => {
  try {
    const { config_code } = req.params; 
    const { name, email, custom_values } = req.body;

    const record = await Form.create({
      config_code,
      name,
      email,
      custom_values: custom_values || {}
    });

    const fields = await FormConfig.findAll({ where: { config_code } });

    const formattedConfig = fields.map(field => ({
      label: field.label,
      key: field.key,
      value: custom_values && custom_values[field.key] !== undefined ? custom_values[field.key] : null,
      type: field.type
    }));

    return res.status(201).json({
      id: record.employee_id,
      name: record.name,
      email: record.email,
      config: formattedConfig
    });
  } catch (error) {
    next(new AppError(ErrorMessages.FORM.SUBMISSION_FAILED, 500));
  }
};
