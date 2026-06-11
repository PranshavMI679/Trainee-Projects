const { Client } = require('../models');
const AppError = require('../utils/appError');
const { v4: uuidv4 } = require('uuid');

exports.createClient = async (req, res, next) => {
  try {
    const { client_name } = req.body;

    const existing = await Client.findOne({ where: { client_name } });
    if (existing) {
      return next(new AppError("A client with this name already exists.", 400));
    }

    const record = await Client.create({ 
      client_name,
      client_code: uuidv4()
    });

    return res.status(201).json({
      success: true,
      client_id: record.client_id,
      client_code: record.client_code,
      client_name: record.client_name
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const records = await Client.findAll({ order: [['client_id', 'ASC']] });
    return res.status(200).json(records);
  } catch (error) {
    return next(error);
  }
};
