'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Sessions', {
      sid: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      userId: Sequelize.STRING,
      expires: Sequelize.DATE,
      data: Sequelize.STRING(20000)
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Sessions');
  }
};
