require("dotenv").config();
const conn = require("../database/conn");
const { getAllLeadIds } = require('./calculadora');
const Autoclave = require('../schemas/schemaAutoclave');
const AutoclaveBrand = require('../schemas/schemaAutoclaveBrand');

async function percentUtilizationAutoclave(id) {
    let connection;
    try {
        connection = await conn();
        //consulta leads
        const queryLead = `SELECT 
              intervaloPicoCME,
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`lead\` WHERE id = ?`;
        const [resultsLead] = await connection.query(queryLead, [id]);

        if (resultsLead.length === 0) {
            return null;
        }

        const { intervaloPicoCME, estimativaVolumeTotalDiarioInstrumentalLt } = resultsLead[0];

        //consulta autoclaves
        const queryAutoclaves = `SELECT * FROM \`autoclave\``;
        const [resultsAutoclaves] = await connection.query(queryAutoclaves);

        if (resultsAutoclaves.length === 0) {
            return null;
        }

        let resultados = [];

        for (const autoclave of resultsAutoclaves) {
            let {
                id,
                tempoCargaDescargaMin,
                medTotTempoCicloATMin,
                tempoTestDiarioBDMin,
                tempoDiarioAquecimentoMaqMin,
                numAutoclaves,
                volumeUtilCamaraLt,
                volumeTotCamaraLt, preco
            } = autoclave;

            //entra na tabela de autoclave
            let tempoClicloCarDescMin = tempoCargaDescargaMin + medTotTempoCicloATMin
            let tempoDisponivelDiarioMin = (24 * 60) - (tempoDiarioAquecimentoMaqMin + tempoTestDiarioBDMin)
            let numMaxCiclosDia = tempoDisponivelDiarioMin / tempoClicloCarDescMin
            let aproveitamentoCamaraPorcent = (volumeUtilCamaraLt / volumeTotCamaraLt) * 100
            let numAutoclavesUmaEmManutencao = numAutoclaves - 1

            //entra na tabela de lead
            let intervaloDiarioPicoMin = (intervaloPicoCME * 60) -
                (tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin)

            let numMaxCiclosIntervaloPico = intervaloDiarioPicoMin / tempoClicloCarDescMin

            let capProcessamIntervaloPicoTodasAutoclavesOnLt =
                numAutoclaves *
                volumeUtilCamaraLt *
                numMaxCiclosIntervaloPico

            let volumeProcessadoIntervaloPicoLt90totDiario = estimativaVolumeTotalDiarioInstrumentalLt * 0.9
            let capUtilizTodasAutoclavesIntervaloPicoPorcent =
                Math.round(((volumeProcessadoIntervaloPicoLt90totDiario / capProcessamIntervaloPicoTodasAutoclavesOnLt) * 100) * 100) / 100;

            const updateQueryLead = `UPDATE \`lead\` SET 
        intervaloDiarioPicoMin = ?,
        numMaxCiclosIntervaloPico = ?,
        capProcessamIntervaloPicoTodasAutoclavesOnLt = ?, 
        volumeProcessadoIntervaloPicoLt90totDiario = ?, 
        capUtilizTodasAutoclavesIntervaloPicoPorcent = ?
      WHERE id = ?`;

            await connection.query(updateQueryLead, [
                intervaloDiarioPicoMin,
                numMaxCiclosIntervaloPico,
                capProcessamIntervaloPicoTodasAutoclavesOnLt,
                volumeProcessadoIntervaloPicoLt90totDiario,
                capUtilizTodasAutoclavesIntervaloPicoPorcent,
                id
            ]);

            const updateQueryAutoclave = `UPDATE \`autoclave\` SET      
        tempoClicloCarDescMin = ?,
        tempoDisponivelDiarioMin = ?,
        numMaxCiclosDia = ?,
        aproveitamentoCamaraPorcent = ?,
        numAutoclavesUmaEmManutencao = ?
      WHERE id = ?`;

            await connection.query(updateQueryAutoclave, [
                tempoClicloCarDescMin,
                tempoDisponivelDiarioMin,
                numMaxCiclosDia,
                aproveitamentoCamaraPorcent,
                numAutoclavesUmaEmManutencao,
                id
            ]);

            resultados.push({
                autoclaveId: autoclave.id,
                capUtilizTodasAutoclavesIntervaloPicoPorcent
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

async function horasTrabalhoAtenderVolTotal(id) {
    let connection;
    try {
        connection = await conn();
        const queryLead = `SELECT 
              estimativaVolumeTotalDiarioInstrumentalLt
          FROM \`lead\` WHERE id = ?`;
        const [resultsLead] = await connection.query(queryLead, [id]);

        if (resultsLead.length === 0) {
            return null;
        }

        const estimativaVolumeTotalDiarioInstrumentalLt = resultsLead[0].estimativaVolumeTotalDiarioInstrumentalLt

        const queryAutoclaves = `SELECT * FROM \`autoclave\``;
        const [resultsAutoclaves] = await connection.query(queryAutoclaves);

        if (resultsAutoclaves.length === 0) {
            return null;
        }

        let resultados = [];
        for (const autoclave of resultsAutoclaves) {
            let {
                id,
                tempoClicloCarDescMin,
                tempoTestDiarioBDMin,
                tempoDiarioAquecimentoMaqMin,
                numAutoclavesUmaEmManutencao,
                volumeUtilCamaraLt
            } = autoclave;

            //entra na tabela de lead
            let horasTrabalhoAtenderVolTotalHr = Math.floor((((
                estimativaVolumeTotalDiarioInstrumentalLt / volumeUtilCamaraLt)
                * tempoClicloCarDescMin) +
                tempoTestDiarioBDMin + tempoDiarioAquecimentoMaqMin) / 60)
                / numAutoclavesUmaEmManutencao

            const updateQueryLead = `UPDATE \`lead\` SET  
      horasTrabalhoAtenderVolTotalHr = ?
    WHERE id = ?`;

            await connection.query(updateQueryLead, [
                horasTrabalhoAtenderVolTotalHr,
                id
            ]);

            resultados.push({
                autoclaveId: autoclave.id,
                horasTrabalhoAtenderVolTotalHr
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

async function getAllBrandsAutoclaves() {
    let connection;
    try {
        connection = await conn();
        const query = `SELECT marcaAutoclave FROM \`autoclave\``;
        const [results] = await connection.query(query);
        return results.map((row) => row.marcaAutoclave);
    } catch (err) {
        console.error("Erro ao obter as marcas:", err);
        throw err;
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// async function getAllModelsAutoclaves() {
//     let connection;
//     try {
//         connection = await conn();
//         const query = `SELECT modeloAutoclave FROM \`autoclave\``;
//         const [results] = await connection.query(query);
//         return results.map((row) => row.modeloAutoclave);
//     } catch (err) {
//         console.error("Erro ao obter os modelos:", err);
//         throw err;
//     } finally {
//         if (connection) {
//             await connection.end();
//         }
//     }
// }

async function getAllModelsAutoclaves() {
    try {
        const autoclaves = await Autoclave.findAll({
            attributes: ['id', 'modeloAutoclave']
        });

        return autoclaves.map((autoclave) => ({
            autoclaveId: autoclave.id,
            modeloAutoclave: autoclave.modeloAutoclave
        }));
    } catch (err) {
        console.error("Erro ao obter os modelos das autoclaves:", err);
        throw err;
    }
}

async function getAllPricesAutoclaves() {
    try {
        const autoclaves = await Autoclave.findAll({
            attributes: ['id', 'preco']
        });

        return autoclaves.map((autoclave) => ({
            autoclaveId: autoclave.id,
            preco: autoclave.preco
        }));
    } catch (err) {
        console.error("Erro ao obter os preços das autoclaves:", err);
        throw err;
    }
}

async function getBrandNameById(autoclaveId) {
    try {
        const autoclave = await Autoclave.findByPk(autoclaveId, {
            include: {
                model: AutoclaveBrand,
                as: 'brand'
            }
        });

        if (!autoclave) {
            console.error(`Autoclave com id ${autoclaveId} não encontrada.`);
            return null;
        }


        return autoclave.brand ? autoclave.brand.nomeMarca : null;
    } catch (err) {
        console.error("Erro ao obter o nome da marca da autoclave:", err);
        throw err;
    }
}

async function autoclaveRecommendationByLead(leadId) {
    try {
        console.log(`Recebido leadId para recomendação de autoclaves: ${leadId}`);

        const percentResults = await percentUtilizationAutoclave(leadId);
        const horasResults = await horasTrabalhoAtenderVolTotal(leadId);
        console.log(`Resultados percentuais para leadId ${leadId}:`, percentResults);
        console.log(`Resultados de horas para leadId ${leadId}:`, horasResults);

        const resultados = [];

        for (let i = 0; i < percentResults.length; i++) {
            const percentResult = percentResults[i];
            const horasResult = horasResults[i];

            if (percentResult.capUtilizTodasAutoclavesIntervaloPicoPorcent >= 80 &&
                percentResult.capUtilizTodasAutoclavesIntervaloPicoPorcent <= 90 &&
                horasResult.horasTrabalhoAtenderVolTotalHr < 20) {
                const autoclaveId = percentResult.autoclaveId;


                const marcaNomeAutoclave = await getBrandNameById(autoclaveId);


                const preco = await getAllPricesAutoclaves()
                    .then(prices => prices.find(item => item.autoclaveId === autoclaveId)?.preco);


                const modeloAutoclave = await getAllModelsAutoclaves()
                    .then(models => models.find(item => item.autoclaveId === autoclaveId)?.modeloAutoclave);

                resultados.push({
                    leadId: leadId,
                    marcaId: autoclaveId,
                    nomeMarca: marcaNomeAutoclave,
                    modeloId: autoclaveId,
                    modeloAutoclave: modeloAutoclave || '',
                    autoclaveId: autoclaveId,
                    percentUtilizationAutoclave: percentResult.capUtilizTodasAutoclavesIntervaloPicoPorcent,
                    horasTrabalhoAtenderVolTotal: horasResult.horasTrabalhoAtenderVolTotalHr,
                    preco: preco
                });
            }
        }

        const recomendacoes = resultados.slice(0, 3);

        console.log(`Recomendações para leadId ${leadId}:`, recomendacoes);
        return recomendacoes;
    } catch (err) {
        console.error(`Erro ao calcular as recomendações para leadId ${leadId}:`, err);
        throw err;
    }
}
/*async function visualizarResultados() {
    try {
        const ids = await getAllLeadIds();
        const resultados = [];

        for (const id of ids) {
            const resultadoPercent = await percentUtilizationAutoclave(id);
            const resultadoHr = await horasTrabalhoAtenderVolTotal(id);
            const resultadoRecomendacoesAuto = await autoclaveRecommendationByLead(id);
            resultados.push(resultadoPercent, resultadoHr, resultadoRecomendacoesAuto);
        }
        console.log("Recomendações:", resultados);
    } catch (err) {
        console.error("Erro ao calcular o volume total diário por lead:", err);
    }
}

visualizarResultados();*/


module.exports = {
    horasTrabalhoAtenderVolTotal,
    percentUtilizationAutoclave,
    autoclaveRecommendationByLead
};