const app = require('./app');

const PORT = process.env.PORT || 8000;

if (process.env.DB_SCHEMA) {
    app.listen(PORT, (err) => {
        if (err) {
            console.log(`ERRO ao iniciar o servidor: ${err}`);
        } else {
            console.log('Servidor de produção no ar');
        }
    });
} else {
    app.listen(PORT, (err) => {
        if (err) {
            console.log(`Erro ao iniciar o servidor ${err}`);
        } else {
            console.log(`🔥 Server is running on: http://localhost:${PORT}`) //servidor teste no ar
        }
    })
}
