const { Form, FormConfig, Client } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const isFieldDeleted = (fieldItem) => {
  if (!fieldItem || !fieldItem.options) return false;
  let opts = fieldItem.options;
  
  if (typeof opts === 'string') {
    try {
      opts = JSON.parse(opts);
      if (typeof opts === 'string') {
        opts = JSON.parse(opts);
      }
    } catch (e) {
      return false;
    }
  }
  if (!opts || typeof opts !== 'object' || Array.isArray(opts)) return false;
  return opts.is_deleted_field === true || 
         opts.is_deleted_field === 'true' ||
         opts.is_delete === true ||
         opts.is_delete === 'true';
};

exports.getFormLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }
                                                                                                                                                                                                                                           
    const allFields = await FormConfig.findAll({
      where: { client_id: targetClient.client_id },
      order: [
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ]
    });

    const sectionsMap = [];
    let absoluteFieldCount = 0;

    for (let i = 0; i < allFields.length; i++) {
      const layout = allFields[i];
      
      if (!isFieldDeleted(layout)) {
        absoluteFieldCount++;

        let section = sectionsMap.find(s => s.section_name === layout.section_name);
        if (!section) {
          section = {
            section_name: layout.section_name,
            section_order: layout.section_order || 1,
            section_areas: []
          };
          sectionsMap.push(section);
        }

        let area = section.section_areas.find(a => a.area_name === layout.area_name);
        if (!area) {
          area = {
            area_name: layout.area_name,
            area_order: layout.area_order || 1,
            fields: []
          };
          section.section_areas.push(area);
        }

        area.fields.push({
          config_code: layout.config_code,
          key: layout.key,
          label: layout.label,
          type: layout.type,
          is_required: layout.is_required,
          length: layout.length,
          field_order: layout.field_order || 1,
          options: layout.options,
          value: null 
        });
      }
    }

    if (absoluteFieldCount === 0) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    sectionsMap.sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order;
      }
      return a.section_name.localeCompare(b.section_name);
    });

    for (let i = 0; i < sectionsMap.length; i++) {
      sectionsMap[i].section_areas.sort((a, b) => {
        if (a.area_order !== b.area_order) {
          return a.area_order - b.area_order;
        }
        return a.area_name.localeCompare(b.area_name);
      });
    }

    return res.status(200).json({
      success: true,
      client_name: targetClient.client_name,
      form_template: {
        employee_id: null,    
        employee_code: null,   
        name: "",               
        email: "",              
        sections: sectionsMap 
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
      where: { client_id: clientIds },
      order: [
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ]
    });

    const blueprintMap = {};
    allBlueprints.forEach(b => {
      if (!isFieldDeleted(b)) {
        if (!blueprintMap[b.client_id]) blueprintMap[b.client_id] = [];
        blueprintMap[b.client_id].push(b);
      }
    });

    const payload = entries.map(item => {
      const clientBlueprints = blueprintMap[item.client_id] || [];

      const configMap = clientBlueprints.map(b => ({
        config_code: b.config_code,
        label: b.label,
        key: b.key,
        type: b.type,
        section_name: b.section_name,
        area_name: b.area_name,
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

    const allBlueprints = await FormConfig.findAll({ 
      where: { client_id: emp.client_id },
      order: [
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ]
    });

    const blueprints = [];
    for (let i = 0; i < allBlueprints.length; i++) {
      if (!isFieldDeleted(allBlueprints[i])) {
        blueprints.push(allBlueprints[i]);
      }
    }

    const configMap = blueprints.map(b => ({
      config_code: b.config_code,
      label: b.label,
      key: b.key,
      type: b.type,
      section_name: b.section_name,
      area_name: b.area_name,
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
    let fieldsConfig = [];
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

          if (currentInput === null || currentInput === undefined || 
             (typeof currentInput === 'string' && currentInput.trim() === "")) {
            delete finalCustomValues[key];
          } else {
            finalCustomValues[key] = typeof currentInput === 'string' ? currentInput.trim() : currentInput;
          }
        }
      }
    }

    const allFields = await FormConfig.findAll({ 
      where: { client_id: clientId },
      order: [
        ['updated_at', 'DESC'], 
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ]
    });
    
    const observedKeys = new Set();

    for (let i = 0; i < allFields.length; i++) {
      const fieldRow = allFields[i];
      if (!fieldRow.key || observedKeys.has(fieldRow.key)) continue;

      if (!isFieldDeleted(fieldRow)) {
        observedKeys.add(fieldRow.key);
        fieldsConfig.push(fieldRow);
      }
    }
    
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

    const formattedConfig = [];
    for (let i = 0; i < fieldsConfig.length; i++) {
      const field = fieldsConfig[i];
      
      let finalValue = null;
      if (record.custom_values && record.custom_values[field.key] !== undefined) {
        finalValue = record.custom_values[field.key];
      }

      let displayOptions = null;
      if (field.options) {
        try {
          let opts = typeof field.options === 'string' ? JSON.parse(field.options) : field.options;
          if (Array.isArray(opts)) {
            displayOptions = opts;
          } else if (opts && Array.isArray(opts.value)) {
            displayOptions = opts.value;
          }
        } catch (e) {
          displayOptions = null;
        }
      }

      formattedConfig.push({
        config_code: field.config_code,
        label: field.label,
        key: field.key,
        type: field.type,
        section_name: field.section_name,
        section_order: field.section_order || 1,
        area_name: field.area_name,
        area_order: field.area_order || 1,
        options: displayOptions,
        value: finalValue
      });
    }

    formattedConfig.sort((a, b) => {
      if (a.section_order !== b.section_order) {
        return a.section_order - b.section_order;
      }
      const secComp = a.section_name.localeCompare(b.section_name);
      if (secComp !== 0) return secComp;

      if (a.area_order !== b.area_order) {
        return a.area_order - b.area_order;
      }
      return a.area_name.localeCompare(b.area_name);
    });

    return res.status(isNewSubmission ? 201 : 200).json({
      success: true,
      message: isNewSubmission ? "Employee data captured successfully." : "Employee data updated successfully.",
      id: record.employee_id || record.id,
      employee_code: record.employee_code,
      name: record.name,
      email: record.email,
      config: formattedConfig
    });

  } catch (error) {
    return next(error);
  }
};
