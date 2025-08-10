const express = require('express');
const { QueueServiceClient, StorageSharedKeyCredential } = require('@azure/storage-queue');
const { v4: uuidv4 } = require('uuid');
const pino = require('pino');

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const app = express();
app.use(express.json());

const account = process.env.AZURE_STORAGE_ACCOUNT || 'devstoreaccount1';
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const queueName = process.env.AZURE_QUEUE_NAME || 'stock-events';
const queueAccountUrl = process.env.AZURE_QUEUE_URL || `http://localhost:10001/${account}`;

async function ensureQueue() {
  const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
  const serviceClient = new QueueServiceClient(queueAccountUrl, sharedKeyCredential);
  const queueClient = serviceClient.getQueueClient(queueName);
  await queueClient.createIfNotExists();
  return queueClient;
}

app.post('/emit', async (req, res) => {
  const { productId, qty } = req.body;
  const correlationId = uuidv4();
  const event = {
    eventType: 'product.below_threshold',
    productId,
    qty,
    timestamp: new Date().toISOString(),
    correlationId
  };

  try {
    const queueClient = await ensureQueue();
    const messageText = Buffer.from(JSON.stringify(event)).toString('base64');
    await queueClient.sendMessage(messageText);
    logger.info({ correlationId, event }, 'Published stock event to queue');
    return res.status(202).json({ status: 'queued', correlationId });
  } catch (err) {
    logger.error({ err }, 'Failed to publish message');
    return res.status(500).json({ error: 'failed to enqueue' });
  }
});

app.get('/', (req, res) => res.send('SmartRetail Backend running'));

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info({ port }, 'Backend listening'));
