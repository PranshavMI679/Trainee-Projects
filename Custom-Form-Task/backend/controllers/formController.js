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
        options: f.options, 
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
  } catch (error) {
    return next(error);
  }
};

exports.getAllDetails = async (req, res, next) => {
  try {
    const entries = await Form.findAll({
      order: [['employee_id', 'ASC']]
    });

    if (entries.length === 0) {
      return res.status(200).json([]);
    }

    const clientIds = [...new Set(entries.map(item => item.client_id))];
    const allBlueprints = await FormConfig.findAll({
      where: { client_id: clientIds }
    });

    const blueprintMap = {};
    allBlueprints.forEach(b => {
      if (!blueprintMap[b.client_id]) blueprintMap[b.client_id] = [];
      blueprintMap[b.client_id].push(b);
    });

    const payload = entries.map(item => {
      const clientBlueprints = blueprintMap[item.client_id] || [];

      const configMap = clientBlueprints.map(b => ({
        config_code: b.config_code,
        label: b.label,
        key: b.key,
        type: b.type,
        options: b.options, 
        value: item.custom_values && item.custom_values[b.key] !== undefined ? item.custom_values[b.key] : null
      }));

      return {
        id: item.employee_id,
        employee_code: item.employee_code,
        name: item.name,
        email: item.email,
        config: configMap
      };
    });

    return res.status(200).json(payload);
  } catch (error) {
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
      type: b.type,
      options: b.options,
      value: emp.custom_values && emp.custom_values[b.key] !== undefined ? emp.custom_values[b.key] : null
    }));

    return res.status(200).json({
      id: emp.employee_id,
      employee_code: emp.employee_code,
      name: emp.name,
      email: emp.email,
      config: configMap
    });
  } catch (error) {
    return next(error);
  }
};

exports.processFormDetails = async (req, res, next) => {
  try {
    const { code } = req.params; 
    const { name, email, custom_values } = req.body;

    let record;
    let fieldsConfig;
    let finalCustomValues = {};
    let isNewSubmission = false;
    let clientId;

    const targetClient = await Client.findOne({ where: { client_code: code } });

    if (targetClient) {
      isNewSubmission = true;
      clientId = targetClient.client_id;
      finalCustomValues = custom_values || {};

      if (!name || !email) {
        return next(new AppError("Root parameters 'name' and 'email' are strictly required for new submissions.", 400));
      }
    } else {
      record = await Form.findOne({ where: { employee_code: code } });
      if (!record) {
        return next(new AppError("The provided code does not match any active client layout or employee record.", 404));
      }
      clientId = record.client_id;

      finalCustomValues = record.custom_values ? { ...record.custom_values } : {};
      
      if (custom_values && typeof custom_values === 'object') {
        const inputKeys = Object.keys(custom_values);
        for (let i = 0; i < inputKeys.length; i++) {
          const key = inputKeys[i];
          const currentInput = custom_values[key];

          if (currentInput === null || currentInput === undefined || (typeof currentInput === 'string' && currentInput.trim() === "")) {
            delete finalCustomValues[key];
          } else {
            finalCustomValues[key] = typeof currentInput === 'string' ? currentInput.trim() : currentInput;
          }
        }
      }
    }

    fieldsConfig = await FormConfig.findAll({ where: { client_id: clientId } });
    
    for (let i = 0; i < fieldsConfig.length; i++) {
      const field = fieldsConfig[i];
      if (field.is_required) {
        const value = finalCustomValues[field.key];
        
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }

        if (typeof value === 'string' && value.trim() === "") {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }
      }
    }

    if (isNewSubmission) {
      record = await Form.create({
        client_id: clientId,
        name,
        email,
        custom_values: finalCustomValues
      });
    } else {
      await record.update({
        name: name !== undefined ? name : record.name,
        email: email !== undefined ? email : record.email,
        custom_values: finalCustomValues
      });
    }

    const formattedConfig = fieldsConfig.map(field => ({
      config_code: field.config_code,
      label: field.label,
      key: field.key,
      type: field.type,
      options: field.options,
      value: record.custom_values && record.custom_values[field.key] !== undefined 
        ? record.custom_values[field.key] 
        : null
    }));

    return res.status(isNewSubmission ? 201 : 200).json({
      success: true,
      message: isNewSubmission ? "Employee data captured successfully." : "Employee data updated successfully.",
      id: record.employee_id,
      employee_code: record.employee_code,
      name: record.name,
      email: record.email,
      config: formattedConfig
    });

  } catch (error) {
    return next(error);
  }
};


/*
exports.enterDetails = async (req, res, next) => {
  try {
    const { client_code } = req.params; 
    const { name, email, custom_values } = req.body;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const fieldsConfig = await FormConfig.findAll({ where: { client_id: targetClient.client_id } });
    
    for (let i = 0; i < fieldsConfig.length; i++) {
      const field = fieldsConfig[i];
      if (field.is_required) {
        const value = custom_values ? custom_values[field.key] : undefined;
        
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }

        if (typeof value === 'string' && value.trim() === "") {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }
      }
    }

    const record = await Form.create({
      client_id: targetClient.client_id,
      name,
      email,
      custom_values: custom_values || {}
    });

    const formattedConfig = fieldsConfig.map(field => ({
      config_code: field.config_code,
      label: field.label,
      key: field.key,
      type: field.type,
      options: field.options,
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
  } catch (error) {
    return next(error);
  }
};

exports.editFormDetails = async (req, res, next) => {
  try {
    const { employee_code } = req.params; 
    const { name, email, custom_values } = req.body;

    const record = await Form.findOne({ where: { employee_code } });
    if (!record) {
      return next(new AppError(ErrorMessages.FORM.RECORD_NOT_FOUND, 404));
    }

    let existingValues = record.custom_values ? { ...record.custom_values } : {};
    
    if (custom_values && typeof custom_values === 'object') {
      const inputKeys = Object.keys(custom_values);
      for (let i = 0; i < inputKeys.length; i++) {
        const key = inputKeys[i];
        const currentInput = custom_values[key];

        if (currentInput === null || currentInput === undefined) {
          delete existingValues[key];
        } else {
          existingValues[key] = currentInput;
        }
      }
    }

    const fieldsConfig = await FormConfig.findAll({ where: { client_id: record.client_id } });

    for (let i = 0; i < fieldsConfig.length; i++) {
      const field = fieldsConfig[i];
      if (field.is_required) {
        const value = existingValues[field.key];
        
        if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }

        if (typeof value === 'string' && value.trim() === "") {
          return next(new AppError(`The dynamic field '${field.label}' is marked mandatory.`, 400));
        }
      }
    }

    await record.update({
      name: name !== undefined ? name : record.name,
      email: email !== undefined ? email : record.email,
      custom_values: existingValues
    });

    const formattedConfig = fieldsConfig.map(field => ({
      config_code: field.config_code,
      label: field.label,
      key: field.key,
      type: field.type,
      options: field.options,
      value: record.custom_values && record.custom_values[field.key] !== undefined 
        ? record.custom_values[field.key] 
        : null
    }));

    return res.status(200).json({
      success: true,
      message: "Employee data updated successfully.",
      id: record.employee_id,
      employee_code: record.employee_code,
      name: record.name,
      email: record.email,
      config: formattedConfig
    });
  } catch (error) {
    return next(error);
  }
};
*/

