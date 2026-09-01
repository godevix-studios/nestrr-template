import Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  OBSERVE_APP_KEY: Joi.string().required(),
  OBSERVE_APP_SECRET: Joi.string().required(),
  OBSERVE_SERVICE_ID: Joi.string().default('api'),

  // Database — all required, no defaults
  // DB_HOST: Joi.string().required(),
  // DB_PORT: Joi.number().default(5432),
  // DB_NAME: Joi.string().required(),
  // DB_USERNAME: Joi.string().required(),
  // DB_PASSWORD: Joi.string().required(),

  // Redis
  // REDIS_HOST: Joi.string().required(),
  // REDIS_PORT: Joi.number().default(6379),
  // REDIS_PASSWORD: Joi.string().optional().allow(''),

  // Clerk authentication
  // CLERK_SECRET_KEY: Joi.string().required(),
  // CLERK_AUTHORIZED_PARTIES: Joi.string().required(),
  // CLERK_WEBHOOK_SECRET: Joi.string().required(),

  // Global rate limiting
  // THROTTLE_TTL_MS: Joi.number().integer().positive().default(60000),
  // THROTTLE_LIMIT: Joi.number().integer().positive().default(100),
});
