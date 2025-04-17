import { sm4Encrypt } from './sm-crypto';

interface Config {
  url?: string;
  params?: Record<string, any>;
  data?: Record<string, any>;
  baseUrl?: string;
  headers: Record<string, any>;
}

interface Params {
  cipherText: string;
  key: string;
  originalKey: string;
  cipherText1: string;
}
const whiteList = new Set(['/cl-auth-server/custom/token']);
export const getEncryptData = (config: Config): void => {
  if (whiteList.has(config.url || '')) return;
  let params: null | Params = null;

  if (!config.url) return;

  if (config.url.includes('?')) {
    params = setLinkParameters(config);
  } else {
    if (config.params) {
      params = setLinkParameters(config);
      config.data = {};
    } else if (config.data) {
      const data = {
        ...config.data,
        timestamp: Date.now(),
      };
      params = sm4Encrypt(JSON.stringify(data));
      config.data = {
        encryptData: params.cipherText,
      };
    }
  }

  setClHeaders(config, params);
};

const setLinkParameters = (config: Config): null | Params => {
  if (!config.url) return null;

  let data: { [key: string]: number | string; timestamp: number } = {
    timestamp: Date.now(),
  };
  if (config.data) {
    data = {
      ...config.data,
      ...data,
    };
  }
  if (config.params) {
    data = {
      ...config.params,
      ...data,
    };
  }
  if (config.url.includes('?')) {
    const urlQuery = config.url.split('?')[1] || '';
    const keyValuePairs = urlQuery.split('&');
    keyValuePairs.forEach((pair: string) => {
      const [key, value] = pair.split('=');
      if (key && value) {
        data[key] = value;
      }
    });
  }
  const query = Object.keys(data)
    .map((key) => `${key}=${data[key]}`)
    .join('&');

  const params = sm4Encrypt(query);
  config.params = {
    encryptData: params.cipherText,
  };
  if (config.data) {
    config.data = {
      encryptData: params.cipherText,
    };
  }

  config.url = config.url.split('?')[0];
  return params;
};

const setClHeaders = (config: Config, params: null | Params): void => {
  if (!params) return;
  const clHead = {
    version: '1.0.0',
    origin: 'Web',
    encryptKey: params.key,
    host: typeof config.baseUrl === 'string' ? config.baseUrl : '',
  };
  config.headers['Cl-Head'] = btoa(JSON.stringify(clHead));
};
