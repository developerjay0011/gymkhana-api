const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  dialect: 'mssql',
  host: process.env.DB_HOST,
  // port: process.env.DB_PORT,
  dialectOptions: {
    options: {
      encrypt: true,
      trustServerCertificate: true,
      instanceName: process.env.DB_INSTANCE,
      requestTimeout: 300000
    },
    authentication: {
      type: 'default',
      options: {
        userName: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
    },
    connectionTimeout: 60000,
    requestTimeout: 60000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  },
  logging: console.log // For debugging
});

module.exports = { sequelize };
