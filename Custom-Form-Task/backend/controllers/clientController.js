const { Sequelize } = require('sequelize');
const { Client, Module } = require('../models');
const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');
const { v4: uuidv4 } = require('uuid');

exports.handleCreateClient = async (req, res, next) => {
  try {
    const { client_name } = req.body;
    const trimmedName = client_name.trim();

    const existing = await Client.findOne({ 
      where: { 
        client_name: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('client_name')),
          Sequelize.fn('LOWER', trimmedName)
        )
      } 
    });

    if (existing) {
      return next(new AppError("A client configuration workspace with this name already exists.", 400));
    }

    const record = await Client.create({ 
      client_name: trimmedName,
      client_code: uuidv4()
    });

    return res.status(201).json({
      success: true,
      message: "Client workspace identity profile established successfully.",
      data: {
        client_id: record.client_id,
        client_code: record.client_code,
        client_name: record.client_name
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllClients = async (req, res, next) => {
  try {
    const records = await Client.findAll({ order: [['client_id', 'ASC']] });
    
    return res.status(200).json({
      success: true,
      results_count: records.length,
      clients: records
    });
  } catch (error) {
    return next(error);
  }
};

exports.getClientByCode = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const record = await Client.findOne({ where: { client_code: client_code.trim() } });
    if (!record) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        client_id: record.client_id,
        client_code: record.client_code,
        client_name: record.client_name,
        created_at: record.created_at
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.handleCreateModule = async (req, res, next) => {
  try {
    const { client_code } = req.params;
    const { module_name } = req.body;
    const trimmedModuleName = String(module_name).trim();

    const targetClient = await Client.findOne({ where: { client_code: client_code.trim() } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const existingModule = await Module.findOne({
      where: {
        client_code: targetClient.client_code,
        module_name: Sequelize.where(
          Sequelize.fn('LOWER', Sequelize.col('module_name')),
          Sequelize.fn('LOWER', trimmedModuleName)
        )
      }
    });

    if (existingModule) {
      return next(new AppError(`A workspace feature module named '${trimmedModuleName}' is already active for this client tenant.`, 400));
    }

    const dynamicModule = await Module.create({
      module_code: uuidv4(),
      client_code: targetClient.client_code,
      module_name: trimmedModuleName
    });

    return res.status(201).json({
      success: true,
      message: "Dynamic workspace entity module registered successfully.",
      data: {
        module_id: dynamicModule.module_id,
        module_code: dynamicModule.module_code,
        client_code: dynamicModule.client_code,
        module_name: dynamicModule.module_name,
        slug: dynamicModule.slug
      }
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllModulesByClient = async (req, res, next) => {
  try {
    const { client_code } = req.params;

    const targetClient = await Client.findOne({ where: { client_code: client_code.trim() } });
    if (!targetClient) {
      return next(new AppError(ErrorMessages.CLIENT.NOT_FOUND, 404));
    }

    const clientModules = await Module.findAll({
      where: { client_code: targetClient.client_code },
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
