// server.js
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

// Rota que a Pushinpay vai chamar
app.post('/webhook-pushinpay', async (req, res) => {
    const data = req.body;

    console.log('Pagamento recebido da Pushinpay:', data);

    if (data.status === 'confirmed') {
        const valor = data.amount || 0;
        const pedido = data.metadata?.pedido || 'padrao'; // Você pode ajustar isso depois se quiser

        const codigoUtmfy = `facebook_${pedido}`;

        const utmfyUrl = `https://utmfy.com/conversion?event=purchase&code=${codigoUtmfy}&value=${valor}`;

        try {
            await axios.get(utmfyUrl);
            console.log('✅ Conversão enviada para UTMFY com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao enviar conversão para UTMFY:', error.message);
        }
    }

    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Webhook rodando na porta ${PORT}`));
