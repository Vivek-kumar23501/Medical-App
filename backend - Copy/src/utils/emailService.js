const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  // ---------------------- EMAIL OTP (ALREADY EXISTING) ----------------------
  async sendOTPEmail(email, otpCode, userName) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Medical App <noreply@medicalapp.com>',
      to: email,
      subject: 'Email Verification OTP - Medical App',
      html: this.generateOTPEmailTemplate(otpCode, userName)
    };

    try {
      if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
        console.log('📧 OTP EMAIL (DEV MODE)');
        console.log(`To: ${email}`);
        console.log(`OTP: ${otpCode}`);
        return { success: true, message: 'OTP logged to console' };
      }

      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'OTP sent successfully' };

    } catch (error) {
      console.error('Email sending error:', error);
      console.log(`📧 OTP for ${email}: ${otpCode}`);
      return { success: false, message: 'Failed to send OTP email, OTP logged to console' };
    }
  }

  generateOTPEmailTemplate(otpCode, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            text-align: center; 
            color: #007bff;
            margin: 20px 0;
            letter-spacing: 5px;
          }
          .warning { 
            background: #fff3cd; 
            border: 1px solid #ffeaa7; 
            padding: 15px; 
            border-radius: 5px;
            margin: 20px 0;
          }
          .footer { 
            background: #333; 
            color: white; 
            padding: 20px; 
            text-align: center;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Medical Authentication App</h1>
          </div>
          <div class="content">
            <h2>Email Verification</h2>
            <p>Hello ${userName},</p>
            <p>Please use the following OTP:</p>
            <div class="otp-code">${otpCode}</div>
            <div class="warning">
              <strong>Important:</strong>
              <ul>
                <li>OTP valid for 10 minutes</li>
                <li>Do not share with anyone</li>
              </ul>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 Medical App</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ---------------------- ⭐ FORGOT PASSWORD OTP (NEW) ----------------------

  async sendPasswordResetOTP(email, otp, userName) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Medical App <noreply@medicalapp.com>',
      to: email,
      subject: 'Password Reset OTP - Medical App',
      html: this.generatePasswordResetTemplate(otp, userName)
    };

    try {
      // Development mode - log OTP
      if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
        console.log('📧 PASSWORD RESET OTP (DEV MODE)');
        console.log(`To: ${email}`);
        console.log(`OTP: ${otp}`);
        return { success: true, message: 'Reset OTP logged to console' };
      }

      // Production email sending
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Password reset OTP sent' };

    } catch (error) {
      console.error('Reset email error:', error);
      console.log(`📧 RESET OTP for ${email}: ${otp}`);
      return { success: false, message: 'Failed to send password reset email, OTP logged to console' };
    }
  }

  generatePasswordResetTemplate(otp, userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .otp-code { 
            font-size: 32px; font-weight: bold; text-align: center;
            color: #dc3545; margin: 20px 0; letter-spacing: 5px;
          }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>You requested to reset your password. Use the OTP below:</p>

            <div class="otp-code">${otp}</div>

            <p>This OTP is valid for 10 minutes.</p>
            <p>If you did not request a password reset, ignore this message.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Medical App</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // ---------------------- EXISTING WELCOME EMAIL ----------------------

  async sendWelcomeEmail(email, userName) {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'Medical App <noreply@medicalapp.com>',
      to: email,
      subject: 'Welcome to Medical App - Email Verified',
      html: this.generateWelcomeEmailTemplate(userName)
    };

    try {
      if (process.env.NODE_ENV === 'development' || !process.env.SMTP_USER) {
        console.log('📧 WELCOME EMAIL (DEV MODE)');
        console.log(`To: ${email}`);
        console.log(`User: ${userName}`);
        return { success: true };
      }

      await this.transporter.sendMail(mailOptions);
      return { success: true };

    } catch (error) {
      console.error('Welcome email error:', error);
      return { success: false };
    }
  }

  generateWelcomeEmailTemplate(userName) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; }
          .content { background: #f9f9f9; padding: 30px; }
          .footer { background: #333; color: white; padding: 20px; text-align: center; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Medical App!</h1>
          </div>
          <div class="content">
            <h2>Email Verified Successfully</h2>
            <p>Hello <strong>${userName}</strong>,</p>
            <p>Your email is now verified. You can now use all features.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 Medical App</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
