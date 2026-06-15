const { sequelize } = require('../config/db');
const Client = require('./client');
const FormConfig = require('./formconfig'); 
const Form = require('./form');

Client.hasMany(FormConfig, { as: 'formLayouts', foreignKey: 'client_id', sourceKey: 'client_id'});

FormConfig.belongsTo(Client, { as: 'clientDetails', foreignKey: 'client_id', targetKey: 'client_id' });

Client.hasMany(Form, { as: 'submissions', foreignKey: 'client_id', sourceKey: 'client_id'});

Form.belongsTo(Client, { as: 'clientWorkspace', foreignKey: 'client_id', targetKey: 'client_id' });

module.exports = {
  sequelize,
  Client,
  FormConfig,
  Form
};
