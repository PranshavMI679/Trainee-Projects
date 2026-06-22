const { Sequelize } = require('sequelize');
const { Client, Module } = require('../models');
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

exports.createModule = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const { module_name } = req.body;

    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError("The target client configuration tenant profile was not found.", 404));
    }

    const trimmedModuleName = String(module_name).trim();

    const existingModule = await Module.findOne({
      where: {
        client_code,
        module_name: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('module_name')),
          Sequelize.fn('LOWER', trimmedModuleName)
        )
      }
    });

    if (existingModule) {
      return next(new AppError(`A module named '${trimmedModuleName}' is already active inside this client workspace.`, 400));
    }

    const dynamicModule = await Module.create({
      module_code: uuidv4(),
      client_code,
      module_name: trimmedModuleName
    });

    return res.status(201).json({
      success: true,
      message: "Dynamic workspace entity module registered successfully.",
      data: {
        module_id: dynamicModule.module_id,
        module_code: dynamicModule.module_code,
        client_code: dynamicModule.client_code,
        module_name: dynamicModule.module_name
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllModulesByClient = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const targetClient = await Client.findOne({ where: { client_code } });
    if (!targetClient) {
      return next(new AppError("The target client configuration tenant profile was not found.", 404));
    }

    const clientModules = await Module.findAll({
      where: { client_code },
      order: [['module_id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      client_name: targetClient.client_name,
      client_code: targetClient.client_code,
      modules_count: clientModules.length,
      modules: clientModules
    });
  } catch (error) {
    return next(error);
  }
};
