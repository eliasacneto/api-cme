const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const WasherBrand = sequelize.define('marca_lavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeMarca: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
    },
}, {
    tableName: 'marca_lavadora',
    timestamps: true
});

module.exports = WasherBrand;