// variables
const loc = `utils/sockets-util`;
let WSClient: WebSocket;

export function getWSClient(): Promise<WebSocket | null> {
  return new Promise(async (resolve, reject) => {
    try {
      if (WSClient && !WSClient.CLOSED && !WSClient.CLOSING) resolve(WSClient);

      WSClient = new WebSocket(import.meta.env.VITE_WS_URL);

      WSClient.onopen = () => {
        console.log(`[SOCKET.IO CLIENT] - connected.`);
        resolve(WSClient);
      };

      WSClient.onerror = (error) => {
        console.error(`[SOCKET.IO CLIENT] - Connection error: ${error}`);
        reject(null);
      };
    } catch (err) {
      console.error(`Unhandled error at ${loc}.getWSClient function. Details: ${err}`);
      reject(null);
    }
  });
}
