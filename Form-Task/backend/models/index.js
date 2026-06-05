const { sequelize } = require('../config/db');

const Client = require('./client');
const Form = require('./form');

Client.hasMany(Form, { foreignKey: 'client_code', sourceKey: 'client_code', as: 'submissions', 
    onDelete: 'CASCADE', onUpdate: 'CASCADE'
});
Form.belongsTo(Client, { foreignKey: 'client_code', targetKey: 'client_code', as: 'clientProfile' });

module.exports = { sequelize, Client, Form };