
require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');
const Washer = require('../schemas/schemaWasher');
const WasherBrand = require('../schemas/schemaWasherBrand');

async function percentUtilizationWasher(id) {
    let connection;
    try {
        connection = await conn();
        //consulta leads
        const queryLead = `SELECT 
              numeroLeitoUTI,
              estimativaVolumeTotalDiárioMaterial,
              numeroCirurgiaSalaDia
          FROM \`lead\` WHERE id = ?`;
        const [resultsLead] = await connection.query(queryLead, [id]);

        if (resultsLead.length === 0) {
            return null;
        }

        const { numeroLeitoUTI, estimativaVolumeTotalDiárioMaterial, numeroCirurgiaSalaDia } = resultsLead[0];

        //consulta lavadoras
        const queryWashers = `SELECT * FROM \`lavadora\``;
        const [resultsWashers] = await connection.query(queryWashers);

        if (resultsWashers.length === 0) {
            return null;
        }

        let resultados = [];
        for (const washer of resultsWashers) {
            let {
                id,
                capacidadeCargaBandejasInstrumentos,
                capacidadeCargaTraqueias,
                tempMedCicloInstrumentosCargaMaxMin,
                tempMedCicloAssisVentCargaMaxMin,
                numBandejasPorUe,
                intervaloMedEntreCiclos,
                qtdTraqueiasCirurgia,
                qtdTraqueiasLeitoUtiDia,
                quantidadeTermosProjeto
            } = washer;

            //entra na tabela de lavadora
            let capacidadeProcessamUeCargaInstrumentos =
                capacidadeCargaBandejasInstrumentos /
                numBandejasPorUe

            //entra na tabela de lead
            let numCiclosInstrumentosDia =
                estimativaVolumeTotalDiárioMaterial /
                capacidadeProcessamUeCargaInstrumentos

            let tempProcessamDemandaInstrumentosMin = numCiclosInstrumentosDia *
                (tempMedCicloInstrumentosCargaMaxMin + intervaloMedEntreCiclos)

            let qtdTraqueiasDia = numeroCirurgiaSalaDia * qtdTraqueiasCirurgia
            let qtdTraqueiasUtiDia = numeroLeitoUTI * qtdTraqueiasLeitoUtiDia
            let qtdTotTraqueiasDia = qtdTraqueiasDia + qtdTraqueiasUtiDia
            let qtdCiclosAssistVentDia = qtdTotTraqueiasDia / capacidadeCargaTraqueias
            let demandaCiclosDia = qtdCiclosAssistVentDia + numCiclosInstrumentosDia
            let tempProcessamDemandaAssistVentMin = qtdCiclosAssistVentDia *
                (tempMedCicloAssisVentCargaMaxMin +
                    intervaloMedEntreCiclos)

            let demandaTempoDiaMin = tempProcessamDemandaInstrumentosMin +
                tempProcessamDemandaAssistVentMin
            let minutosDisponiveisTodosEquipamDia = 60 * 24 * quantidadeTermosProjeto
            let percentualUtilizacaoCapacidadeMax = Math.round(((demandaTempoDiaMin /
                minutosDisponiveisTodosEquipamDia) * 100) * 100) / 100

            const updateQueryLead = `UPDATE \`lead\` SET 
        numCiclosInstrumentosDia = ?,
        tempProcessamDemandaInstrumentosMin = ?, 
        qtdTraqueiasDia = ?, 
        qtdTraqueiasUtiDia = ?,
        qtdTotTraqueiasDia = ?,
        qtdCiclosAssistVentDia = ?,
        demandaCiclosDia = ?,
        tempProcessamDemandaAssistVentMin = ?,
        demandaTempoDiaMin = ?,
        minutosDisponiveisTodosEquipamDia = ?,
        percentualUtilizacaoCapacidadeMax = ?
      WHERE id = ?`;

            await connection.query(updateQueryLead, [
                numCiclosInstrumentosDia,
                tempProcessamDemandaInstrumentosMin,
                qtdTraqueiasDia,
                qtdTraqueiasUtiDia,
                qtdTotTraqueiasDia,
                qtdCiclosAssistVentDia,
                demandaCiclosDia,
                tempProcessamDemandaAssistVentMin,
                demandaTempoDiaMin,
                minutosDisponiveisTodosEquipamDia,
                percentualUtilizacaoCapacidadeMax,
                id
            ]);

            const updateQueryWasher = `UPDATE \`lavadora\` SET 
        capacidadeProcessamUeCargaInstrumentos = ?
      WHERE id = ?`;

            await connection.query(updateQueryWasher, [
                capacidadeProcessamUeCargaInstrumentos,
                id
            ]);

            resultados.push({
                washerId: washer.id,
                percentualUtilizacaoCapacidadeMax
            });
        }

        return resultados;
    } catch (err) {
        console.error("Erro ao executar a consulta:", err);
        throw err;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

async function getAllBrandsWashers() {
    let connection;
    try {
        connection = await conn();
        const query = `SELECT marcaLavadora FROM \`lavadora\``;
        const [results] = await connection.query(query);
        return results.map((row) => row.marcaLavadora);
    } catch (err) {
        console.error("Erro ao obter as marcas:", err);
        throw err;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// async function getAllModelsWashers() {
//     let connection;
//     try {
//         connection = await conn();
//         const query = `SELECT modeloLavadora FROM \`lavadora\``;
//         const [results] = await connection.query(query);
//         return results.map((row) => row.modeloLavadora);
//     } catch (err) {
//         console.error("Erro ao obter os modelos:", err);
//         throw err;
//     } finally {
//         if (connection) {
//             await connection.end();
//         }
//     }
// }


async function getAllModelsWashers() {
    try {
        const washers = await Washer.findAll({
            attributes: ['id', 'modeloLavadora']
        });

        return washers.map((washer) => ({
            washerId: washer.id,
            modeloLavadora: washer.modeloLavadora
        }));
    } catch (err) {
        console.error("Erro ao obter os modelos das lavadoras:", err);
        throw err;
    }
}

async function getAllPricesWashers() {
    try {
        const washers = await Washer.findAll({
            attributes: ['id', 'preco']
        });

        return washers.map((washers) => ({
            washerId: washers.id,
            preco: washers.preco
        }));
    } catch (err) {
        console.error("Erro ao obter os preços das lavadoras:", err);
        throw err;
    }
}



// async function getAllPricesWashers() {
//     let connection;
//     try {
//         connection = await conn();
//         const query = `SELECT preco FROM \`lavadora\``;
//         const [results] = await connection.query(query);
//         return results.map((row) => row.preco);
//     } catch (err) {
//         console.error("Erro ao obter os preços:", err);
//         throw err;
//     } finally {
//         if (connection) {
//             await connection.end();
//         }
//     }
// }

async function getBrandNameById(washerId) {
    try {
        const washer = await Washer.findByPk(washerId, {
            include: {
                model: WasherBrand,
                as: 'brand'
            }
        });

        if (!washer) {
            console.error(`Lavadora com id ${washerId} não encontrada.`);
            return null;
        }


        return washer.brand ? washer.brand.nomeMarca : null;
    } catch (err) {
        console.error("Erro ao obter o nome da marca da lavadora:", err);
        throw err;
    }
}

async function washersRecommendationByLead(leadId) {
    try {
        console.log(`Recebido leadId para recomendação de lavadoras: ${leadId}`);

        const percentResults = await percentUtilizationWasher(leadId);
        console.log(`Resultados percentuais para leadId ${leadId}:`, percentResults);

        const resultados = [];

        for (let i = 0; i < percentResults.length; i++) {
            const percentResult = percentResults[i];

            if (percentResult.percentualUtilizacaoCapacidadeMax <= 90) {
                const washerId = percentResult.washerId;


                const marcaNomeLavadora = await getBrandNameById(washerId);


                const preco = await getAllPricesWashers()
                    .then(prices => prices.find(item => item.washerId === washerId)?.preco);


                const modeloLavadora = await getAllModelsWashers()
                    .then(models => models.find(item => item.washerId === washerId)?.modeloLavadora);

                resultados.push({
                    leadId: leadId,
                    marcaId: washerId,
                    nomeMarca: marcaNomeLavadora,
                    modeloId: washerId,
                    modeloLavadora: modeloLavadora || '',
                    washerId: washerId,
                    percentUtilizationWasher: percentResult.percentualUtilizacaoCapacidadeMax,
                    preco: preco
                });
            }
        }

        const recomendacoes = resultados.slice(0, 2);

        console.log(`Recomendações para leadId ${leadId}:`, recomendacoes);
        return recomendacoes;
    } catch (err) {
        console.error(`Erro ao calcular as recomendações para leadId ${leadId}:`, err);
        throw err;
    }
}

// async function washersRecommendationByLead(leadId) {
//     try {
//         console.log(`Recebido leadId para recomendação de lavadoras: ${leadId}`);

//         const marcas = await getAllBrandsWashers();
//         const modelos = await getAllModelsWashers();
//         const precos = await getAllPricesWashers();
//         const resultados = [];

//         const percentResults = await percentUtilizationWasher(leadId);
//         console.log(`Resultados percentuais para leadId ${leadId}:`, percentResults);

//         for (let i = 0; i < percentResults.length; i++) {
//             const percentResult = percentResults[i];

//             if (percentResult.percentualUtilizacaoCapacidadeMax <= 90) {
//                 const washerId = percentResult.washerId;
//                 const modeloLavadora = modelos[washerId];
//                 const marcaLavadora = marcas[washerId];
//                 const preco = precos[washerId]

//                 resultados.push({
//                     leadId: leadId,
//                     marcaId: marcaLavadora,
//                     modeloId: modeloLavadora,
//                     washerId: percentResult.washerId,
//                     percentUtilizationWasher: percentResult.percentualUtilizacaoCapacidadeMax,
//                     preco: preco
//                 });
//             }
//         }

//         const recomendacoes = resultados.slice(0, 2);

//         console.log(`Recomendações para leadId ${leadId}:`, recomendacoes);
//         return recomendacoes;
//     } catch (err) {
//         console.error(`Erro ao calcular as recomendações para leadId ${leadId}:`, err);
//         throw err;
//     }
// }


/*async function visualizarResultados() {
    try {
        const ids = await getAllLeadIds();
        const resultados = [];

        for (const id of ids) {
            const resultadoPercent = await percentUtilizationWasher(id);
            const resultadoRecomendacoesLav = await washersRecommendationByLead(id);
            resultados.push(resultadoPercent, resultadoRecomendacoesLav);
        }
        console.log("Resultados:", resultados);
    } catch (err) {
        console.error("Erro ao calcular o volume total diário por lead:", err);
    }
}

visualizarResultados();*/


module.exports = {
    percentUtilizationWasher,
    washersRecommendationByLead
};
