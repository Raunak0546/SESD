const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Otp = require('../models/Otp');

const hash = (code) => crypto.createHmac('sha256', process.env.JWT_SECRET).update(String(code)).digest('hex');

// Sends a real email through SMTP. If SMTP is not configured, the email is printed in the server terminal (dev mode).
async function sendMail(to, subject, text) {
  if (!process.env.SMTP_HOST) {
    console.log(`\n[DEV MAIL - SMTP not configured]\nTo: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }
  const port = Number(process.env.SMTP_PORT) || 587;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, port, secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, text });
}

// Create a 6-digit code, store only its hash, and email it to the user.
exports.issueOtp = async (user) => {
  const code = String(crypto.randomInt(100000, 1000000));
  await Otp.findOneAndUpdate(
    { user: user._id },
    { codeHash: hash(code), tries: 0, sentAt: new Date(), expiresAt: new Date(Date.now() + 5 * 60 * 1000) },
    { upsert: true }
  );
  await sendMail(user.email, 'Your Alumnest verification code',
    `Hi ${user.name},\n\nYour verification code is ${code}.\nIt is valid for 5 minutes. Do not share it with anyone.\n\nIf you did not try to log in, please ignore this email.`);
};

// Returns 'ok' | 'wrong' | 'expired' | 'locked'
exports.checkOtp = async (user, code) => {
  const otp = await Otp.findOne({ user: user._id });
  if (!otp || otp.expiresAt < new Date()) return 'expired';
  if (otp.tries >= 5) { await otp.deleteOne(); return 'locked'; }
  const ok = crypto.timingSafeEqual(Buffer.from(hash(code)), Buffer.from(otp.codeHash));
  if (!ok) { otp.tries += 1; await otp.save(); return 'wrong'; }
  await otp.deleteOne();
  return 'ok';
};

exports.canResend = async (user) => {
  const otp = await Otp.findOne({ user: user._id });
  return !otp || Date.now() - otp.sentAt.getTime() > 30 * 1000; // 30s cooldown
};
