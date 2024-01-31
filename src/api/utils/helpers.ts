import { Response } from 'api/types';

const mapObject = <T, R>(object: { [key: string | number]: T }, callback: (v: T) => R) =>
  Object.fromEntries(Object.entries(object).map(([k, v]) => [k, callback(v)]));

const serialize = (response: Response): Response => {
  if (typeof response === 'bigint') {
    return response.toString();
  }

  if (Array.isArray(response)) {
    return response.map(v => serialize(v));
  }

  if (typeof response === 'object') {
    return mapObject(response as { [key: string]: Response }, (v: Response) => serialize(v));
  }

  return response;
};

export const toJson = (response: Response) => JSON.stringify(serialize(response));
