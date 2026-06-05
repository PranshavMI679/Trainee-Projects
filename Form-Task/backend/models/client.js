const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Client = sequelize.define('Client', {
  client_id: {
    type: DataTypes.INTEGER, 
    autoIncrement: true,
    unique: true,
  },
  client_code: { 
    type: DataTypes.UUID, 
    defaultValue: DataTypes.UUIDV4, 
    allowNull: false,
    primaryKey: true      
  },
  client_name: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  show_EmployeeID: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false   
  },
  show_Middlename: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, { 
    tableName: 'clients',
    timestamps: true, 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
});

module.exports = Client;
