const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Employee = sequelize.define('Employee', {
  employee_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  employee_code: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true,
    comment: 'The permanent global tracking identifier for a single human user'
  },
  client_code: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Links the employee to their respective corporate client tenant workspace'
  }
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_employees_client_lookup',
      fields: ['client_code']
    },
    {
      name: 'idx_employees_secure_code_lookup',
      fields: ['employee_code']
    }
  ]
});

module.exports = Employee;
