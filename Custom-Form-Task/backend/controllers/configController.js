const { sequelize, Client, Module, FormConfig, Section, SectionArea, Field, DeleteHistory } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? fallbackValue : parsed;
};

exports.getCombinedClientLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const activeLayoutConfigs = await FormConfig.findAll({
      where: { client_code },
      include: [
        {
          model: Section,
          as: 'sections',
          where: { is_active: true }, 
          required: false,
          include: [
            {
              model: SectionArea,
              as: 'areas',
              where: { is_active: true },
              required: false,
              include: [
                {
                  model: Field,
                  as: 'fields',
                  where: { is_active: true },
                  required: false
                }
              ]
            }
          ]
        }
      ],
      order: [
        ['created_at', 'DESC'],
        [{ model: Section, as: 'sections' }, 'section_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, 'area_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, { model: Field, as: 'fields' }, 'field_order', 'ASC']
      ]
    });

    return res.status(200).json({
      success: true,
      data: {
        client_code: targetClient.client_code,
        client_name: targetClient.client_name,
        configurations: activeLayoutConfigs
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.processConfigLayout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { client_code } = req.params;
    const { module_code, config_name, fields } = req.body;

    const targetModule = await Module.findOne({ where: { module_code, client_code }, transaction: t });
    if (!targetModule) {
      return next(new AppError("Target application module was not found under this client context.", 404));
    }

    let [configRecord] = await FormConfig.findOrCreate({
      where: { client_code, module_code },
      defaults: { config_name: config_name.trim() },
      transaction: t
    });

    if (configRecord.config_name !== config_name.trim()) {
      await configRecord.update({ config_name: config_name.trim() }, { transaction: t });
    }

    const config_code = configRecord.config_code;

    for (const field of fields) {
      const targetKey = field.key.trim();

      let existingField = await Field.findOne({
        include: [{
          model: SectionArea,
          as: 'parentArea',
          required: true,
          include: [{
            model: Section,
            as: 'parentSection',
            required: true,
            where: { config_code }
          }]
        }],
        where: { key: targetKey },
        transaction: t
      });

      const sectionName = field.section_name ? field.section_name.trim() : 'General Information';
      const areaName = field.area_name ? field.area_name.trim() : 'Main Group';

      let [sectionRecord] = await Section.findOrCreate({
        where: { config_code, section_name: sectionName },
        defaults: { section_order: safeInt(field.section_order, 1), is_active: true },
        transaction: t
      });

      if (!sectionRecord.is_active) {
        await sectionRecord.update({ is_active: true }, { transaction: t });
      }

      let [areaRecord] = await SectionArea.findOrCreate({
        where: { section_code: sectionRecord.section_code, area_name: areaName },
        defaults: { area_order: safeInt(field.area_order, 1), is_active: true },
        transaction: t
      });

      if (!areaRecord.is_active) {
        await areaRecord.update({ is_active: true }, { transaction: t });
      }

      const normalizedType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '');
      const fieldPayload = {
        area_code: areaRecord.area_code,
        label: field.label.trim(),
        type: field.type.trim(),
        is_required: field.is_required === true || field.is_required === 'true',
        length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || null),
        options: field.options || {},
        field_order: safeInt(field.field_order, 1),
        is_active: true 
      };

      if (existingField) {
        await existingField.update(fieldPayload, { transaction: t });
      } else {
        await Field.create({
          key: targetKey,
          ...fieldPayload
        }, { transaction: t });
      }
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: "Dynamic configuration forms blueprint state successfully captured and synchronized.",
      config_code
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

exports.swapLayoutPositions = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { target_layer, shifts } = req.body; 

    if (!shifts || !Array.isArray(shifts) || shifts.length === 0) {
      await t.rollback();
      return next(new AppError("Swapping sequence requires an array list coordinate object set.", 400));
    }

    for (const shift of shifts) {
      if (target_layer === 'SECTION') {
        await Section.update(
          { section_order: safeInt(shift.order_index, 1) },
          { where: { config_code, section_code: shift.code_identifier }, transaction: t }
        );
      } 
      else if (target_layer === 'AREA') {
        await SectionArea.update(
          { area_order: safeInt(shift.order_index, 1) },
          { where: { area_code: shift.code_identifier }, transaction: t }
        );
      } 
      else if (target_layer === 'FIELD') {
        await Field.update(
          { field_order: safeInt(shift.order_index, 1) },
          { where: { field_code: shift.code_identifier }, transaction: t }
        );
      }
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: `Positional grid layout swaps applied successfully across your ${target_layer.toLowerCase()} structural layers.`
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

exports.disableLayoutElement = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { config_code } = req.params;
    const { target_layer, target_code } = req.body; 

    const baseConfig = await FormConfig.findOne({ where: { config_code }, transaction: t });
    if (!baseConfig) {
      await t.rollback();
      return next(new AppError("Master template definition context trace failed.", 404));
    }

    let archiveFields = [];
    let parentContextCode = null;

    if (target_layer === 'SECTION') {
      const targetSection = await Section.findOne({
        where: { config_code, section_code: target_code },
        include: [{ model: SectionArea, as: 'areas', include: [{ model: Field, as: 'fields' }] }],
        transaction: t
      });
      if (!targetSection) throw new AppError("Section record missing.", 404);

      parentContextCode = config_code;

      await Section.update({ is_active: false }, { where: { section_code: target_code }, transaction: t });
      
      if (targetSection.areas) {
        const areaCodes = targetSection.areas.map(a => a.area_code);
        await SectionArea.update({ is_active: false }, { where: { area_code: areaCodes }, transaction: t });
        
        targetSection.areas.forEach(a => {
          if (a.fields) archiveFields.push(...a.fields);
        });
      }
    }
    else if (target_layer === 'AREA') {
      const targetArea = await SectionArea.findOne({
        where: { area_code: target_code },
        include: [{ model: Field, as: 'fields' }],
        transaction: t
      });
      if (!targetArea) throw new AppError("Section area target missing.", 404);

      parentContextCode = targetArea.section_code;

      await SectionArea.update({ is_active: false }, { where: { area_code: target_code }, transaction: t });
      if (targetArea.fields) archiveFields.push(...targetArea.fields);
    }
    else if (target_layer === 'FIELD') {
      const targetField = await Field.findOne({ where: { field_code: target_code }, transaction: t });
      if (!targetField) throw new AppError("Field layout component target missing.", 404);

      parentContextCode = targetField.area_code;
      archiveFields.push(targetField);
    }

    if (archiveFields.length > 0) {
      const activeFieldCodes = archiveFields.map(f => f.field_code);
      await Field.update({ is_active: false }, { where: { field_code: activeFieldCodes }, transaction: t });

      const historyEntries = archiveFields.map(f => ({
        config_code: baseConfig.config_code,
        client_code: baseConfig.client_code,
        module_code: baseConfig.module_code,
        key: f.key,
        action_type: `CASCADING_${target_layer}_DISABLE`,
        archived_options: f.options || {},
        archived_meta: { label: f.label, type: f.type, is_required: f.is_required, length: f.length }
      }));
      await DeleteHistory.bulkCreate(historyEntries, { transaction: t });
    }

    if (target_layer === 'SECTION') {
      const activeItems = await Section.findAll({
        where: { config_code: parentContextCode, is_active: true },
        order: [['section_order', 'ASC']],
        transaction: t
      });
      for (let i = 0; i < activeItems.length; i++) {
        await activeItems[i].update({ section_order: i + 1 }, { transaction: t });
      }
    } 
    else if (target_layer === 'AREA') {
      const activeItems = await SectionArea.findAll({
        where: { section_code: parentContextCode, is_active: true },
        order: [['area_order', 'ASC']],
        transaction: t
      });
      for (let i = 0; i < activeItems.length; i++) {
        await activeItems[i].update({ area_order: i + 1 }, { transaction: t });
      }
    } 
    else if (target_layer === 'FIELD') {
      const activeItems = await Field.findAll({
        where: { area_code: parentContextCode, is_active: true },
        order: [['field_order', 'ASC']],
        transaction: t
      });
      for (let i = 0; i < activeItems.length; i++) {
        await activeItems[i].update({ field_order: i + 1 }, { transaction: t });
      }
    }

    await t.commit();
    return res.status(200).json({
      success: true,
      message: `The dynamic structural ${target_layer.toLowerCase()} segment has been safely deactivated and structural sequence paths seamlessly re-sorted.`
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};

