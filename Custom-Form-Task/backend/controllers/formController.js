const { sequelize, Client, Employee, Module, FormConfig, Section, SectionArea, Field, FormDataSubmission } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

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
        where: { is_active: true },
        required: false,
        include: [{
          model: SectionArea,
          as: 'areas',
          where: { is_active: true },
          required: false,
          include: [{
            model: Field,
            as: 'fields',
            where: { is_active: true },
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

    return res.status(200).json({
      success: true,
      data: {
        client_name: targetModule.clientWorkspace?.client_name || "Unknown Tenant",
        module_name: targetModule.module_name,
        module_code: targetModule.module_code,
        layout: moduleConfig || null
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
        where: { is_active: true },
        required: false,
        include: [{
          model: SectionArea,
          as: 'areas',
          where: { is_active: true },
          required: false,
          include: [{
            model: Field,
            as: 'fields',
            where: { is_active: true },
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

    return res.status(200).json({
      success: true,
      data: {
        client_name: targetClient.client_name,
        client_code: targetClient.client_code,
        form_templates: combinedLayouts
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getEmployeeCombinedDetails = async (req, res, next) => {
  try {
    const { employee_code } = req.params;

    const employee = await Employee.findOne({ where: { employee_code: employee_code.trim() } });
    if (!employee) {
      return next(new AppError(ErrorMessages.FORM.RECORD_NOT_FOUND, 404));
    }

    const submission = await FormDataSubmission.findOne({
      where: { employee_code: employee.employee_code, client_code: employee.client_code }
    });

    const activeConfigs = await FormConfig.findAll({
      where: { client_code: employee.client_code },
      include: [{
        model: Section,
        as: 'sections',
        where: { is_active: true },
        include: [{
          model: SectionArea,
          as: 'areas',
          where: { is_active: true },
          include: [{
            model: Field,
            as: 'fields',
            where: { is_active: true }
          }]
        }]
      }]
    });

    const activeKeysDictionary = {};
    for (const config of activeConfigs) {
      if (!config.sections) continue;
      for (const sec of config.sections) {
        if (!sec.areas) continue;
        for (const ar of sec.areas) {
          if (!ar.fields) continue;
          for (const f of ar.fields) {
            activeKeysDictionary[f.key] = { label: f.label, type: f.type };
          }
        }
      }
    }

    const userValues = submission ? { ...submission.custom_values } : {};
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
      data: {
        employee_code: employee.employee_code,
        client_code: employee.client_code,
        submission_id: submission ? submission.submission_id : null,
        updated_at: submission ? submission.updated_at : null,
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
    const { client_code, employee_code, custom_values } = req.body;

    let targetEmployee = await Employee.findOne({ 
      where: { employee_code, client_code }, 
      transaction: t 
    });

    if (!targetEmployee) {
      targetEmployee = await Employee.create({
        employee_code,
        client_code
      }, { transaction: t });
    }

    let submissionRow = await FormDataSubmission.findOne({
      where: { employee_code: targetEmployee.employee_code, client_code: targetEmployee.client_code },
      transaction: t
    });

    let mergedCustomValues = {};
    let isNewSubmission = false;

    if (!submissionRow) {
      isNewSubmission = true;
      mergedCustomValues = custom_values || {};
    } else {
      mergedCustomValues = submissionRow.custom_values ? { ...submissionRow.custom_values } : {};
      
      if (custom_values && typeof custom_values === 'object') {
        const inputKeys = Object.keys(custom_values);
        for (let i = 0; i < inputKeys.length; i++) {
          const key = inputKeys[i];
          const currentInput = custom_values[key];

          if (currentInput === null || currentInput === undefined || (typeof currentInput === 'string' && currentInput.trim() === "")) {
            delete mergedCustomValues[key];
          } else {
            mergedCustomValues[key] = typeof currentInput === 'string' ? currentInput.trim() : currentInput;
          }
        }
      }
    }

    if (isNewSubmission) {
      submissionRow = await FormDataSubmission.create({
        client_code: targetEmployee.client_code,
        employee_code: targetEmployee.employee_code,
        custom_values: mergedCustomValues
      }, { transaction: t });
    } else {
      await submissionRow.update({
        custom_values: mergedCustomValues
      }, { transaction: t });
    }

    await t.commit();
    return res.status(isNewSubmission ? 201 : 200).json({
      success: true,
      message: isNewSubmission ? "Combined multi-module data entry captured successfully." : "Specific form details patched successfully.",
      data: {
        submission_id: submissionRow.submission_id,
        employee_code: submissionRow.employee_code,
        client_code: submissionRow.client_code,
        values: submissionRow.custom_values
      }
    });
  } catch (error) {
    await t.rollback();
    return next(error);
  }
};
