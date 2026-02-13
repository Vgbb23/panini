
export interface PixChargeRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  amount: number; // valor total em centavos
  productId: string;
}

export interface PixChargeResponse {
  success: boolean;
  message?: string;
  data?: Record<string, any>;
  errors?: Record<string, string[]>;
}

/**
 * Cria uma cobrança PIX na Fruitfy.
 * A requisição passa pelo proxy do Vite (/api/fruitfy → api.fruitfy.io)
 * para manter o token seguro no lado do servidor.
 */
export async function createPixCharge(data: PixChargeRequest): Promise<PixChargeResponse> {
  const cleanPhone = data.phone.replace(/\D/g, '');
  const cleanCpf = data.cpf.replace(/\D/g, '');

  const body = {
    name: data.name,
    email: data.email,
    phone: cleanPhone,
    cpf: cleanCpf,
    amount: data.amount,
    items: [
      {
        id: data.productId,
        value: data.amount,
        quantity: 1,
      }
    ]
  };

  console.log('[Fruitfy] Enviando cobrança PIX:', JSON.stringify(body, null, 2));

  const response = await fetch('/api/fruitfy/pix/charge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Accept-Language': 'pt_BR',
    },
    body: JSON.stringify(body),
  });

  const result: PixChargeResponse = await response.json();
  console.log('[Fruitfy] Resposta da API:', JSON.stringify(result, null, 2));

  if (!response.ok && result.success === undefined) {
    return {
      success: false,
      message: `Erro HTTP ${response.status}: ${response.statusText}`,
    };
  }

  return result;
}

/**
 * Extrai o QR Code e o código PIX copia-e-cola da resposta da API Fruitfy.
 * 
 * Estrutura da resposta Fruitfy:
 * data.pix.code → código copia e cola
 * data.pix.qr_code_base64 → QR code em base64 (SVG)
 * data.pix.expires_at → expiração
 * data.order_id → ID do pedido
 */
export function extractPixData(data: Record<string, any>): {
  qrCodeUrl: string | null;
  pixCode: string | null;
  chargeId: string | null;
  expiresAt: string | null;
} {
  const pix = data.pix || {};

  // QR Code - Fruitfy retorna em data.pix.qr_code_base64
  const qrCodeUrl =
    pix.qr_code_base64 ||
    pix.qr_code_url ||
    pix.qr_code_image ||
    pix.qr_code ||
    pix.qrcode ||
    data.qr_code_base64 ||
    data.qr_code_url ||
    data.qr_code ||
    null;

  // Código PIX copia e cola - Fruitfy retorna em data.pix.code
  const pixCode =
    pix.code ||
    pix.pix_code ||
    pix.copy_and_paste ||
    pix.emv ||
    pix.br_code ||
    pix.brcode ||
    pix.payload ||
    data.pix_code ||
    data.code ||
    data.copy_and_paste ||
    data.emv ||
    null;

  // ID do pedido - Fruitfy retorna em data.order_id
  const chargeId =
    data.order_id ||
    data.charge_id ||
    data.transaction_id ||
    data.id ||
    pix.id ||
    null;

  // Expiração - Fruitfy retorna em data.pix.expires_at
  const expiresAt =
    pix.expires_at ||
    pix.expiration ||
    data.expires_at ||
    data.expiration ||
    null;

  console.log('[Fruitfy] Dados extraídos:', { qrCodeUrl: qrCodeUrl ? 'presente' : 'null', pixCode: pixCode ? 'presente' : 'null', chargeId, expiresAt });

  return { qrCodeUrl, pixCode, chargeId, expiresAt };
}
