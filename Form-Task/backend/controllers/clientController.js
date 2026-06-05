const { Client } = require('../models'); 
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

exports.clientFormSpecs = async (req, res, next) => {
  try {
    const { client_name, show_EmployeeID, show_Middlename } = req.body;

    if (!client_name || client_name.trim() === '') {
      return next(new AppError(ErrorMessages.CLIENT.NAME_REQUIRED, 400));
    }

    const newClient = await Client.create({
      client_name: client_name.trim(),
      show_EmployeeID: show_EmployeeID,
      show_Middlename: show_Middlename
    });

    return res.status(201).json({
      success: true,
      message: "Client configuration saved successfully.",
      data: {
        client: newClient
      }
    });
  } 
  catch (error) {
    return next(error);
  }
};

exports.editFormSpecs = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const { client_name, show_EmployeeID, show_Middlename } = req.body;

    const client = await Client.findOne({ where: { client_code } });
    if (!client) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    if (client_name && client_name.trim() !== '') {
      client.client_name = client_name.trim();
    }
    if (show_EmployeeID !== undefined) {
      client.show_EmployeeID = show_EmployeeID;
    }
    if (show_Middlename !== undefined) {
      client.show_Middlename = show_Middlename;
    }

    await client.save();

    return res.status(200).json({ success: true, message: "Client configuration updated successfully.", data:{ client }});
  } 
  catch (error) {
    return next(error);
  }
};
