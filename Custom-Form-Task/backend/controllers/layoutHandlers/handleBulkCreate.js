const { FormConfig, Section, SectionArea, Field } = require('../../models');
const AppError = require('../../utils/appError');
const { v4: uuidv4 } = require('uuid');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? fallbackValue : parsed;
};

module.exports = async (targetModule, fields, t) => {
  if (!fields || !Array.isArray(fields) || fields.length === 0) {
    throw new AppError("Fields payload configuration array must be a valid, non-empty list.", 400);
  }

  const unifiedFormConfigCode = uuidv4();
  const uniqueSectionNames = [...new Set(fields.map(f => f.section_name ? f.section_name.trim() : 'General Information'))];
  const sectionLookups = {};

  for (const name of uniqueSectionNames) {
    const matchingField = fields.find(f => (f.section_name ? f.section_name.trim() : 'General Information') === name);
    const orderIndex = safeInt(matchingField ? matchingField.section_order : 1, 1);

    const [sectionRow] = await Section.findOrCreate({
      where: { config_code: unifiedFormConfigCode, section_name: name },
      defaults: { section_order: orderIndex, is_active: true },
      transaction: t
    });
    
    sectionLookups[name] = sectionRow.section_code;
  }

  const areaLookups = {};

  for (const field of fields) {
    const secName = field.section_name ? field.section_name.trim() : 'General Information';
    const areaName = field.area_name ? field.area_name.trim() : 'Main Group';
    const targetSectionCode = sectionLookups[secName];
    const compositeAreaLookupKey = `${targetSectionCode}_${areaName}`;

    if (!areaLookups[compositeAreaLookupKey]) {
      const orderIndex = safeInt(field.area_order, 1);
      
      const [areaRow] = await SectionArea.findOrCreate({
        where: { section_code: targetSectionCode, area_name: areaName },
        defaults: { area_order: orderIndex, is_active: true },
        transaction: t
      });
      
      areaLookups[compositeAreaLookupKey] = areaRow.area_code;
    }
  }

  const bulkInsertPayload = fields.map(field => {
    const secName = field.section_name ? field.section_name.trim() : 'General Information';
    const areaName = field.area_name ? field.area_name.trim() : 'Main Group';
    const targetSectionCode = sectionLookups[secName];
    const targetAreaCode = areaLookups[`${targetSectionCode}_${areaName}`];
    const normalizedType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '');

    return {
      field_code: uuidv4(),
      area_code: targetAreaCode,
      key: field.key.trim(),
      label: field.label.trim(),
      type: field.type.trim(),
      is_required: field.is_required === true || field.is_required === 'true',
      length: ['date', 'datetime'].includes(normalizedType) ? null : (field.length || null),
      options: field.options || {},
      field_order: safeInt(field.field_order, 1),
      is_active: true
    };
  });

  await Field.bulkCreate(bulkInsertPayload, { transaction: t });
  return { 
    message: "Dynamic multi-module structural template components compiled and built successfully.", 
    config_code: unifiedFormConfigCode, 
    status: 201 
  };
};
