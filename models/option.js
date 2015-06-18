'use strict';
module.exports = function(sequelize, DataTypes) {
  var Option = sequelize.define('Option', {
    text: DataTypes.STRING,
	  answer_count: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Option.belongsTo(models.Survey);
      }
    }
  });
  return Option;
};