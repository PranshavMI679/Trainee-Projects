const { sequelize, Client, Employee, Module, FormConfig, Section, SectionArea, Field, FormDataSubmission } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const crypto = require('crypto');

const safeInt = (value, fallbackValue) => {
  if (value === undefined || value === null) return fallbackValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed < 1 ? fallbackValue : parsed;
};

exports.getModuleLayout = async (req, res, next) => {
  try {
    const { module_code } = req.params;

    const targetModule = await Module.findOne({
      where: { module_code },
      include: [{ model: Client, as: 'clientWorkspace', attributes: ['client_name'] }]
    });

    if (!targetModule) {
      return next(new AppError("The target application workspace module was not found.", 404));
    }

    const moduleConfig = await FormConfig.findOne({
      where: { module_code },
      include: [{
        model: Section,
        as: 'sections',
        required: false,
        include: [{
          model: SectionArea,
          as: 'areas',
          required: false,
          include: [{
            model: Field,
            as: 'fields',
            required: false
          }]
        }]
      }],
      order: [
        [{ model: Section, as: 'sections' }, 'section_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, 'area_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, { model: Field, as: 'fields' }, 'field_order', 'ASC']
      ]
    });

    let filteredLayout = null;
    if (moduleConfig) {
      const configJson = moduleConfig.toJSON();
      const activeSections = [];

      for (const sec of configJson.sections || []) {
        // Drop section if deactivated or explicitly soft-deleted
        if (sec.is_active === false || sec.options?.is_delete === true || sec.options?.is_delete === 'true') continue;
        const activeAreas = [];

        for (const ar of sec.areas || []) {
          // Drop area if deactivated or explicitly soft-deleted
          if (ar.is_active === false || ar.options?.is_delete === true || ar.options?.is_delete === 'true') continue;

          const activeFields = (ar.fields || []).filter(f => {
            // Check structural column level activation
            if (f.is_active === false) return false;

            const opts = f.options || {};
            return !(
              opts.is_field_deleted === true || opts.is_field_deleted === 'true' ||
              opts.is_deleted === true || opts.is_deleted === 'true' ||
              opts.is_deleted_field === true || opts.is_deleted_field === 'true'
            );
          });

          if (activeFields.length > 0) {
            activeAreas.push({ ...ar, fields: activeFields });
          }
        }

        if (activeAreas.length > 0) {
          activeSections.push({ ...sec, areas: activeAreas });
        }
      }
      configJson.sections = activeSections;
      filteredLayout = configJson;
    }

    return res.status(200).json({
      success: true,
      data: {
        client_name: targetModule.clientWorkspace?.client_name || "Unknown Tenant",
        module_name: targetModule.module_name,
        module_code: targetModule.module_code,
        layout: filteredLayout
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getCombinedFormLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const combinedLayouts = await FormConfig.findAll({
      where: { client_code },
      include: [{
        model: Section,
        as: 'sections',
        required: false,
        include: [{
          model: SectionArea,
          as: 'areas',
          required: false,
          include: [{
            model: Field,
            as: 'fields',
            required: false
          }]
        }]
      }],
      order: [
        ['created_at', 'DESC'],
        [{ model: Section, as: 'sections' }, 'section_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, 'area_order', 'ASC'],
        [{ model: Section, as: 'sections' }, { model: SectionArea, as: 'areas' }, { model: Field, as: 'fields' }, 'field_order', 'ASC']
      ]
    });
    const filteredTemplates = [];

    for (const config of combinedLayouts) {
      const configJson = config.toJSON();
      const activeSections = [];

      for (const sec of configJson.sections || []) {
        // Drop section if deactivated or explicitly soft-deleted
        if (sec.is_active === false || sec.options?.is_delete === true || sec.options?.is_delete === 'true') continue;
        const activeAreas = [];

        for (const ar of sec.areas || []) {
          // Drop area if deactivated or explicitly soft-deleted
          if (ar.is_active === false || ar.options?.is_delete === true || ar.options?.is_delete === 'true') continue;

          const activeFields = (ar.fields || []).filter(f => {
            // Check structural column level activation
            if (f.is_active === false) return false;

            const opts = f.options || {};
            return !(
              opts.is_field_deleted === true || opts.is_field_deleted === 'true' ||
              opts.is_deleted === true || opts.is_deleted === 'true' ||
              opts.is_deleted_field === true || opts.is_deleted_field === 'true'
            );
          });

          if (activeFields.length > 0) {
            activeAreas.push({ ...ar, fields: activeFields });
          }
        }

        if (activeAreas.length > 0) {
          activeSections.push({ ...sec, areas: activeAreas });
        }
      }

      configJson.sections = activeSections;
      filteredTemplates.push(configJson);
    }

    return res.status(200).json({
      success: true,
      data: {
        client_name: targetClient.client_name,
        client_code: targetClient.client_code,
        form_templates: filteredTemplates
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getEmployeeCombinedDetails = async (req, res, next) => {
  try {
    const { employee_code } = req.params;

    if (!employee_code || String(employee_code).trim() === "") {
      return next(new AppError(ErrorMessages.FORM.CODE_REQUIRED || "Employee lookup tracking identifier is required.", 400));
    }

    const submission = await FormDataSubmission.findOne({
      where: { employee_code: String(employee_code).trim() },
      include: [{
        model: Client,
        as: 'submittingClient',
        attributes: ['client_name']
      }]
    });

    if (!submission) {
      return next(new AppError(ErrorMessages.FORM.RECORD_NOT_FOUND, 404));
    }

    const activeConfigs = await FormConfig.findAll({
      where: { client_code: submission.client_code },
      include: [{
        model: Section,
        as: 'sections',
        required: false,
        include: [{
          model: SectionArea,
          as: 'areas',
          required: false,
          include: [{
            model: Field,
            as: 'fields',
            required: false
          }]
        }]
      }]
    });

    const activeKeysDictionary = {};
    for (const config of activeConfigs) {
      if (!config.sections) continue;
      for (const sec of config.sections) {
        if (sec.is_active === false || sec.options?.is_delete === true || sec.options?.is_delete === 'true') continue;
        if (!sec.areas) continue;
        for (const ar of sec.areas) {
          if (ar.is_active === false || ar.options?.is_delete === true || ar.options?.is_delete === 'true') continue;
          if (!ar.fields) continue;
          for (const f of ar.fields) {
            if (f.is_active === false) continue;
            
            const opts = f.options || {};
            const isDeleted = opts.is_field_deleted === true || opts.is_deleted === true || opts.is_deleted_field === true;
            if (isDeleted) continue;
            
            activeKeysDictionary[f.key] = { label: f.label, type: f.type };
          }
        }
      }
    }

    const userValues = submission.custom_values ? { ...submission.custom_values } : {};
    const finalizedOutputConfigPayload = {};

    Object.keys(activeKeysDictionary).forEach(key => {
      finalizedOutputConfigPayload[key] = {
        label: activeKeysDictionary[key].label,
        type: activeKeysDictionary[key].type,
        value: userValues[key] !== undefined ? userValues[key] : null
      };
    });

    return res.status(200).json({
      success: true,
      message: "Employee multi-module dynamic profile details successfully retrieved.",
      data: {
        employee_code: submission.employee_code,
        client_code: submission.client_code,
        client_name: submission.submittingClient?.client_name || "Unknown Tenant",
        submission_id: submission.submission_id,
        updated_at: submission.updated_at,
        combined_profile_data: finalizedOutputConfigPayload
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.processCombinedFormDetails = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { client_code } = req.params;
    const { custom_values } = req.body;

    const activeConfigs = await FormConfig.findAll({
      where: { client_code },
      include: [{
        model: Section,
        as: 'sections',
        include: [{
          model: SectionArea,
          as: 'areas',
          include: [{
            model: Field,
            as: 'fields'
          }]
        }]
      }],
      transaction: t
    });

    const activeKeysSet = new Set();
    const deletedKeysSet = new Set();

    for (const config of activeConfigs) {
      if (!config.sections) continue;
      for (const sec of config.sections) {
        const isSectionDeleted = sec.is_active === false || 
                                 sec.options?.is_delete === true || 
                                 sec.options?.is_delete === 'true';

        if (!sec.areas) continue;
        for (const ar of sec.areas) {
          const isAreaDeleted = isSectionDeleted || 
                               ar.is_active === false || 
                               ar.options?.is_delete === true || 
                               ar.options?.is_delete === 'true';

          if (!ar.fields) continue;
          for (const f of ar.fields) {
            const opts = f.options || {};
            const isFieldDeleted = isAreaDeleted ||
                                  f.is_active === false ||
                                  opts.is_field_deleted === true || 
                                  opts.is_field_deleted === 'true' ||
                                  opts.is_deleted === true || 
                                  opts.is_deleted === 'true' ||
                                  opts.is_deleted_field === true || 
                                  opts.is_deleted_field === 'true';

            const cleanKey = f.key.trim();
            if (isFieldDeleted) {
              deletedKeysSet.add(cleanKey);
            } else {
              activeKeysSet.add(cleanKey);
            }
          }
        }
      }
    }

    const mergedCustomValues = {};
    if (custom_values && typeof custom_values === 'object') {
      const inputKeys = Object.keys(custom_values);
      for (let i = 0; i < inputKeys.length; i++) {
        const key = inputKeys[i];
        const trimmedKey = key.trim();
        const currentInput = custom_values[key];

        if (deletedKeysSet.has(trimmedKey)) {
          await t.rollback();
          return next(new AppError(`The field element '${key}' is no longer active or available for data entry submissions.`, 400));
        }

        if (!activeKeysSet.has(trimmedKey)) {
          await t.rollback();
          return next(new AppError(`The input parameter '${key}' is not configured or available for this workspace context.`, 400));
        }

        if (currentInput !== null && currentInput !== undefined && !(typeof currentInput === 'string' && currentInput.trim() === "")) {
          mergedCustomValues[trimmedKey] = typeof currentInput === 'string' ? currentInput.trim() : currentInput;
        }
      }
    }

    let finalEmployeeCode;
    if (req.body.employee_code && String(req.body.employee_code).trim() !== "") {
      finalEmployeeCode = String(req.body.employee_code).trim();
    } else {
      finalEmployeeCode = crypto.randomUUID();
    }

    const submissionPayload = {
      employee_code: finalEmployeeCode, 
      client_code: String(client_code).trim(),
      custom_values: mergedCustomValues
    };

    const submissionRow = await FormDataSubmission.create(submissionPayload, { transaction: t });

    await t.commit();
    
    return res.status(201).json({
      success: true,
      message: "Combined dynamic form details captured successfully with active validation checks.",
      data: {
        submission_id: submissionRow.submission_id,
        employee_code: submissionRow.employee_code,
        client_code: submissionRow.client_code,
        values: submissionRow.custom_values
      }
    });
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error("FORM SUBMISSION ERROR DIAGNOSTIC:", error);
    return next(error);
  }
};

