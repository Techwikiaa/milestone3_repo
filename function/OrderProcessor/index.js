const fetch = require('node-fetch');
const pino = require('pino');
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

module.exports = async function (context, msg) {
  try {
    const raw = Buffer.from(msg, 'base64').toString('utf8');
    const event = JSON.parse(raw);
    const correlationId = event.correlationId || 'no-correlation';
    logger.info({ correlationId, event }, 'Function received queue message');

    const supplierUrl = process.env.SUPPLIER_API_URL || 'http://supplier-api:4000/order';
    const orderPayload = {
      productId: event.productId,
      qty: event.qty,
      correlationId
    };

    const resp = await fetch(supplierUrl, {
      method: 'POST',
      body: JSON.stringify(orderPayload),
      headers: { 'Content-Type': 'application/json', 'x-correlation-id': correlationId }
    });

    const json = await resp.json();
    logger.info({ correlationId, supplierResponse: json }, 'Function posted to supplier API');

  } catch (err) {
    logger.error({ err }, 'Function failed to process message');
    throw err;
  }
};
