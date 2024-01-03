export default () => ({
  application_port: parseInt(process.env.APPLICATION_PORT, 10) || 3001,
  jwt_secret: process.env.JWT_SECRET,

  mongo_database: {
    uri:
      'mongodb://' +
      process.env.MONGO_HOST +
      ':' +
      process.env.MONGO_PORT +
      '/' +
      process.env.MONGO_DB,
  },
});
