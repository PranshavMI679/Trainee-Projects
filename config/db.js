const { Sequelize } = require('sequelize');
require('dotenv').config();

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connection established.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { 
  development: config, 
  sequelize, 
  connectDB 
};
