const { Client, FormConfig, Form, DeleteHistory, sequelize } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

const handleBulkDelete = require('./layoutHandlers/handleBulkDelete');
const handleBulkCreate = require('./layoutHandlers/handleBulkCreate');
const handleFieldUpdates = require('./layoutHandlers/handleFieldUpdates');

const isFieldDeleted = (fieldItem) => {
  let opts = {};
  if (fieldItem.options) {
    if (typeof fieldItem.options === 'string') {
      try { opts = JSON.parse(fieldItem.options); } catch (e) {}
    } else if (typeof fieldItem.options === 'object') {
      opts = fieldItem.options;
    }
  }
  return opts.is_deleted_field === true || opts.is_deleted_field === 'true';
};

exports.getClientLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const allLayouts = await FormConfig.findAll({ 
      where: { client_id: targetClient.client_id },
      order: [
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ]
    });

    const sectionsMap = [];
    for (let i = 0; i < allLayouts.length; i++) {
      const layout = allLayouts[i];
      
      if (!isFieldDeleted(layout)) {
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
          options: layout.options 
        });
      }
    }

    return res.status(200).json({
      success: true,
      client_id: targetClient.client_id,
      client_code: targetClient.client_code,
      client_name: targetClient.client_name,
      sections_count: sectionsMap.length,
      sections: sectionsMap
    });
  } catch (error) {
    return next(error);
  }
};

exports.processConfigLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { identifier } = req.params; 
    const { target_type, fields } = req.body;

    let result;

    if (target_type === 'SECTION' || target_type === 'AREA') {
      result = await handleBulkDelete(identifier, req.body, t);
    } 
    else {
      const targetClient = await Client.findOne({ where: { client_code: identifier }, transaction: t });

      if (targetClient) {
        result = await handleBulkCreate(targetClient, fields, t);
      } else {
        result = await handleFieldUpdates(identifier, req.body, t);
      }
    }

    await t.commit();
    return res.status(result.status || 200).json({
      success: true,
      message: result.message,
      config_code: result.config_code || identifier
    });

  } catch (error) {
    try { await t.rollback(); } catch (e) {}
    return next(error);
  }
};

exports.updateFormLayoutStructure = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { fields } = req.body; 

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      await t.rollback();
      return next(new AppError("Reordering payload data must contain a valid, non-empty array list of fields.", 400));
    }

    for (const field of fields) {
      const targetKey = field.key ? String(field.key).trim() : '';
      if (!targetKey) continue;

      const existingRow = await FormConfig.findOne({
        where: { config_code, key: targetKey },
        transaction: t
      });

      if (!existingRow) {
        await t.rollback();
        return next(new AppError(`Target layout field not found for key: '${targetKey}'`, 404));
      }

      const finalSectionName = field.section_name !== undefined ? String(field.section_name).trim() : existingRow.section_name;
      const finalAreaName = field.area_name !== undefined ? String(field.area_name).trim() : existingRow.area_name;
      
      const finalSectionOrder = field.section_order !== undefined ? parseInt(field.section_order) : existingRow.section_order;
      const finalAreaOrder = field.area_order !== undefined ? parseInt(field.area_order) : existingRow.area_order;
      const finalFieldOrder = field.field_order !== undefined ? parseInt(field.field_order) : existingRow.field_order;

      await FormConfig.update({
        section_name: finalSectionName,
        section_order: finalSectionOrder,
        area_name: finalAreaName,
        area_order: finalAreaOrder,
        field_order: finalFieldOrder
      }, {
        where: { config_code, key: targetKey },
        transaction: t,
        hooks: false,             
        individualHooks: false    
      });
    }

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Form structural layout transformations and sorting order parameters applied successfully."
    });

  } catch (error) {
    try { await t.rollback(); } catch (err) {}
    return next(error);
  }
};

exports.deleteFieldFromLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    
    const targetType = req.body.type ? String(req.body.type).trim().toUpperCase() : 'FIELD';
    const targetKey = req.body.key ? String(req.body.key).trim() : '';

    if (targetType === 'SECTION' || targetType === 'AREA') {
      const mockBody = {
        target_type: targetType,
        section_name: req.body.section_name,
        area_name: req.body.area_name
      };

      const result = await handleBulkDelete(config_code, mockBody, t);
      await t.commit();
      
      return res.status(200).json({
        success: true,
        message: result.message
      });
    }

    if (!targetKey) {
      await t.rollback();
      return next(new AppError("A field profile identity 'key' parameter is required in the body block for single field deletions.", 400));
    }

    const existingLayout = await FormConfig.findOne({ 
      where: { config_code, key: targetKey }, 
      transaction: t 
    });

    if (!existingLayout) {
      await t.rollback();
      return next(new AppError(`The specified field element key '${targetKey}' was not found.`, 404));
    }

    let currentOptions = {};
    if (existingLayout.options) {
      if (typeof existingLayout.options === 'string') {
        try { currentOptions = JSON.parse(existingLayout.options); } catch (e) {}
      } else if (typeof existingLayout.options === 'object') {
        currentOptions = existingLayout.options;
      }
    }
    
    if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
      await t.rollback();
      return next(new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403));
    }

    const currentClientId = existingLayout.client_id;
    const updatedOptions = { ...currentOptions, is_deleted_field: true };

    await DeleteHistory.create({
      config_code: existingLayout.config_code,
      client_id: existingLayout.client_id,
      key: existingLayout.key,
      label: existingLayout.label,
      type: existingLayout.type,
      is_required: existingLayout.is_required,
      length: existingLayout.length,
      section_name: existingLayout.section_name,
      section_order: existingLayout.section_order,
      area_name: existingLayout.area_name,
      area_order: existingLayout.area_order,
      field_order: existingLayout.field_order,
      archived_options: currentOptions, 
      action_type: 'SINGLE_FIELD_SOFT_DELETE'
    }, { transaction: t });

    await FormConfig.update(
      { options: updatedOptions },
      { where: { config_code, key: targetKey }, transaction: t }
    );

    await Form.update(
      { custom_values: sequelize.literal("custom_values - '" + targetKey + "'") },
      { where: { client_id: currentClientId }, transaction: t }
    );

    await t.commit();
    return res.status(200).json({
      success: true,
      message: `Form field element key '${targetKey}' was successfully soft-deleted, logged to history, and removed from profiles.`
    });

  } catch (error) {
    try { await t.rollback(); } catch (rollbackErr) {}
    return next(error);
  }
};
