const { sequelize } = require('../config/db');
const Client = require('./client');
const Module = require('./module'); 
const FormConfig = require('./formconfig'); 
const Form = require('./form');
const DeleteHistory = require('./deletehistory');

Client.hasMany(Module, { as: 'registeredModules', foreignKey: 'client_code', sourceKey: 'client_code',onDelete: 'CASCADE' });

Module.belongsTo(Client, { as: 'clientWorkspace', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(FormConfig, { as: 'formLayouts', foreignKey: 'client_code', sourceKey: 'client_code',onDelete: 'CASCADE'});

FormConfig.belongsTo(Client, { as: 'clientDetails', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(Form, { as: 'submissions', foreignKey: 'client_code', sourceKey: 'client_code',onDelete: 'CASCADE'});

Form.belongsTo(Client, { as: 'clientWorkspaceDirect', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(DeleteHistory, {as: 'auditLogs',foreignKey: 'client_code',sourceKey: 'client_code',onDelete: 'CASCADE' });

DeleteHistory.belongsTo(Client, {as: 'clientAuditWorkspace',foreignKey: 'client_code',targetKey: 'client_code'});

Module.hasMany(FormConfig, { as: 'moduleConfigurations', foreignKey: 'module_code', sourceKey: 'module_code',onDelete: 'CASCADE' });

FormConfig.belongsTo(Module, { as: 'moduleContext', foreignKey: 'module_code', targetKey: 'module_code' });

Module.hasMany(Form, { as: 'moduleSubmissions', foreignKey: 'module_code', sourceKey: 'module_code',onDelete: 'CASCADE' });

Form.belongsTo(Module, { as: 'parentModule', foreignKey: 'module_code', targetKey: 'module_code' });

Module.hasMany(DeleteHistory, { as: 'moduleAuditTrails', foreignKey: 'module_code', sourceKey: 'module_code',onDelete: 'CASCADE' });

DeleteHistory.belongsTo(Module, { as: 'auditedModule', foreignKey: 'module_code', targetKey: 'module_code' });

module.exports = {
  sequelize,
  Client,
  Module, 
  FormConfig,
  Form,
  DeleteHistory
};
