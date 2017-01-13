'use strict';
module.exports = function (sequelize, DataTypes) {
  var Sessions = sequelize.define('Sessions', {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    userId: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.STRING(20000)
  });
  return Sessions;
};
