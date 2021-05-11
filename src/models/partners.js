/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    const partners = sequelize.define('partners', {
      prtId: {
        autoIncrement: true,
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        field: 'prt_id'
      },
      prtName: {
        type: DataTypes.STRING(512),
        allowNull: false,
        field: 'prt_name'
      },
      prtEmail:{
        type: DataTypes.STRING(512),
        allowNull: false,
        field: 'prt_email'
      },
      prtKey:{
        type: DataTypes.STRING(45),
        allowNull: false,
        field: 'prt_key'
      }
    }, {
      tableName: 'partners',
      timestamps: false // no imprime valores por defecto
    });
  
    partners.associate = function (models) {
      models.partners.hasMany(models.invoices, {
        as: 'invoices',
        foreignKey: 'prtId'
      });
  
    };
  
  
    return partners;
  };
  