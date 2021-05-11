/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const configs = sequelize.define('configs', {
      cfgId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'cfg_id'
      },
      cfgInvPrefix: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: 'cfg_invoices_prefix'
      },
      cfgCtrlPrefix: {
        type: DataTypes.STRING(5),
        allowNull: true,
        field: 'cfg_control_prefix'
      },
      cfgPrinterEmail: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'cfg_printer_email'
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
    }, {
      tableName: 'config',
      timestamps: false // no imprime valores por defecto
    });
  
    configs.associate = function (models) {
        models.configs.belongsTo(models.clients,{
            as: 'clients',
            foreignKey: 'cliId'
          });
  
    };
    return configs;
  };
  