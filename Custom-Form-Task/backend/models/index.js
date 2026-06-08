const { sequelize } = require('../config/db');
const Form = require('./form');
const FormConfig = require('./formconfig');

FormConfig.hasMany(Form, { as: 'submissions', foreignKey: 'config_code', sourceKey: 'config_code', onDelete: 'CASCADE' });
Form.belongsTo(FormConfig, { as: 'layout', foreignKey: 'config_code', targetKey: 'config_code' });

module.exports = {
  sequelize,
  Form,
  FormConfig
};
