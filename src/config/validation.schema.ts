import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  GRPC_PORT: Joi.number().default(5000),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('24h'),
  REDIS_URL: Joi.string().default('redis://localhost:6379'),
});
