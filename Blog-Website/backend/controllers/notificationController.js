const Notification = require('../models/notification');

const AppError = require('../utils/appError');
const ErrorMessages = require('../utils/errorMessages');

const getUserNotifications = async (req, res, next) => {
  try {
    const user_id = req.user?.id || req.user?.user_id;
    const { type } = req.query;

    if (!user_id) {
      return next(new AppError(ErrorMessages.AUTH.UNAUTHORIZED_NOTIF_CONTEXT, 401));
    }

    const queryConditions = { user_id };
    if (type && ['messages', 'updates'].includes(type)) {
      queryConditions.notif_type = type;
    }

    const notifications = await Notification.findAll({
      where: queryConditions,
      order: [['notif_time', 'DESC']]
    });

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } 
  catch (error) {
    return next(error);
  }
};

module.exports = {
  getUserNotifications
};
