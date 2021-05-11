/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const emailReaded = sequelize.define('email_readed', {
      erId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'er_id'
      },
      erTotalFiles: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'er_total_files'
      },
      erCorrectly: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'er_correctly'
      },
      erFailed: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        field: 'er_failed'
      },
      erDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
        field: 'er_date'
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
      tableName: 'email_readed',
      timestamps: false // no imprime valores por defecto
    });
  
    emailReaded.associate = function (models) {
      emailReaded.hasMany(models.invoices, {
        as: 'invoices',
        foreignKey: 'bthId'
      });
      emailReaded.belongsTo(models.clients,{
        as: 'clients',
        foreignKey: 'cliId'
      });
    };
    return emailReaded;
  };
  