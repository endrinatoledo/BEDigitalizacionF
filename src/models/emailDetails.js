/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const emailDetails = sequelize.define('email_details', {
      edId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'ef_id'
      },
      edFileName: {
        type: DataTypes.STRING(256),
        allowNull: true,
        field: 'ef_file_name'
      },
      edStatus: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'ed_status'
      },
      edDescription: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'ed_description'
      },
      edDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: new Date(),
        field: 'ed_date'
      },
      erId: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        field: 'er_id',
  
        references: {
          model: {
            tableName: 'email_readed',
          },
          key: 'er_id'
        }
      },
    }, {
      tableName: 'email_details',
      timestamps: false // no imprime valores por defecto
    });
  
    emailDetails.associate = function (models) {
      models.email_details.belongsTo(models.email_readed,{
          as: 'email_readed',
          foreignKey: 'erId'
        });

    };
    return emailDetails;
  };
  