const DEFAULT_SENDER_NUMBER = '5511940346224';
const DEFAULT_RECIPIENT_NUMBER = '5511994958977';

function digits(value) {
  return String(value || '').replace(/\D/g, '');
}

function config() {
  return {
    token: String(process.env.WHATSAPP_CLOUD_TOKEN || '').trim(),
    phoneNumberId: String(process.env.WHATSAPP_CLOUD_PHONE_NUMBER_ID || '').trim(),
    graphVersion: String(process.env.WHATSAPP_GRAPH_API_VERSION || 'v23.0').trim(),
    senderNumber: digits(process.env.WHATSAPP_SENDER_NUMBER || DEFAULT_SENDER_NUMBER),
    recipientNumber: digits(process.env.WHATSAPP_ADMIN_NUMBER || DEFAULT_RECIPIENT_NUMBER)
  };
}

function safeText(value, fallback = 'Não informado') {
  const clean = String(value || '').replace(/[\r\n\t]+/g, ' ').trim();
  return clean || fallback;
}

function orderMessage(order, orderId) {
  const requestedDate = order.data_desejada ? String(order.data_desejada).split('-').reverse().join('/') : 'A combinar';
  const location = [safeText(order.cidade, ''), safeText(order.bairro, '')].filter(Boolean).join(' · ') || 'Não informado';
  return [
    `Novo pedido #${orderId} recebido.`,
    `Cliente: ${safeText(order.nome)}`,
    `WhatsApp: ${safeText(order.whatsapp)}`,
    `E-mail: ${safeText(order.email)}`,
    `Presente: ${safeText(order.cesta)}`,
    `Ocasião: ${safeText(order.ocasiao, 'A combinar')}`,
    `Mensagem: ${safeText(order.mensagem)}`,
    `Entrega: ${location}`,
    `Data desejada: ${requestedDate}`
  ].join('\n').slice(0, 4096);
}

// O envio é opcional: o pedido nunca depende da API do WhatsApp para ser salvo.
async function notifyAdminViaWhatsApp(order, orderId) {
  const settings = config();
  if (!settings.token || !settings.phoneNumberId || !settings.recipientNumber) {
    return { skipped: true, reason: 'not_configured' };
  }

  const response = await fetch(
    `https://graph.facebook.com/${encodeURIComponent(settings.graphVersion)}/${encodeURIComponent(settings.phoneNumberId)}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${settings.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: settings.recipientNumber,
        type: 'text',
        text: { preview_url: false, body: orderMessage(order, orderId) }
      })
    }
  );

  if (!response.ok) {
    const error = new Error(`WhatsApp Cloud API respondeu ${response.status}.`);
    error.code = `WHATSAPP_${response.status}`;
    throw error;
  }

  return { skipped: false, sender: settings.senderNumber, recipient: settings.recipientNumber };
}

module.exports = { notifyAdminViaWhatsApp, DEFAULT_SENDER_NUMBER, DEFAULT_RECIPIENT_NUMBER };
