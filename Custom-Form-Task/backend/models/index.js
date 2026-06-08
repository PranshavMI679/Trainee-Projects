const { sequelize } = require('../config/db');
const Client = require('./client');
const FormConfig = require('./formconfig');
const Form = require('./form');


Client.hasMany(FormConfig, {as: 'formLayouts', foreignKey: 'client_id', sourceKey: 'client_id', onDelete: 'CASCADE'});

FormConfig.belongsTo(Client, {as: 'clientDetails', foreignKey: 'client_id', targetKey: 'client_id'});

FormConfig.hasMany(Form, {as: 'submissions', foreignKey: 'config_code', sourceKey: 'config_code', onDelete: 'CASCADE'});

Form.belongsTo(FormConfig, {as: 'layoutBlueprint', foreignKey: 'config_code', targetKey: 'config_code'});

module.exports = {
  sequelize,
  Client,
  FormConfig,
  Form
};
