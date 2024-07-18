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
    volumeTotalCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaBandejasInstrumentos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeCargaTraqueias: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloInstrumentosCargaMaxMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempMedCicloAssisVentCargaMaxMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numBandejasPorUe: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    capacidadeProcessamUeCargaInstrumentos: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    intervaloMedEntreCiclos: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qtdTraqueiasCirurgia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    qtdTraqueiasLeitoUtiDia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantidadeTermosProjeto: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    preco: {
        type: DataTypes.FLOAT, // se for faixa de preço mudar para string
        allowNull: true,
        defaultValue: 0.0
    },
}, {
    tableName: 'lavadora',
    timestamps: true,
});

WasherBrand.hasMany(Washer, { foreignKey: 'marcaLavadora' }); // Definindo 'as' para o alias

Washer.belongsTo(WasherBrand, { foreignKey: 'marcaLavadora', as: 'brand' });

Washer.sync();

module.exports = Washer;