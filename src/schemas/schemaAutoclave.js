const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const AutoclaveBrand = require('./schemaAutoclaveBrand');

const Autoclave = sequelize.define('autoclave', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    marcaAutoclave: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: AutoclaveBrand,
            key: 'id'
        }
    },
    modeloAutoclave: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    volumeTotCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    volumeUtilCamaraLt: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    medTotTempoCicloATMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoCargaDescargaMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoClicloCarDescMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempoTestDiarioBDMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDiarioAquecimentoMaqMin: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDisponivelDiarioMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosDia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    aproveitamentoCamaraPorcent: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numAutoclaves: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numAutoclavesUmaEmManutencao: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    preco: {
        type: DataTypes.FLOAT, // se for faixa de preço mudar para string
        allowNull: true,
        defaultValue: 0.0
    },

}, {
    tableName: 'autoclave',
    timestamps: true,
});

AutoclaveBrand.hasMany(Autoclave, { foreignKey: 'marcaAutoclave' }); // Definindo 'as' para o alias

Autoclave.belongsTo(AutoclaveBrand, { foreignKey: 'marcaAutoclave', as: 'brand' });

Autoclave.sync();

module.exports = Autoclave;