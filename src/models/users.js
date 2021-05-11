/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  const users = sequelize.define('users', {
    usrId: {
      autoIncrement: true,
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      field: 'usr_id'
    },
    usrName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'usr_name'
    },
    usrLastName: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'usr_last_name'
    },
    usrEmail: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'usr_email'
    },
    usrRol: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'usr_rol'
    },
    usrStatus: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'usr_status'
    },
    usrSellerCode: {
      type: DataTypes.STRING(45),
      allowNull: true,
      field: 'usr_seller_code'
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
    }
  }, {
    tableName: 'users',
    timestamps: false // no imprime valores por defecto
  });

  users.associate = function(models) {
    models.users.belongsTo(models.clients,{
      as: 'clients',
      foreignKey: 'cliId'
    });

  };


  return users;
};
