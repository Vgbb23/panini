
export interface BoltCustomer {
  name: string;
  email: string;
  phone: string;
  document: string; // CPF
}

export interface BoltShipping {
  street: string;
  streetNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export interface BoltItem {
  title: string;
  unitPrice: number; // centavos
  quantity: number;
  externalRef?: string;
}

export interface BoltPixRequest {
  customer: BoltCustomer;
  shipping?: BoltShipping;
  paymentMethod: 'PIX';
  items: BoltItem[];
  amount: number; // centavos
  description?: string;
}

export interface BoltPixResponse {
  id?: string;
  status?: string;
  amount?: number;
  pix?: {
    qrcode?: string;
    expirationDate?: string;
  };
  customer?: Record<string, any>;
  error?: string;
  message?: string;
  [key: string]: any;
}

/**
 * Cria uma cobrança PIX na BoltPagamentos.
 * A requisição passa pelo proxy (/api/bolt → api.sistema.boltpagamentos.com)
 * para manter as credenciais seguras no servidor.
 */
export async function createBoltPixCharge(data: BoltPixRequest): Promise<BoltPixResponse> {
  const body = {
    customer: {
      name: data.customer.name,
      email: data.customer.email,
      phone: data.customer.phone.replace(/\D/g, ''),
      document: data.customer.document.replace(/\D/g, ''),
    },
    shipping: data.shipping || undefined,
    paymentMethod: 'PIX',
    items: data.items,
    amount: data.amount,
    description: data.description || 'Compra Panini Copa do Mundo 2026',
  };

  console.log('[Bolt] Enviando cobrança PIX:', JSON.stringify(body, null, 2));

  const response = await fetch('/api/bolt/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const result: BoltPixResponse = await response.json();
  console.log('[Bolt] Resposta da API:', JSON.stringify(result, null, 2));

  if (!response.ok && !result.id) {
    return {
      error: result.error || result.message || `Erro HTTP ${response.status}`,
    };
  }

  return result;
}

/**
 * Extrai o QR Code e código PIX da resposta da BoltPagamentos.
 * 
 * Estrutura Bolt:
 * - pix.qrcode → URL ou BRCode do PIX
 * - pix.expirationDate → data de expiração
 * - id → ID da transação
 */
export function extractBoltPixData(data: BoltPixResponse): {
  qrCodeUrl: string | null;
  pixCode: string | null;
  chargeId: string | null;
  expiresAt: string | null;
} {
  const pix = data.pix || {};

  // O campo qrcode pode ser uma URL ou o código BRCode do PIX
  const qrcode = pix.qrcode || null;

  // Se começa com http, é uma URL de imagem; o código PIX pode ser o mesmo
  let qrCodeUrl: string | null = null;
  let pixCode: string | null = null;

  if (qrcode) {
    if (qrcode.startsWith('http')) {
      // É uma URL - usar como QR code image e também como código para copiar
      qrCodeUrl = qrcode;
      pixCode = qrcode;
    } else {
      // É um BRCode/EMV - usar como código copia e cola, gerar QR a partir dele
      pixCode = qrcode;
      qrCodeUrl = null; // será gerado via qrserver no frontend
    }
  }

  const chargeId = data.id || null;
  const expiresAt = pix.expirationDate || null;

  console.log('[Bolt] Dados extraídos:', {
    qrCodeUrl: qrCodeUrl ? 'presente' : 'null',
    pixCode: pixCode ? `${pixCode.substring(0, 30)}...` : 'null',
    chargeId,
    expiresAt,
  });

  return { qrCodeUrl, pixCode, chargeId, expiresAt };
}
