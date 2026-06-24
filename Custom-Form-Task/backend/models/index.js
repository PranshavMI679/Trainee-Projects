const { sequelize } = require('../config/db');

const Client = require('./client');
const Employee = require('./employee');
const Module = require('./module'); 
const FormConfig = require('./form_config'); 
const Section = require('./section');
const SectionArea = require('./section_area');
const Field = require('./field');
const FormDataSubmission = require('./form_data');
const DeleteHistory = require('./delete_history');

Client.hasMany(Module, { as: 'registeredModules', foreignKey: 'client_code', sourceKey: 'client_code', onDelete: 'CASCADE' });
Module.belongsTo(Client, { as: 'clientWorkspace', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(Employee, { as: 'employees', foreignKey: 'client_code', sourceKey: 'client_code', onDelete: 'CASCADE' });
Employee.belongsTo(Client, { as: 'clientWorkspaceDirect', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(FormConfig, { as: 'formLayouts', foreignKey: 'client_code', sourceKey: 'client_code', onDelete: 'CASCADE' });
FormConfig.belongsTo(Client, { as: 'clientDetails', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(FormDataSubmission, { as: 'submissions', foreignKey: 'client_code', sourceKey: 'client_code', onDelete: 'RESTRICT' });
FormDataSubmission.belongsTo(Client, { as: 'submittingClient', foreignKey: 'client_code', targetKey: 'client_code' });

Client.hasMany(DeleteHistory, { as: 'auditLogs', foreignKey: 'client_code', sourceKey: 'client_code', onDelete: 'CASCADE' });
DeleteHistory.belongsTo(Client, { as: 'clientAuditWorkspace', foreignKey: 'client_code', targetKey: 'client_code' });

Module.hasMany(FormConfig, { as: 'moduleConfigurations', foreignKey: 'module_code', sourceKey: 'module_code', onDelete: 'CASCADE' });
FormConfig.belongsTo(Module, { as: 'moduleContext', foreignKey: 'module_code', targetKey: 'module_code' });

Module.hasMany(DeleteHistory, { as: 'moduleAuditTrails', foreignKey: 'module_code', sourceKey: 'module_code', onDelete: 'SET NULL' });
DeleteHistory.belongsTo(Module, { as: 'auditedModule', foreignKey: 'module_code', targetKey: 'module_code' });

FormConfig.hasMany(Section, { as: 'sections', foreignKey: 'config_code', sourceKey: 'config_code', onDelete: 'CASCADE' });
Section.belongsTo(FormConfig, { as: 'parentConfig', foreignKey: 'config_code', targetKey: 'config_code' });

FormConfig.hasMany(DeleteHistory, { as: 'configAuditTrails', foreignKey: 'config_code', sourceKey: 'config_code', onDelete: 'SET NULL' });
DeleteHistory.belongsTo(FormConfig, { as: 'auditedConfig', foreignKey: 'config_code', targetKey: 'config_code' });

Section.hasMany(SectionArea, { as: 'areas', foreignKey: 'section_code', sourceKey: 'section_code', onDelete: 'CASCADE' });
SectionArea.belongsTo(Section, { as: 'parentSection', foreignKey: 'section_code', targetKey: 'section_code' });

SectionArea.hasMany(Field, { as: 'fields', foreignKey: 'area_code', sourceKey: 'area_code', onDelete: 'CASCADE' });
Field.belongsTo(SectionArea, { as: 'parentArea', foreignKey: 'area_code', targetKey: 'area_code' });

Employee.hasMany(FormDataSubmission, { as: 'employeeSubmissions', foreignKey: 'employee_code', sourceKey: 'employee_code', onDelete: 'RESTRICT' });
FormDataSubmission.belongsTo(Employee, { as: 'submittingEmployee', foreignKey: 'employee_code', targetKey: 'employee_code' });

module.exports = {
  sequelize,
  Client,
  Employee,
  Module, 
  FormConfig,
  Section,
  SectionArea,
  Field,
  FormDataSubmission,
  DeleteHistory
};
