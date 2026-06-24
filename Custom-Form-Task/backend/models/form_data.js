const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const FormDataSubmission = sequelize.define('FormDataSubmission', {
  submission_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  employee_code: { 
    type: DataTypes.UUID, 
    allowNull: false,
  },
  client_code: {
    type: DataTypes.UUID, 
    allowNull: false,
  },
  custom_values: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  }
}, { 
  tableName: 'form_data_submissions',
  timestamps: true, 
  createdAt: 'created_at', 
  updatedAt: 'updated_at',
  indexes: [
    {
      name: 'idx_submissions_secure_identity_lookup',
      fields: ['client_code', 'employee_code']
    },
    {
      name: 'idx_submissions_custom_values_gin',
      using: 'gin',
      fields: ['custom_values'] 
    }
  ]
});

module.exports = FormDataSubmission;
