const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const Recommendation = sequelize.define('recomendacoes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    autoclaveRecommendation: { // entrar um array
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    washerRecommendation: { // entrar um array
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    lead_recommendation: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lead,
            key: 'id'
        }
    },
}, {
    tableName: 'recomendacoes',
    timestamps: true
});

module.exports = Recommendation;