const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const LeadCalcAutoclave = sequelize.define('calculo_autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    volumeProcessadoIntervaloPicoLt90totDiario: { //12680
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    intervaloDiarioPicoMin: { //670
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosIntervaloPico: { // 23.17
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    capProcessamIntervaloPicoTodasAutoclavesOnLt: { //2714
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    horasTrabalhoAtenderVolTotalHr: { //87
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    capUtilizTodasAutoclavesIntervaloPicoPorcent: { // 467.28
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    lead_autoclave: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lead,
            key: 'id'
        }
    },
}, {
    tableName: 'calculo_autoclave',
    timestamps: true
});

module.exports = LeadCalcAutoclave;
