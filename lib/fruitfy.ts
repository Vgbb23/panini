
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
 * Extrai o QR Code e o código PIX copia-e-cola da resposta da API.
 * Tenta múltiplos nomes de campo comuns em APIs de pagamento.
 */
export function extractPixData(data: Record<string, any>): {
  qrCodeUrl: string | null;
  pixCode: string | null;
  chargeId: string | null;
  expiresAt: string | null;
} {
  // Buscar em campos aninhados comuns
  const nested = data.pix || data.charge || data.payment || data.order || data;

  // QR Code URL/Image
  const qrCodeUrl =
    data.qr_code_url ||
    data.qr_code_image ||
    data.qrcode_url ||
    data.qrCodeUrl ||
    nested.qr_code_url ||
    nested.qr_code_image ||
    nested.qrcode_url ||
    nested.qrCodeUrl ||
    // Base64 ou URL direta do QR
    data.qr_code ||
    data.qrcode ||
    nested.qr_code ||
    nested.qrcode ||
    null;

  // Código PIX copia e cola
  const pixCode =
    data.pix_code ||
    data.copy_and_paste ||
    data.copy_paste ||
    data.copyPaste ||
    data.emv ||
    data.br_code ||
    data.brcode ||
    data.payload ||
    data.pix_copy_paste ||
    data.pixCode ||
    nested.pix_code ||
    nested.copy_and_paste ||
    nested.copy_paste ||
    nested.emv ||
    nested.br_code ||
    nested.brcode ||
    nested.payload ||
    nested.pix_copy_paste ||
    null;

  // Charge/Transaction ID
  const chargeId =
    data.charge_id ||
    data.transaction_id ||
    data.id ||
    data.order_id ||
    nested.charge_id ||
    nested.transaction_id ||
    nested.id ||
    null;

  // Expiração
  const expiresAt =
    data.expires_at ||
    data.expiration ||
    data.due_date ||
    nested.expires_at ||
    nested.expiration ||
    null;

  return { qrCodeUrl, pixCode, chargeId, expiresAt };
}
