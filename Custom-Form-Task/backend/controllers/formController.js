const { Form, FormConfig, Client } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.getFormLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const fields = await FormConfig.findAll({
      where: { client_id: targetClient.client_id }
    });

    if (!fields || fields.length === 0) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const dynamicCustomFields = {};
    fields.forEach(f => {
      dynamicCustomFields[f.key] = {
        config_code: f.config_code,
        key: f.key,
        label: f.label,
        type: f.type,
        is_required: f.is_required,
        length: f.length,
        value: null
      };
    });

    return res.status(200).json({
      success: true,
      client_name: targetClient.client_name,
      form_template: {
        employee_id: null,    
        employee_code: null,   
        name: "",               
        email: "",              
        custom_values: dynamicCustomFields 
      }
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.getAllDetails = async (req, res, next) => {
  try {
    const entries = await Form.findAll({
      order: [['employee_id', 'ASC']]
    });

    const payload = [];

    for (const item of entries) {
      const blueprints = await FormConfig.findAll({ 
        where: { client_id: item.client_id } 
      });

      const configMap = blueprints.map(b => ({
        config_code: b.config_code,
        label: b.label,
        key: b.key,
        value: item.custom_values && item.custom_values[b.key] !== undefined ? item.custom_values[b.key] : null,
        type: b.type
      }));

      payload.push({
        id: item.employee_id,
        employee_code: item.employee_code,
        name: item.name,
        email: item.email,
        config: configMap
      });
    }

    return res.status(200).json(payload);
  } 
  catch (error) {
    return next(error);
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
      where: { client_id: emp.client_id } 
    });

    const configMap = blueprints.map(b => ({
      config_code: b.config_code,
      label: b.label,
      key: b.key,
      value: emp.custom_values && emp.custom_values[b.key] !== undefined ? emp.custom_values[b.key] : null,
      type: b.type
    }));

    return res.status(200).json({
      id: emp.employee_id,
      employee_code: emp.employee_code,
      name: emp.name,
      email: emp.email,
      config: configMap
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.enterDetails = async (req, res, next) => {
  try {
    const { client_code } = req.params; 
    const { name, email, custom_values } = req.body;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const record = await Form.create({
      client_id: targetClient.client_id,
      name,
      email,
      custom_values: custom_values || {}
    });

    const fields = await FormConfig.findAll({ where: { client_id: targetClient.client_id } });

    const formattedConfig = fields.map(field => ({
      config_code: field.config_code,
      label: field.label,
      key: field.key,
      type: field.type,
      value: custom_values && custom_values[field.key] !== undefined ? custom_values[field.key] : null
    }));

    return res.status(201).json({
      success: true,
      message: "Employee data captured successfully.",
      id: record.employee_id,
      employee_code: record.employee_code,
      name: record.name,
      email: record.email,
      config: formattedConfig
    });
  } 
  catch (error) {
    return next(error);
  }
};
