
const Washer = require('../schemas/schemaWasher');
const WasherBrand = require('../schemas/schemaWasherBrand');

const getWasherModels = async (req, res) => {
    try {
        const washerModels = await Washer.findAll();
        res.status(200).send(washerModels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOneWasherModel = async (req, res) => {
    let id = req.params.id;
    try {
        const washerModel = await Washer.findByPk(id);
        if (washerModel) {
            res.status(200).send(washerModel);
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getWasherModelsByBrand = async (req, res) => {
    try {
        const brandsWithWashers = await WasherBrand.findAll({
            include: {
                model: Washer,
                attributes: ['id', 'modeloLavadora']
            }
        });
        res.status(200).json(brandsWithWashers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createOneWasherModel = async (req, res) => {
    const {
        marcaLavadora,
        modeloLavadora,
        volumeTotalCamaraLt,
        capacidadeCargaBandejasInstrumentos,
        capacidadeCargaTraqueias,
        tempMedCicloInstrumentosCargaMaxMin,
        tempMedCicloAssisVentCargaMaxMin,
        producaoUeInstrumentosDia,
        numCirurgiasDia,
        numLeitosUti,
        numBandejasPorUe,
        capacidadeProcessamUeCargaInstrumentos,
        numCiclosInstrumentosDia,
        intervaloMedEntreCiclos,
        tempProcessamDemandaInstrumentosMin,
        qtdTraqueiasCirurgia,
        qtdTraqueiasDia,
        qtdTraqueiasLeitoUtiDia,
        qtdTraqueiasUtiDia,
        qtdTotTraqueiasDia,
        qtdCiclosAssistVentDia,
        tempProcessamDemandaAssistVentMin,
        demandaCiclosDia,
        demandaTempoDiaMin,
        quantidadeTermosProjeto,
        minutosDisponiveisTodosEquipamDia,
        percentualUtilizacaoCapacidadeMax,
        preco
    } = req.body;

    if (!modeloLavadora) {
        return res.status(400).json({ message: 'Modelo da lavadora não fornecido.' });
    }

    const existingModel = await Washer.findOne({ where: { modeloLavadora } });

    if (existingModel) {
        return res.status(409).json({ message: 'O Modelo já foi cadastrado.' });
    }

    try {
        const newWasherModel = await Washer.create({
            marcaLavadora,
            modeloLavadora,
            volumeTotalCamaraLt,
            capacidadeCargaBandejasInstrumentos,
            capacidadeCargaTraqueias,
            tempMedCicloInstrumentosCargaMaxMin,
            tempMedCicloAssisVentCargaMaxMin,
            producaoUeInstrumentosDia,
            numCirurgiasDia,
            numLeitosUti,
            numBandejasPorUe,
            capacidadeProcessamUeCargaInstrumentos,
            numCiclosInstrumentosDia,
            intervaloMedEntreCiclos,
            tempProcessamDemandaInstrumentosMin,
            qtdTraqueiasCirurgia,
            qtdTraqueiasDia,
            qtdTraqueiasLeitoUtiDia,
            qtdTraqueiasUtiDia,
            qtdTotTraqueiasDia,
            qtdCiclosAssistVentDia,
            tempProcessamDemandaAssistVentMin,
            demandaCiclosDia,
            demandaTempoDiaMin,
            quantidadeTermosProjeto,
            minutosDisponiveisTodosEquipamDia,
            percentualUtilizacaoCapacidadeMax,
            preco
        });
        res.status(201).send(newWasherModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneWasherModel = async (req, res) => {
    try {
        const id = req.params.id;
        const model = await Washer.findByPk(id);

        if (!model) {
            return res.status(404).send('Modelo não encontrado!');
        }

        const modelWasher = req.body;
        const { modeloLavadora } = modelWasher;

        const existingModel = await Washer.findOne({ where: { modeloLavadora } });

        if (existingModel && existingModel.id !== parseInt(id)) {
            return res.status(409).json({ message: 'Modelo já cadastrado no banco de dados.' });
        }

        if (!modeloWasher) {
            return res.status(400).json({ message: 'Modelo da lavadora não fornecido.' });
        }

        const [updatedModel] = await Washer.update(modelWasher, {
            where: { id }
        });

        if (updatedModel) {
            res.status(200).json({ message: 'Modelo atualizado com sucesso!' });
        } else {
            res.status(404).json({ message: 'Modelo não encontrado!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneWasherModel = async (req, res) => {
    let id = req.params.id;
    try {
        const deleted = await Washer.destroy({
            where: { id: id }
        });
        if (deleted) {
            res.status(200).send('Modelo removido com sucesso!');
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getWasherModels, getOneWasherModel, getWasherModelsByBrand, createOneWasherModel, updateOneWasherModel, deleteOneWasherModel };
