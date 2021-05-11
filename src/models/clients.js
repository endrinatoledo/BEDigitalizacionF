/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const clients = sequelize.define('clients', {
    cliId: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'cli_id'
    },
    cliName: {
      type: DataTypes.STRING(45),
      allowNull: false,
      field: 'cli_name'
    }
  }, {
    tableName: 'clients',
    timestamps: false // no imprime valores por defecto
  });

  clients.associate = function (models) {
    models.clients.hasMany(models.users, {
      as: 'users',
      foreignKey: 'cliId'
    });

    models.clients.hasMany(models.invoices, {
      as: 'invoices',
      foreignKey: 'cliId'
    });


  };
  return clients;
};
