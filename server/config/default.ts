const PORT = process.env.PORT || 1337;
const DB_URI = process.env.DB_URI || '';
const ACTIVATION_SECRET = process.env.ACTIVATION_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const SALT_WORK_FACTOR = 10;

export default {
  port: PORT,
  dbUri: DB_URI,
  activationSecret: ACTIVATION_SECRET,
  accessToken: ACCESS_TOKEN_SECRET,
  refreshToken: REFRESH_TOKEN_SECRET,
  saltWorkFactor: SALT_WORK_FACTOR,
};
