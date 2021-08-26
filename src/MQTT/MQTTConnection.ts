import EventEmitter from 'events';
import { MqttClient } from 'mqtt';
import { logInfo } from '../logger';
import { IMQTTConnection } from './IMQTTConnection';

export class MQTTConnection extends EventEmitter implements IMQTTConnection {
  constructor(private client: MqttClient) {
    super();

    client.on('connect', () => {
      logInfo('[MQTT] Connected');
      this.emit('connect');
    });

    client.on('reconnect', () => {
      logInfo('[MQTT] Reconnecting...');
    });

    client.on('disconnect', client.removeAllListeners);

    client.on('error', (error) => {
      console.log(error);
    });

    client.on('message', (topic, message) => {
      logInfo('[MQTT] Message:', { topic, message: message.toString() });
      this.emit(topic, message.toString());
    });
  }

  publish(topic: string, message: any): void {
    if (message instanceof Object) {
      message = JSON.stringify(message);
    }
    logInfo('[MQTT] Publish:', { topic, message });
    this.client.publish(topic, message, { qos: 1 });
  }

  subscribe(topic: string): void {
    this.client.subscribe(topic);
  }

  unsubscribe(topic: string): void {
    this.client.unsubscribe(topic);
  }
}
