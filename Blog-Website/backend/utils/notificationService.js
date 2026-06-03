const Notification = require('../models/notification');
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

class NotificationService {
  static async trigger({ io, userId, mainType, subType, metadata = {}, userEmail = null }) {
    try {
      let content = '';

      if (mainType === 'messages') {
        switch (subType) {
          case 'logged in':
            content = `${metadata.username || 'user'} logged in on Blog Website`;
            break;
          case 'following friend':
            if (metadata.type === 'self') {
              content = `you are now following ${metadata.username || 'user'}`;
            } else {
              content = `${metadata.username || 'user'} is now following you.`;
            }
            break;
          case 'blog comment':
            content = `${metadata.username || 'user'} commented on your blog`;
            break;
          case 'comment reply':
            content = `${metadata.username || 'user'} replied to your comment`;
            break;
          case 'blog reaction':
            content = `${metadata.username || 'user'} reacted ${metadata.reactionType || 'interaction'} to your blog`;
            break;
          case 'comment reaction':
            content = `${metadata.username || 'user'} reacted ${metadata.reactionType || 'interaction'} to your comment`;
            break;
          default:
            content = `You have a new message alert.`;
        }
      }

      else if (mainType === 'updates') {
        switch (subType) {
          case 'signup':
            content = `you signed up on blog website`;
            break;
          case 'blog update from featured':
            content = `${metadata.username || 'user'} has posted/published a new blog on ${metadata.categoryName || 'category'}`;
            break;
          case 'blog update from my feed':
            content = `new blogs have been published on ${metadata.categoryNames || 'categories'}`;
            break;
          case 'recheck':
            content = `Your blog has been sent back for some changes with feedback: ${metadata.feedbackContent || ''}`;
            break;
          case 'approved':
            content = `your blog has been approved and is ready to be published.`;
            break;
          case 'published':
            content = `Your blog has been posted/published successfully.`;
            break;
          case 'approved blog got published':
            content = `blog approved by you has been published.`;
            break;
          case 'pending(admin)':
            content = `you have ${metadata.count || 0} pending blog requests waiting for approval.`;
            break;
          case 'password updated':
            content = `Your password has been updated.`;
            break;
          default:
            content = `You have a new system update alert.`;
        }
      }

      if (!content) return null;

      const savedNotification = await Notification.create({
        user_id: userId,
        notif_type: mainType,
        notif_content: content
      });

      if (io) {
        io.to(`room_${userId}`).emit('notification_received', savedNotification);
      }

      const emailTriggers = ['signup', 'blog update from featured', 'blog update from my feed', 'password updated'];
      if (emailTriggers.includes(subType) && userEmail) {
        this.#sendEmail(userEmail, subType, metadata, content).catch((err) => {
          console.error('Background Email Dispatch Failure:', err);
        });
      }

      return savedNotification;
    } catch (error) {
      console.error('Notification Service Core Error:', error.stack);
      throw error; 
    }
  }

  static async #sendEmail(toEmail, subType, metadata, fallbackContent) {
    let subject = 'New Update';

    if (subType === 'signup') {
      subject = 'Welcome to Our Blog Platform!';
    } else if (subType === 'blog update from featured') {
      subject = 'New Post From Your Followings!';
    } else if (subType === 'blog update from my feed') {
      subject = 'New Content Updates inside your feed';
    } else if (subType === 'password updated') {
      subject = 'Security Alert: Password Updated Successfully';
    }

    try {
      const templatePath = path.join(__dirname, '../templates/notificationEmail.ejs');

      const htmlTemplate = await ejs.renderFile(templatePath, {
        subject,
        subType,
        metadata,
        fallbackContent
      });

      await transporter.sendMail({
        from: `"Blog Platform" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject,
        html: htmlTemplate,
      });
      
      console.log(`Notification email sent successfully to: ${toEmail}`);
    } catch (error) {
      console.error('Nodemailer or EJS Processing Exception error:', error.message);
      throw error;
    }
  }
}

module.exports = NotificationService;


//Remember to create a event for fast updation of count for reactions and  comments just like whatsapp and instagram.
