import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    console.log('Received:', message);
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

export { wss };