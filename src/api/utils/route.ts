import { Response } from 'api/types';
import { toJson } from './helpers';
import { Handler, HandlerEvent } from '@netlify/functions';

type Method = 'GET' | 'POST';
type GetResponse<T> = (data: T) => Promise<Response>;

const handleMethod = (method: Method, callback: (data: HandlerEvent) => Promise<Response>) => {
  const handler: Handler = async event => {
    if (event.httpMethod !== method) {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
      const result = await callback(event);

      return {
        statusCode: 200,
        body: toJson(result),
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      };
    } catch (error) {
      return { statusCode: 500, body: (error as Error).toString() };
    }
  };

  return handler;
};

const route: {
  post: <T>(callback: GetResponse<T>) => Handler;
  get: <T>(callback: GetResponse<T>) => Handler;
} = {
  post: callback => handleMethod('POST', event => callback(JSON.parse(event.body || ''))),

  get: <T>(callback: GetResponse<T>) =>
    handleMethod('GET', event => callback(event.queryStringParameters as T)),
};

export default route;
