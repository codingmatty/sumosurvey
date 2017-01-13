'use strict';
var fs = require('fs');
var path = require('path');
var basename = path.basename(module.filename);
var sequelize = require('../utils/sequelize');


var models = {};

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf('.') !== 0) && (file !== basename);
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    models[model.name] = model;
  });

Object.keys(models).forEach(function (modelName) {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;

module.exports = models;
