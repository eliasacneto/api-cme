//const { autoclaveRecommendationByLead } = require('../utils/autoclaveCalc');
//const { washersRecommendationByLead } = require('../utils/washerCalc');
const { calculoVolumeTotalDiario } = require('../utils/calculadora');

const getCalculation = async (req, res) => {
    const { id } = req.params;
    try {
        const recommendations = await calculoVolumeTotalDiario(id);
        res.json(recommendations);
    } catch (error) {
        console.error("Erro ao obter as recomendações:", error);
        res.status(500).json({ error: 'Erro ao obter as recomendações' });
    }
};

/*const getRecommendationAutoclave = async (req, res) => {
    const { id } = req.params;
    try {
        const recommendations = await autoclaveRecommendationByLead(id);
        res.json(recommendations);
    } catch (error) {
        console.error("Erro ao obter as recomendações:", error);
        res.status(500).json({ error: 'Erro ao obter as recomendações' });
    }
};

const getRecommendationWasher = async (req, res) => {
    const { id } = req.params;
    try {
        const recommendations = await washersRecommendationByLead(id);
        res.json(recommendations);
    } catch (error) {
        console.error("Erro ao obter as recomendações:", error);
        res.status(500).json({ error: 'Erro ao obter as recomendações' });
    }
};*/

//module.exports = { getCalculation, getRecommendationAutoclave, getRecommendationWasher };
module.exports = { getCalculation };
