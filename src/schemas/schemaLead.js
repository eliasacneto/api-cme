const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Lead = sequelize.define('lead', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nomeLead: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    hospitalNome: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    hospitalEmail: {
        type: DataTypes.STRING(45),
        allowNull: false,
        unique: true
    },
    hospitalContato: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cnpj: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: 0
    },
    cargo: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cep: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    numero: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    rua: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    bairro: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    cidade: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    estado: {
        type: DataTypes.STRING(10),
        allowNull: false
    },
    numeroSalasCirurgicas: { 
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroCirurgiaSalaDia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroLeitoUTI: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroLeitoInternacao: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroLeitoRPA: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroLeitoObs: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numeroLeitoHospitalDia: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    momentoAtualEmpreendimento: {
        type: DataTypes.STRING(140),
        allowNull: false
    },
    possuiEngenhariaClinica: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    tipoEngenhariaClinica: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    obsEngenhariaClinica: {
        type: DataTypes.STRING(45),
        allowNull: true
    },
    precisaCME: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    busco: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    diaSemanaCirurgia: {
        type: DataTypes.STRING,
        allowNull: true,
        get() {
            const rawValue = this.getDataValue('diaSemanaCirurgia');
            return rawValue ? rawValue.split(',') : [];
        },
        set(value) {
            this.setDataValue('diaSemanaCirurgia', value.join(','));
        }
    },
    intervaloPicoCME: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    processaTecido: { // pode ser colocado char ou varchar
        type: DataTypes.STRING(45),
        allowNull: false
    },
    aceitarTermos: { // pode ser colocado char ou varchar
        type: DataTypes.STRING(45),
        allowNull: false
    },
}, {
    tableName: 'lead',
    timestamps: true,
});

module.exports = Lead;