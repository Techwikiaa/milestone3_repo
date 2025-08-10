const express = require('express');
const pino = require('pino');
const app = express();
app.use(express.json());
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.post('/order', (req, res) => {
  const correlationId = req.headers['x-correlation-id'] || req.body.correlationId || 'no-correlation';
  logger.info({ correlationId, body: req.body }, 'Supplier received order');

  const response = {
    status: 'confirmed',
    ref: `SUP-${Math.floor(Math.random()*90000)+10000}`,
    correlationId
  };

  logger.info({ correlationId, response }, 'Supplier processed order');
  res.json(response);
});

app.get('/', (req, res) => res.send('Supplier API running'));
const port = process.env.PORT || 4000;
app.listen(port, () => logger.info({ port }, 'Supplier API listening'));
