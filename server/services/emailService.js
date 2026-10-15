import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  const isRealSmtp = process.env.EMAIL_USER && !process.env.EMAIL_USER.includes('example.com');

  if (isRealSmtp) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  } else {
    // Development fallback using Ethereal test email account
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[Nodemailer] Dev test email initialized: ${testAccount.user}`);
    } catch {
      // Basic mock transporter
      transporter = {
        sendMail: async (mailOptions) => {
          console.log(`[Email Mock Sent] To: ${mailOptions.to} | Subject: ${mailOptions.subject}`);
          return { messageId: `mock-${Date.now()}` };
        }
      };
    }
  }

  return transporter;
};

export const emailService = {
  // 1. Send Order Confirmation Email
  async sendOrderConfirmation(order) {
    try {
      const client = await getTransporter();
      const itemsList = order.items.map(item => `• ${item.name} x ${item.qty} - Rs. ${item.price.toLocaleString()}`).join('\n');
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"FitFuel Fitness" <orders@fitfuel.lk>',
        to: order.email,
        subject: `FitFuel Order Confirmation #${order.id}`,
        text: `Hi ${order.customer},\n\nThank you for shopping at FitFuel! Your order #${order.id} has been placed successfully.\n\nItems:\n${itemsList}\n\nTotal: Rs. ${order.total.toLocaleString()}\nDelivery Address: ${order.address?.line1}, ${order.address?.city}\n\nTrack your order in real-time on our website.\n\nStay Strong,\nFitFuel Team`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #29ABE2;">FitFuel Order Confirmation</h2>
            <p>Hi <strong>${order.customer}</strong>,</p>
            <p>Thank you for shopping with FitFuel! Your order <strong>#${order.id}</strong> has been received and is being processed.</p>
            <div style="background: #f7f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <h4 style="margin-top: 0;">Order Summary:</h4>
              <ul style="padding-left: 20px;">
                ${order.items.map(item => `<li>${item.name} &times; <strong>${item.qty}</strong> — Rs. ${item.price.toLocaleString()}</li>`).join('')}
              </ul>
              <p style="margin-bottom: 0;"><strong>Total Paid: Rs. ${order.total.toLocaleString()}</strong></p>
            </div>
            <p><strong>Shipping Address:</strong><br/>${order.address?.line1 || ''}, ${order.address?.city || ''}</p>
            <p style="color: #888; font-size: 13px;">You can track this order in your account dashboard under 'My Orders'.</p>
          </div>
        `
      };

      const info = await client.sendMail(mailOptions);
      if (nodemailer.getTestMessageUrl && info) {
        console.log(`[Order Email Preview URL]: ${nodemailer.getTestMessageUrl(info)}`);
      }
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Service Error]', err.message);
      return { success: false, error: err.message };
    }
  },

  // 2. Send Password Reset Email
  async sendPasswordResetEmail(email, resetToken, resetUrl) {
    try {
      const client = await getTransporter();
      const mailOptions = {
        from: process.env.EMAIL_FROM || '"FitFuel Fitness" <security@fitfuel.lk>',
        to: email,
        subject: 'FitFuel - Password Reset Request',
        text: `You have requested a password reset. Please use the following link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 500px; padding: 20px;">
            <h3 style="color: #29ABE2;">FitFuel Password Reset</h3>
            <p>You recently requested to reset your password for your FitFuel account.</p>
            <p><a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #29ABE2; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset My Password</a></p>
            <p style="color: #666; font-size: 12px;">This link will expire in 30 minutes.</p>
          </div>
        `
      };

      const info = await client.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (err) {
      console.error('[Email Service Error]', err.message);
      return { success: false, error: err.message };
    }
  }
};

export default emailService;
