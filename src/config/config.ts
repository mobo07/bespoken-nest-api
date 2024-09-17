export default () => ({
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    accessTokenExpirationInMs: process.env.JWT_ACCESS_TOKEN_EXPIRES_MS,
    refreshTokenExpirationInMs: process.env.JWT_REFRESH_TOKEN_EXPIRES_MS,
  },
  database: {
    connectionString: process.env.DB_CONNECTION_URI,
  },
  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY,
    baseUrl: process.env.PAYSTACK_BASE_URL,
  },
  order: {
    expires: process.env.ORDER_COOKIE_EXPIRY,
    secret: process.env.ORDER_SECRET,
  },
});
