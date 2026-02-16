import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const BOLT_SECRET_KEY = process.env.BOLT_SECRET_KEY;
  const BOLT_COMPANY_ID = process.env.BOLT_COMPANY_ID;

  if (!BOLT_SECRET_KEY || !BOLT_COMPANY_ID) {
    console.error('[Bolt Proxy] Variáveis de ambiente não configuradas');
    return res.status(500).json({
      error: 'Configuração do servidor de pagamento incompleta.',
    });
  }

  const credentials = Buffer.from(`${BOLT_SECRET_KEY}:${BOLT_COMPANY_ID}`).toString('base64');

  try {
    const response = await fetch('https://api.sistema.boltpagamentos.com/functions/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    console.log('[Bolt Proxy] Status:', response.status, 'Response:', JSON.stringify(data));

    return res.status(response.status).json(data);
  } catch (error) {
    console.error('[Bolt Proxy] Erro:', error);
    return res.status(500).json({
      error: 'Erro ao conectar com o servidor de pagamento.',
    });
  }
}
