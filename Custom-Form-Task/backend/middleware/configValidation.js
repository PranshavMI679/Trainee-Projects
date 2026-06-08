const { FormConfig } = require('../models');
const AppError = require('../utils/appError');

const configValidation = async (req, res, next) => {
  try {
    const { config_code } = req.params; 
    const { custom_values } = req.body;

    if (!config_code) {
      return next(new AppError("Configuration template code is required in the URL parameters.", 400));
    }

    const rules = await FormConfig.findAll({ where: { config_code } });

    if (!rules || rules.length === 0) {
      return next(new AppError("The provided form configuration layout code does not exist.", 404));
    }

    const payload = custom_values || {};

    for (const rule of rules) {
      const userValue = payload[rule.key];

      if (rule.is_required) {
        if (userValue === undefined || userValue === null || String(userValue).trim() === '') {
          return next(new AppError(`The custom field '${rule.label}' is required.`, 400));
        }
      }

      if (userValue !== undefined && userValue !== null && rule.length && rule.type === 'textbox') {
        if (String(userValue).length > rule.length) {
          return next(new AppError(`Custom field '${rule.label}' exceeds maximum permitted length of ${rule.length} characters.`, 400));
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = configValidation;
