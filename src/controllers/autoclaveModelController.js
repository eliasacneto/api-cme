const Autoclave = require('../schemas/schemaAutoclave');
const AutoclaveBrand = require('../schemas/schemaAutoclaveBrand');


const getAutoclaveModels = async (req, res) => {
    try {
        const autoclaveModels = await Autoclave.findAll();
        res.status(200).send(autoclaveModels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOneAutoclaveModel = async (req, res) => {
    let id = req.params.id;
    try {
        const autoclaveModel = await Autoclave.findByPk(id);
        if (autoclaveModel) {
            res.status(200).send(autoclaveModel);
        } else {
            res.status(404).send('Modelo não encontrado!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getAutoclaveModelsByBrand = async (req, res) => {
    try {
        const brandsWithAutoclaves = await AutoclaveBrand.findAll({
            include: {
                model: Autoclave,
                attributes: ['id', 'modeloAutoclave']
            }
        });
        res.status(200).json(brandsWithAutoclaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOneAutoclaveModel = async (req, res) => {
    const {
        marcaAutoclave,
        modeloAutoclave,
        volumeTotCamaraLt,
        volumeUtilCamaraLt,
        medTotTempoCicloATMin,
        tempoCargaDescargaMin,
        tempoTestDiarioBDMin,
        tempoDiarioAquecimentoMaqMin,
        volumeProcessadoIntervaloPicoLt90totDiario,
        intervaloDiarioPicoMin,
        numMaxCiclosIntervaloPico,
        preco,
        numAutoclaves, //
        tempoClicloCarDescMin,
        numAutoclavesUmaEmManutencao,
        tempoDisponivelDiarioMin,
        numMaxCiclosDia,
        aproveitamentoCamaraPorcent        
    } = req.body;

    if (!modeloAutoclave) {
        return res.status(400).json({ message: 'Modelo da autoclave não fornecido.' });
    }

    const existingModel = await Autoclave.findOne({ where: { modeloAutoclave } });

    if (existingModel) {
        return res.status(409).json({ message: 'O Modelo já foi cadastrado.' });
    }

    try {
        const newAutoclaveModel = await Autoclave.create({
            marcaAutoclave,
            modeloAutoclave,
            volumeTotCamaraLt,
            volumeUtilCamaraLt,
            medTotTempoCicloATMin,
            tempoCargaDescargaMin,
            tempoTestDiarioBDMin,
            tempoDiarioAquecimentoMaqMin,
            volumeProcessadoIntervaloPicoLt90totDiario,
            intervaloDiarioPicoMin,
            numMaxCiclosIntervaloPico,
            preco,
            numAutoclaves,
            tempoClicloCarDescMin,
            numAutoclavesUmaEmManutencao,
            tempoDisponivelDiarioMin,
            numMaxCiclosDia,
            aproveitamentoCamaraPorcent
        });
        res.status(201).send(newAutoclaveModel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneAutoclaveModel = async (req, res) => {
    try {
        const id = req.params.id;
        const model = await Autoclave.findByPk(id);

        if (!model) {
            return res.status(404).send('Modelo não encontrado!');
        }

        const modelAutoclave = req.body;
        const { modeloAutoclave } = modelAutoclave;

        const existingModel = await Autoclave.findOne({ where: { modeloAutoclave } });

        if (existingModel && existingModel.id !== parseInt(id)) {
            return res.status(409).json({ message: 'Modelo já cadastrado no banco de dados.' });
        }

        if (!modeloAutoclave) {
            return res.status(400).json({ message: 'Modelo da autoclave não fornecido.' });
        }

        const [updatedModel] = await Autoclave.update(modelAutoclave, {
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


const deleteOneAutoclaveModel = async (req, res) => {
    let id = req.params.id;
    try {
        const deleted = await Autoclave.destroy({
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

module.exports = { getAutoclaveModels, getOneAutoclaveModel, getAutoclaveModelsByBrand, createOneAutoclaveModel, updateOneAutoclaveModel, deleteOneAutoclaveModel };