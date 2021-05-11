/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const invoices = sequelize.define('invoices', {
    invId: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'inv_id'
    },
    invNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'inv_number'
    },
    invControlNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'inv_control_number'
    },
    invZone: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'inv_zone'
    },
    invSeller: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'inv_seller'
    },
    invTrip: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'inv_trip'
    },
    invOrder: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'inv_order'
    },
    invReleaseDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: new Date(),
      field: 'inv_ReleaseDate'
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
    prtId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      field: 'prt_id',
      references: {
        model: {
          tableName: 'partners',
        },
        key: 'prt_id'
      }
    },
    bthId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'bth_id',
      references: {
        model: {
          tableName: 'batch',
        },
        key: 'bth_id'
      }
    },
    fileRoute: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'file_route'
    },
    invSended: {
      type: DataTypes.STRING(11),
      allowNull: true,
      field: 'inv_sended'
    },
    readError: {
      type: DataTypes.STRING(11),
      allowNull: true,
      field: 'inv_read_error'
    }
  }, {
    tableName: 'invoices',
    timestamps: false // no imprime valores por defecto
  });

  invoices.associate = function(models) {
    models.invoices.belongsTo(models.clients,{
      as: 'clients',
      foreignKey: 'cliId'
    });
    models.invoices.belongsTo(models.partners,{
      as: 'partners',
      foreignKey: 'prtId'
    });
    models.invoices.belongsTo(models.batchs,{
      as: 'batchs',
      foreignKey: 'bthId'
    });
  };


  return invoices;
};
