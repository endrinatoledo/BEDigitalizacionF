/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const batchs = sequelize.define('batchs', {
      bthId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'bth_id'
      },
      bthSended:{
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'bth_sended'
      },
      cliId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'cli_id',
  
        references: {
          model: {
            tableName: 'clients',
          },
          key: 'cli_id'
        }
      },
      initInv: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'init_invoices'
      },
      lastInv: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'last_invoices'
      },
    }, {
      tableName: 'batchs'
    });
  
    batchs.associate = function (models) {
      batchs.hasMany(models.invoices, {
        as: 'invoices',
        foreignKey: 'bthId'
      });
      batchs.belongsTo(models.clients,{
        as: 'clients',
        foreignKey: 'cliId'
      });
    };
  
  
    return batchs;
  };
  