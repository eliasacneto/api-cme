const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const LeadCalcWasher = sequelize.define('calculo_lavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    capacidadeProcessamUeCargaInstrumentos: { //5.0
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numCiclosInstrumentosDia: { // 26
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaInstrumentosMin: { //1826.3
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    qtdTraqueiasDia: {//216
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTraqueiasUtiDia: {//90
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTotTraqueiasDia: {//306
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdCiclosAssistVentDia: {//17
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    demandaCiclosDia: {//43
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaAssistVentMin: {//1190,0
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    demandaTempoDiaMin: {//3016.3
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    minutosDisponiveisTodosEquipamDia: {//2880.0
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    percentualUtilizacaoCapacidadeMax: {//104.73
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    lead_washer: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lead,
            key: 'id'
        }
    },
}, {
    tableName: 'calculo_lavadora',
    timestamps: true
});

module.exports = LeadCalcWasher;