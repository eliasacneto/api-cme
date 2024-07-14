require("dotenv").config();
const conn = require("../database/conn");

async function getAllLeadIds() {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT id FROM \`lead\``;
    const [results] = await connection.query(query);
    return results.map((row) => row.id);
  } catch (err) {
    console.error("Erro ao obter os IDs dos leads:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function calculoVolumeTotalDiarioPorLead(id) {
  let connection;
  try {
    connection = await conn();
    const query = `SELECT 
            numeroSalasCirurgias, 
            numeroCirurgiaSalaDia, 
            numeroLeitoUTI, 
            numeroLeitoInternacao, 
            numeroLeitoRPA,
            numeroLeitoObs,
            numeroLeitoHospitalDia,
            processaTecido
        FROM \`lead\` WHERE id = ?`;
    const [results] = await connection.query(query, [id]);

    if (results.length === 0) {
      return null;
    }

    const UE = 54;
    const volumePorCirurgia = 1.5;
    const volumePorLeitoUtiDiario = 0.5;
    const volumePorLeitoInternacaoDiario = 0.05;

    const row = results[0];

    let numeroSalasCirurgias = row.numeroSalasCirurgias;
    let numeroCirurgiaSalaDia = row.numeroCirurgiaSalaDia;
    let numeroLeitoUTI = row.numeroLeitoUTI;
    let numeroLeitoInternacao = row.numeroLeitoInternacao;
    let numeroLeitoRPA = row.numeroLeitoRPA;
    let numeroLeitoObs = row.numeroLeitoObs;
    let numeroLeitoHospitalDia = row.numeroLeitoHospitalDia;
    let numCirurgiasDia = numeroSalasCirurgias * numeroCirurgiaSalaDia;

    let numLeitosTotais =
      numeroLeitoUTI +
      numeroLeitoInternacao +
      numeroLeitoRPA +
      numeroLeitoObs +
      numeroLeitoHospitalDia;
    let volumeTotalDiarioCirurgias = numCirurgiasDia * volumePorCirurgia;
    let volumeTotalDiarioUTIs = numeroLeitoUTI * volumePorLeitoUtiDiario;
    let volumeTotalDiarioInternacao =
      (numLeitosTotais - numeroLeitoUTI) * volumePorLeitoInternacaoDiario;

    let estimativaVolumeTotalDiárioMaterial =
      volumeTotalDiarioInternacao +
      volumeTotalDiarioUTIs +
      volumeTotalDiarioCirurgias;
    let estimativaVolumeTotalDiarioInstrumentalLt =
      estimativaVolumeTotalDiárioMaterial * UE;
    let processaTecido = row.processaTecido;

    console.log('volumeTotalDiarioCirurgias:', volumeTotalDiarioCirurgias)
    console.log('volumeTotalDiarioUTIs:', volumeTotalDiarioUTIs)

    const arredondar = (valor, fator) => Math.ceil(valor * fator) / fator;
    volumeTotalDiarioInternacao = arredondar(volumeTotalDiarioInternacao, 10);
    console.log('volumeTotalDiarioInternacao:', volumeTotalDiarioInternacao)

    //TODO criar função para update do lead

    if (processaTecido == 0) {
      console.log("0 true = ✅ Ele processa tecidos");
      estimativaVolumeTotalDiarioInstrumentalUE = Math.round(estimativaVolumeTotalDiárioMaterial * 2 * 10) / 10;
      estimativaVolumeTotalDiarioInstrumentalLt = Math.round(estimativaVolumeTotalDiarioInstrumentalLt * 2);

      console.log('estimativaVolumeTotalDiarioInstrumentalUE:', estimativaVolumeTotalDiarioInstrumentalUE)
      console.log('estimativaVolumeTotalDiarioInstrumentalLt:', estimativaVolumeTotalDiarioInstrumentalLt)

      const updateQuery = `UPDATE \`lead\` SET  
        numCirurgiasDia = ?,
        volumeTotalDiarioCirurgias = ?, 
        volumeTotalDiarioUTIs = ?, 
        volumeTotalDiarioInternacao = ?,
        estimativaVolumeTotalDiárioMaterial = ?,
        estimativaVolumeTotalDiarioInstrumentalUE = ?,
        estimativaVolumeTotalDiarioInstrumentalLt = ?
        WHERE id = ?`;

      await connection.query(updateQuery, [
        numCirurgiasDia,
        volumeTotalDiarioCirurgias,
        volumeTotalDiarioUTIs,
        volumeTotalDiarioInternacao,
        estimativaVolumeTotalDiárioMaterial,
        estimativaVolumeTotalDiarioInstrumentalUE,        
        estimativaVolumeTotalDiarioInstrumentalLt,
        id
      ]);

      return estimativaVolumeTotalDiarioInstrumentalLt;
    } else {
      estimativaVolumeTotalDiarioInstrumentalUE = Math.round(estimativaVolumeTotalDiárioMaterial * 10) / 10;
      estimativaVolumeTotalDiarioInstrumentalLt = Math.round(estimativaVolumeTotalDiarioInstrumentalLt);

      console.log('estimativaVolumeTotalDiarioInstrumentalUE:', estimativaVolumeTotalDiarioInstrumentalUE)
      console.log('estimativaVolumeTotalDiarioInstrumentalLt:', estimativaVolumeTotalDiarioInstrumentalLt)

      console.log("1 false = ❌ Ele não processa tecidos");

      const updateQuery = `UPDATE \`lead\` SET 
        numCirurgiasDia = ?, 
        volumeTotalDiarioCirurgias = ?, 
        volumeTotalDiarioUTIs = ?, 
        volumeTotalDiarioInternacao = ?,
        estimativaVolumeTotalDiárioMaterial = ?,
        estimativaVolumeTotalDiarioInstrumentalUE = ?,
        estimativaVolumeTotalDiarioInstrumentalLt = ?
        WHERE id = ?`;

      await connection.query(updateQuery, [
        numCirurgiasDia,
        volumeTotalDiarioCirurgias,
        volumeTotalDiarioUTIs,
        volumeTotalDiarioInternacao,
        estimativaVolumeTotalDiárioMaterial,
        estimativaVolumeTotalDiarioInstrumentalUE,
        estimativaVolumeTotalDiarioInstrumentalLt,
        id
      ]);

      return estimativaVolumeTotalDiarioInstrumentalLt;
    }
  } catch (err) {
    console.error("Erro ao executar a consulta:", err);
    throw err;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function visualizarResultados() {
  try {
    const ids = await getAllLeadIds();
    const resultados = [];

    for (const id of ids) {
      const resultado = await calculoVolumeTotalDiarioPorLead(id);
      resultados.push(resultado);
    }
    console.log("Resultados:", resultados);
  } catch (err) {
    console.error("Erro ao calcular o volume total diário por lead:", err);
  }
}
visualizarResultados();

module.exports = {
  getAllLeadIds,
  calculoVolumeTotalDiarioPorLead
};
