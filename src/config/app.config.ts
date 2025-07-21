import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT || '3000', 10) || 3000,
  grpcPort: parseInt(process.env.GRPC_PORT || '5000', 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'default-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  databaseUrl: process.env.DATABASE_URL,
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
}));
