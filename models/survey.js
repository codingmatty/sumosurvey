'use strict';
module.exports = function (sequelize, DataTypes) {
  var Survey = sequelize.define('Survey', {
    question_text: DataTypes.STRING(1000)
  }, {
      classMethods: {
        associate: function (models) {
          Survey.belongsTo(models.Admin);
          Survey.hasMany(models.Option);
        }
      }
    });
  return Survey;
};
