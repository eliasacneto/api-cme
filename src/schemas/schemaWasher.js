const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const WasherBrand = require('./schemaWasherBrand');

const Washer = sequelize.define('lavadora', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    marcaLavadora: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: WasherBrand,
            key: 'id'
        }
    },
    modeloLavadora: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    volumeTotalCamaraLt: {//270
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaBandejasInstrumentos: {//10
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaTraqueias: {//18
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloInstrumentosCargaMaxMin: {//60
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloAssisVentCargaMaxMin: { //60
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numBandejasPorUe: {//2
        type: DataTypes.INTEGER,
        allowNull: false
    },
    intervaloMedEntreCiclos: { //10
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qtdTraqueiasCirurgia: {//3
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qtdTraqueiasLeitoUtiDia: { //3
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidadeTermosProjeto: { //2
        type: DataTypes.INTEGER, 
        allowNull: false
    },
    preco: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
}, {
    tableName: 'lavadora',
    timestamps: true,
});

module.exports = Washer;