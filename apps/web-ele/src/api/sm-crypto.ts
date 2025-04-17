import { sm2, sm4 } from 'sm-crypto';
// SM4 加密
export const sm4Encrypt = (text: any) => {
  const key = constgenerateKey();

  let cipherText = '';
  try {
    // 进行 SM4 加密
    cipherText = sm4.encrypt(text, key, {
      padding: 'pkcs#7',
      mode: 'cbc',
      iv: hexToArray(key),
    });
  } catch (error) {
    console.error('加密过程中出现错误:', error);
  }
  const list = {
    cipherText: hexToBase64(cipherText),
    key: sm2Encryption(key),
    originalKey: key,
    cipherText1: cipherText,
  };

  return list;
};
// 随机生成 16 字节（128 位）的十六进制密钥
export const constgenerateKey = () => {
  const hexChars = '0123456789abcdef';
  let key = '';
  for (let i = 0; i < 32; i++) {
    key += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
  }

  return key;
};
export const hexToArray = (hex: any) => {
  // 检查十六进制字符串长度是否为偶数
  if (hex.length % 2 !== 0) {
    throw new Error('输入的十六进制字符串长度必须为偶数');
  }
  // 创建一个ArrayBuffer，长度为十六进制字符串长度的一半
  const buffer = new ArrayBuffer(hex.length / 2);
  // 创建一个Uint8Array视图，用于操作ArrayBuffer
  const uint8Array = new Uint8Array(buffer);

  for (let i = 0; i < hex.length; i += 2) {
    // 将每两个十六进制字符转换为一个字节
    uint8Array[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }

  return uint8Array;
};
// 16进制转base64
export const hexToBase64 = (hex: any) => {
  // 把十六进制字符串转换为二进制数据
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  // 将二进制数据编码为 Base64 字符串
  const base64 = btoa(Reflect.apply(String.fromCharCode, null, [...bytes]));

  return base64;
};
/**
 *SM2加密处理
 */
export const sm2Encryption = (value: any) => {
  const key =
    'BLbjZ8dTvPQQySbdLgIzAIrIvoChO0vnakF9ySvE3CVU0LyF5//ozr4y+oC28ksER/6tz/FJBy5yk5L8jnuSuAM=';
  const publicKey = base64ToHex(key);
  const ciphertext = sm2.doEncrypt(value, publicKey, 1);
  return hexToBase64(`04${ciphertext}`);
};
// base64转16进制
export const base64ToHex = (base64: string): string => {
  try {
    // 确保输入是有效的 base64 字符串
    if (!/^[A-Z0-9+/=]+$/i.test(base64)) {
      throw new Error('Invalid base64 string');
    }

    // 解码 Base64 字符串为二进制数据
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.codePointAt(i) || 0;
    }

    // 将二进制数据转换为十六进制字符串
    let hex = '';
    for (const byte of bytes) {
      hex += byte.toString(16).padStart(2, '0');
    }
    return hex;
  } catch (error) {
    console.error('Base64 to hex conversion failed:', error);
    return '';
  }
};
