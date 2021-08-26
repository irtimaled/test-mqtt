import mqtt from 'mqtt';
import { MQTTConnection } from './MQTTConnection';
import { IMQTTConnection } from './IMQTTConnection';
import { logInfo, logError } from '../logger';

export const connectToMQTT = (): Promise<IMQTTConnection> => {
  logInfo('[MQTT] Connecting...');
  const client = mqtt.connect({
    host: process.env.MQTTHOST,
    port: process.env.MQTTPORT,
    user: process.env.MQTTUSER,
    password: process.env.MQTTPASSWORD,
  });

  return new Promise((resolve, reject) => {
    client.once('connect', () => {
      logInfo('[MQTT] Connected');
      resolve(new MQTTConnection(client));
    });
    client.once('error', (error) => {
      logError('[MQTT] Connection Error', error);
      reject(error);
    });
  });
};
