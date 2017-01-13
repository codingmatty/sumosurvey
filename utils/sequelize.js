var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var db_config = require('../config/config.json')[env];
var sequelize = new Sequelize(
  db_config.database,
  db_config.username,
  db_config.password,
  db_config
);

module.exports = sequelize;
