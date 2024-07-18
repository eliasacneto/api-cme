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
        type: DataTypes.STRING(45),
        allowNull: false
    },
    rua: {
        type: DataTypes.STRING(45),
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
        type: DataTypes.STRING(45),
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
        type: DataTypes.STRING(45),
        allowNull: false
    },
    processaTecido: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    aceitarTermos: {
        type: DataTypes.STRING(45),
        allowNull: false
    },
    numCirurgiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    volumeTotalDiarioCirurgias: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    volumeTotalDiarioUTIs: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    volumeTotalDiarioInternacao: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    estimativaVolumeTotalDiárioMaterial: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    estimativaVolumeTotalDiarioInstrumentalUE: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0
    },
    estimativaVolumeTotalDiarioInstrumentalLt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    producaoHospitalVolDiarioMaterialLt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    intervaloDiarioPicoMin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    numMaxCiclosIntervaloPico: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    capProcessamIntervaloPicoTodasAutoclavesOnLt: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    volumeProcessadoIntervaloPicoLt90totDiario: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    horasTrabalhoAtenderVolTotalHr: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    capUtilizTodasAutoclavesIntervaloPicoPorcent: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    numCiclosInstrumentosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaInstrumentosMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    qtdTraqueiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTraqueiasUtiDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdTotTraqueiasDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    qtdCiclosAssistVentDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    demandaCiclosDia: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0
    },
    tempProcessamDemandaAssistVentMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    demandaTempoDiaMin: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    minutosDisponiveisTodosEquipamDia: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    percentualUtilizacaoCapacidadeMax: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0
    },
    calculationResult: {
        type: DataTypes.JSON,
        allowNull: true
    },
    autoclaveRecommendations: {
        type: DataTypes.JSON,
        allowNull: true
    },
    washerRecommendations: {
        type: DataTypes.JSON,
        allowNull: true
    },
}, {
    tableName: 'lead',
    timestamps: true,
});

Lead.sync({ alter: true });

module.exports = Lead;