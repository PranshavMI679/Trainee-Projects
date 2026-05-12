const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const crypto = require('crypto');
const { sequelize } = require('../config/db');
const { QueryTypes } = require('sequelize');

