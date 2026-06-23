const { Client, Module, FormConfig, DeleteHistory, Form, sequelize } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const isFieldDeleted = (fieldItem) => {
  let opts = {};
  if (fieldItem.options) {
    if (typeof fieldItem.options === 'string') {
      try { opts = JSON.parse(fieldItem.options); } catch (e) {}
    } else if (typeof fieldItem.options === 'object') {
      opts = fieldItem.options;
    }
  }
  return opts.is_deleted_field === true || 
         opts.is_deleted_field === 'true' || 
         opts.is_delete === true || 
         opts.is_delete === 'true';
};

exports.getClientLayout = async (req, res, next) => {
  try {
    const { module_code } = req.params;

    const targetModule = await Module.findOne({ where: { module_code } });
    if (!targetModule) {
      return next(new AppError("The target application workspace module was not found.", 404));
    }

    const allLayouts = await FormConfig.findAll({ 
      where: { module_code: targetModule.module_code },
      order: [
        ['section_order', 'ASC'],
        ['area_order', 'ASC'],
        ['field_order', 'ASC']
      ],
      raw: true 
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
      status: 'success',
      data: {
        client_code: targetModule.client_code,
        module_code: targetModule.module_code,
        module_name: targetModule.module_name,
        sections_count: sectionsMap.length,
        sections: sectionsMap
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.processConfigLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { identifier } = req.params; 
    const { fields } = req.body; 

    let result;
    const targetModule = await Module.findOne({ where: { module_code: identifier }, transaction: t });

    if (targetModule) {
      const handleBulkCreate = require('./layoutHandlers/handleBulkCreate');
      result = await handleBulkCreate(targetModule, fields, t);
    } else {
      const handleFieldUpdates = require('./layoutHandlers/handleFieldUpdates');
      result = await handleFieldUpdates(identifier, req.body, t);
    }

    await t.commit();
    return res.status(result.status || 200).json({
      status: 'success',
      message: result.message,
      data: {
        config_code: result.config_code || identifier
      }
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
      return next(new AppError("Reordering payload data must contain a valid, non-empty array list of structural coordinate updates.", 400));
    }

    for (const field of fields) {
      const targetKey = field.key ? String(field.key).trim() : '';
      if (!targetKey) continue;

      const existingRow = await FormConfig.findOne({
        where: { config_code, key: targetKey },
        attributes: ['section_name', 'section_order', 'area_name', 'area_order', 'field_order'],
        transaction: t
      });

      if (!existingRow) {
        await t.rollback();
        return next(new AppError(`Target configuration layout line item row not found for identifier field key: '${targetKey}'`, 404));
      }

      const finalSectionName = field.section_name !== undefined ? String(field.section_name).trim() : existingRow.section_name;
      const finalAreaName = field.area_name !== undefined ? String(field.area_name).trim() : existingRow.area_name;
      
      const finalSectionOrder = field.section_order !== undefined ? parseInt(field.section_order, 10) : existingRow.section_order;
      const finalAreaOrder = field.area_order !== undefined ? parseInt(field.area_order, 10) : existingRow.area_order;
      const finalFieldOrder = field.field_order !== undefined ? parseInt(field.field_order, 10) : existingRow.field_order;

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
      status: 'success',
      message: "Form structural layout transformations and sorting order parameters applied successfully."
    });
  } 
  catch (error) {
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

      const handleBulkDelete = require('./layoutHandlers/handleBulkDelete');
      const result = await handleBulkDelete(config_code, mockBody, t);
      await t.commit();
      
      return res.status(200).json({
        status: 'success',
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
        try { currentOptions = JSON.parse(existingLayout.options); } catch (e) { currentOptions = {}; }
      } else if (typeof existingLayout.options === 'object') {
        currentOptions = existingLayout.options;
      }
    }
    
    if (currentOptions.can_delete === false || currentOptions.can_delete === 'false') {
      await t.rollback();
      return next(new AppError(`The configuration field '${targetKey}' is locked and cannot be deleted.`, 403));
    }

    const updatedOptions = { ...currentOptions, is_deleted_field: true };

    await DeleteHistory.create({
      config_code: existingLayout.config_code,
      client_code: existingLayout.client_code,
      module_code: existingLayout.module_code,
      key: existingLayout.key,
      action_type: 'SINGLE_FIELD_SOFT_DELETE',
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
    }, { transaction: t });

    await FormConfig.update(
      { options: updatedOptions },
      { where: { config_code, key: targetKey }, transaction: t }
    );

    await Form.update(
      { custom_values: sequelize.literal(`custom_values - '${targetKey}'`) },
      { 
        where: { 
          client_code: existingLayout.client_code, 
          module_code: existingLayout.module_code 
        }, 
        transaction: t 
      }
    );

    await t.commit();
    return res.status(200).json({
      status: 'success',
      message: `Form field element key '${targetKey}' was successfully soft-deleted, logged to history, and removed from active profiles.`
    });
  } 
  catch (error) {
    try { await t.rollback(); } catch (rollbackErr) {}
    return next(error);
  }
};
