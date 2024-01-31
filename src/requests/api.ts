const toUrlSearchParams = (obj: Record<string, string | undefined>): string => {
  if (!obj) return '';

  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) return;
    params.set(key, value);
  });
  return '?' + params.toString();
};

type JSONParseable =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONParseable }
  | Array<JSONParseable>;

const api = {
  get: async (route: string, params: Record<string, string | undefined>) =>
    fetch(`/api/${route}${toUrlSearchParams(params)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json()),

  post: async (route: string, body: JSONParseable) => {
    return fetch(`/api/${route}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(res => res.json());
  },
};

export default api;
