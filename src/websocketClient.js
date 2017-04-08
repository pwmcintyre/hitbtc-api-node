import WebSocket from 'ws';
import crypto from 'crypto';

export default class HitBTCWebsocketClient {
  constructor({ key, secret, isDemo = false }) {
    this.key = key;
    this.secret = secret;
    this.baseUrl = `${isDemo ? `demo-api` : `api`}.hitbtc.com`;
    this.marketUrl = `ws://${this.baseUrl}:80`;
    this.tradingUrl = `wss://${this.baseUrl}:8080`;
    this.hasCredentials = key && secret;

    this.marketSocket = new WebSocket(this.marketUrl);

    if (this.hasCredentials) {
      this.tradingSocket = new WebSocket(this.tradingUrl);
      this.tradingSocket.addEventListener(`open`, () =>
        this.tradingSocket.send(
          this.createRequestData({ Login: {} }),
        ),
      );
    }
  }

  createRequestData = payload => {
    const message = {
      nonce: Date.now(),
      payload,
    };

    const signature = crypto
      .createHmac(`sha512`, this.secret)
      .update(JSON.stringify(message))
      .digest(`base64`);

    message
      .payload;

    return JSON.stringify({
      apikey: this.key,
      signature,
      message,
    });
  };

  addMarketMessageListener = listener =>
    this.marketSocket.addEventListener(`message`, listener);

  addTradingMessageListener = listener =>
    this.tradingSocket.addEventListener(`message`, listener);

  removeMarketMessageListener = listener =>
    this.marketSocket.removeEventListener(`message`, listener);

  removeTradingMessageListener = listener =>
    this.tradingSocket.removeEventListener(`message`, listener);

  addMarketListener = (event, listener) =>
    this.marketSocket.addEventListener(event, listener);

  addTradingListener = (event, listener) =>
    this.tradingSocket.addEventListener(event, listener);

  removeMarketListener = (event, listener) =>
    this.marketSocket.removeEventListener(event, listener);

  removeTradingListener = (event, listener) =>
    this.tradingSocket.removeEventListener(event, listener);

}
