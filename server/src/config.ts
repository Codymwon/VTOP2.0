import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '8080', 10),
  jwtSecret: process.env.JWT_SECRET || 'vtop-jwt-secret-key-2026',
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
  otpCooldownSeconds: 180,
  otpExpiryMinutes: 10,
};
