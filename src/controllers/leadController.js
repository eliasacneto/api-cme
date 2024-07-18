const Lead = require('../schemas/schemaLead');
const { calculoVolumeTotalDiarioPorLead } = require('../utils/calculadora');
const { autoclaveRecommendationByLead } = require('../utils/autoclaveCalc');
const { washersRecommendationByLead } = require('../utils/washerCalc');


const getLeads = async (_, res) => {
    try {
        const leads = await Lead.findAll();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await Lead.findByPk(id);

        if (lead) {
            res.status(200).json(lead);
        } else {
            res.status(404).send('Cliente não encontrado!');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createOneLead = async (req, res) => {
    try {
        const lead = req.body;
        const { hospitalEmail, processaTecido } = lead;

        if (!hospitalEmail) {
            return res.status(400).json({ message: 'Email do hospital não fornecido.' });
        }

        const existingLead = await Lead.findOne({ where: { hospitalEmail } });

        if (existingLead) {
            return res.status(409).json({ message: 'O Cliente já obteve orçamento.' });
        }

        if (Object.keys(lead).length > 0) {
            const newLead = await Lead.create(lead);
            const newLeadId = newLead.id;
            console.log(`Novo lead criado com ID: ${newLeadId}`);

            // Execute os cálculos após criar o lead
            const calculationResult = await calculoVolumeTotalDiarioPorLead(newLeadId);
            console.log(`Resultado do cálculo para leadId ${newLeadId}:`, calculationResult);

            const autoclaveRecommendations = await autoclaveRecommendationByLead(newLeadId);
            console.log(`Recomendações de autoclave para leadId ${newLeadId}:`, autoclaveRecommendations);

            let washerRecommendations;
            if (processaTecido == '0') {
                washerRecommendations = await washersRecommendationByLead(newLeadId);
                console.log(`Recomendações de lavadora para leadId ${newLeadId}:`, washerRecommendations);
            } else {
                washerRecommendations = 'Não se aplica';
            }

            // Atualize o lead com os resultados dos cálculos
            await Lead.update({
                calculationResult,
                autoclaveRecommendations,
                washerRecommendations
            }, {
                where: { id: newLeadId }
            });

            res.status(201).json({
                lead: newLead,
                calculationResult,
                autoclaveRecommendations,
                washerRecommendations
            });
        } else {
            res.status(406).json({ message: 'Ops, não foi possível adicionar esse cliente!' });
        }
    } catch (error) {
        console.error(`Erro ao criar lead: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

const updateOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const lead = await Lead.findByPk(id);

        if (!lead) {
            return res.status(404).send('Cliente não encontrado!');
        }

        const leadEmail = req.body;
        const { hospitalEmail } = leadEmail;

        const existingLead = await Lead.findOne({ where: { hospitalEmail } });

        if (existingLead && existingLead.id !== parseInt(id)) {
            return res.status(409).json({ message: 'Email já cadastrado no banco de dados.' });
        }

        if (!hospitalEmail) {
            return res.status(400).json({ message: 'Email do hospital não fornecido.' });
        }

        const [updatedLead] = await Lead.update(leadEmail, {
            where: { id }
        });

        if (updatedLead) {
            res.status(200).json({ message: 'Informações do cliente atualizadas com sucesso!' });
        } else {
            res.status(404).json({ message: 'Cliente não encontrado!' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOneLead = async (req, res) => {
    try {
        const id = req.params.id;
        const rowsDeleted = await Lead.destroy({
            where: { id }
        });

        if (rowsDeleted > 0) {
            res.status(200).send('Cliente removido com sucesso!');
        } else {
            res.status(404).send('Não foi possível excluir: ID não encontrado.');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkFormLead = async (req, res) => {
    const { hospitalEmail } = req.body;

    try {
        const lead = await Lead.findOne({ where: { hospitalEmail } })

        if (lead) {
            return res.status(200).json({ exists: true });

        } else {
            return res.json({ exists: false })
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });

    }
}

module.exports = { getLeads, getOneLead, createOneLead, updateOneLead, deleteOneLead, checkFormLead };