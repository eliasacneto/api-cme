const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');
const Lead = require('./schemaLead');

const LeadCalcProject = sequelize.define('calculo_projeto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    numCirurgiasDia: { //72
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    volumeTotalDiarioCirurgias: { //float?? 108.0 ue
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    volumeTotalDiarioUTIs: { // float?? 15.0
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
    },
    volumeTotalDiarioInternacao: { //7.5
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    estimativaVolumeTotalDiárioMaterial: { //130.50
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    estimativaVolumeTotalDiarioInstrumentalUE: { //206.9
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.0
    },
    estimativaVolumeTotalDiarioInstrumentalLt: { //float ?? 14089
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    lead_project: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Lead,
            key: 'id'
        }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
}, 
{
    tableName: 'calculo_projeto',
    timestamps: true,
}
);

module.exports = LeadCalcProject;