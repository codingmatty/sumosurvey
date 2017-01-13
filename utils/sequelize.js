var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var db_config = require('../config/config.json')[env];
var sequelize = process.env.DB_CONFIG_URL ? new Sequelize(process.env.DB_CONFIG_URL) : new Sequelize(
  db_config.database,
  db_config.username,
  db_config.password,
  db_config
);

module.exports = sequelize;
