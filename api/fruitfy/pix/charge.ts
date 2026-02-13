import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  const FRUITFY_API_TOKEN = process.env.FRUITFY_API_TOKEN;
  const FRUITFY_STORE_ID = process.env.FRUITFY_STORE_ID;

  if (!FRUITFY_API_TOKEN || !FRUITFY_STORE_ID) {
    console.error('[Fruitfy Proxy] Variáveis de ambiente não configuradas');
    return res.status(500).json({
      success: false,
      message: 'Configuração do servidor de pagamento incompleta.',
    });
  }

  try {
    const response = await fetch('https://api.fruitfy.io/api/pix/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': 'pt_BR',
        'Authorization': `Bearer ${FRUITFY_API_TOKEN}`,
        'Store-Id': FRUITFY_STORE_ID,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('[Fruitfy Proxy] Status:', response.status, 'Response:', JSON.stringify(data));

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Fruitfy Proxy] Erro:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao conectar com o servidor de pagamento.',
    });
  }
}
