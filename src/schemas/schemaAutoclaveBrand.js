const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const AutoclaveBrand = sequelize.define('marca_autoclave', {
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
    tableName: 'marca_autoclave',
    timestamps: true
});

module.exports = AutoclaveBrand;