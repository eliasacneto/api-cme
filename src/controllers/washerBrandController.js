const WasherBrand = require('../schemas/schemaWasherBrand');

const getWasherBrands = async (req, res) => {
    try {
        const brands = await WasherBrand.findAll();
        res.status(200).json(brands);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getOneWasherBrand = async (req, res) => {
    const id = req.params.id;
    try {
        const brand = await WasherBrand.findByPk(id);
        if (brand) {
            res.status(200).json(brand);
        } else {
            res.status(404).send('Marca não encontrada!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createOneWasherBrand = async (req, res) => {
    try {
        const brand = req.body;
        const { nomeMarca } = brand;

        if (!nomeMarca) {
            return res.status(400).json({ message: 'Marca ou equipamento não fornecidos. Por favor preencha todos os campos!' });
        }

        const existingBrand = await WasherBrand.findOne({ where: { nomeMarca } });

        if (existingBrand) {
            return res.status(409).json({ message: 'A Marca já foi cadastrada.' });
        }

        if (Object.keys(brand).length > 0) {
            const newBrand = await WasherBrand.create(brand);
            res.status(201).json(newBrand);
        } else {
            res.status(406).json({ message: 'Ops, não foi possível adicionar essa marca!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOneWasherBrand = async (req, res) => {
    try {
        const id = req.params.id;
        const brand = await WasherBrand.findByPk(id);

        if (!brand) {
            return res.status(404).send('Marca não encontrada!');
        }

        const brandName = req.body;
        const { nomeMarca } = brandName;

        const existingBrand = await WasherBrand.findOne({ where: { nomeMarca } });

        if (existingBrand && existingBrand.id !== parseInt(id)) {
            return res.status(409).json({ message: 'Marca já cadastrada no banco de dados.' });
        }

        if (!nomeMarca) {
            return res.status(400).json({ message: 'Marca ou equipamento não fornecidos. Por favor preencha todos os campos!' });
        }

        const [updatedBrand] = await WasherBrand.update(brandName, {
            where: { id }
        });

        if (updatedBrand) {
            res.status(200).json({ message: 'Informações do cliente atualizadas com sucesso!' });
        } else {
            res.status(404).json({ message: 'Marca não encontrada!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneWasherBrand = async (req, res) => {
    const id = req.params.id;
    try {
        const deletedBrand = await WasherBrand.findByPk(id);
        if (deletedBrand) {
            await deletedBrand.destroy();
            res.status(200).send('Marca removida com sucesso!');
        } else {
            res.status(404).send('Não foi possível excluir: ID não encontrado.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getWasherBrands,
    getOneWasherBrand,
    createOneWasherBrand,
    updateOneWasherBrand,
    deleteOneWasherBrand
};