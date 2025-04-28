const axios = require('axios');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const data = req.body;

    console.log('Pagamento recebido da Pushinpay:', data);

    if (data.status === 'confirmed') {
        const valor = data.amount || 0;
        const pedido = data.metadata?.pedido || 'padrao';

        const codigoUtmfy = `facebook_${pedido}`;
        const utmfyUrl = `https://utmfy.com/conversion?event=purchase&code=${codigoUtmfy}&value=${valor}`;

        try {
            await axios.get(utmfyUrl);
            console.log('✅ Conversão enviada para UTMFY!');
        } catch (error) {
            console.error('❌ Erro ao enviar conversão para UTMFY:', error.message);
        }
    }

    res.status(200).json({ message: 'OK' });
}