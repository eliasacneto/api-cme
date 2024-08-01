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
    volumeTotCamaraLt: { //102
        type: DataTypes.INTEGER,
        allowNull: false
    },
    volumeUtilCamaraLt: { //81
        type: DataTypes.FLOAT,
        allowNull: false
    },
    medTotTempoCicloATMin: { //50
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoCargaDescargaMin: { //10
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoTestDiarioBDMin: {//30
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tempoDiarioAquecimentoMaqMin: {//20
        type: DataTypes.INTEGER,
        allowNull: false
    },
    preco: {
        type: DataTypes.STRING(45), // se for faixa de preço mudar para string
        allowNull: true,
        defaultValue: 0
    },
    numAutoclaves: { 
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempoClicloCarDescMin: { //60 CALCULADO EM AUTOCLAVECALC
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numAutoclavesUmaEmManutencao: { // 2 CALCULADO EM AUTOCLAVECALC
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempoDisponivelDiarioMin: { // CALCULADO EM AUTOCLAVECALC
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosDia: { // CALCULADO EM AUTOCLAVECALC
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    aproveitamentoCamaraPorcent: { // 79 CALCULADO EM AUTOCLAVECALC
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    tableName: 'autoclave',
    timestamps: true,
});

AutoclaveBrand.hasMany(Autoclave, { foreignKey: 'marcaAutoclave' });
Autoclave.belongsTo(AutoclaveBrand, { foreignKey: 'marcaAutoclave', as: 'brand' }); //ver esse brand com Elias

module.exports = Autoclave;