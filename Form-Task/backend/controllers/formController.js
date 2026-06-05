const { Client, Form } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.showFormLayout = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const client = await Client.findOne({ where: { client_code } });
    if (!client) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const layoutObj = {
      first_name: true,
      last_name: true,
      gender: true,
      phone: true,
      email: true
    };

    if (client.show_Middlename === true) {
      layoutObj.middle_name = true;
    }

    if (client.show_EmployeeID === true) {
      layoutObj.employee_id = true;
    }

    const layout = Object.keys(layoutObj);

    return res.status(200).json({
      success: true,
      data: layout
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.employeeForm = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    
    const { first_name, middle_name, last_name, gender, phone, email } = req.body;

    const client = await Client.findOne({ where: { client_code } });
    if (!client) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    let finalizedMiddleName = middle_name;

    if (!client.show_Middlename) {
      finalizedMiddleName = null;
    } else {
      if (!middle_name || middle_name.trim() === '') {
        return next(new AppError(ErrorMessages.VALIDATION.MIDDLE_NAME_EMPTY, 400));
      }
    }

    const newSubmission = await Form.create({
      client_code,
      first_name,
      middle_name: finalizedMiddleName,
      last_name,
      gender,
      phone,
      email
    });

    return res.status(201).json({
      success: true,
      message: "Employee form data saved successfully.",
      data: {
        submission: newSubmission
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.showEmployeeDetails = async (req, res, next) => {
  try {
    const { employee_code } = req.params;

    const record = await Form.findOne({
      where: { employee_code },
      include: [{
        model: Client,
        as: 'clientProfile',
        attributes: ['client_name', 'show_EmployeeID', 'show_Middlename']
      }]
    });

    if (!record) {
      return next(new AppError(ErrorMessages.FORM.RECORD_NOT_FOUND, 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        record
      }
    });
  } catch (error) {
    return next(error);
  }
};
