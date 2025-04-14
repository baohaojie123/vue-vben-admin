import * as CryptoJS from 'crypto-js';

const encryption = (params: any) => {
  let { data, type, param, key } = params;
  const result = structuredClone(data);
  if (type === 'Base64') {
    param.forEach((ele: any) => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach((ele: any) => {
      const data2 = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      const iv = key;
      // 加密
      const encrypted = CryptoJS.AES.encrypt(data2, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding,
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};
/**
 *密码加密处理
 */
const encryptionPassword = (data: any) => {
  // console.log(data, 'data')
  const user = encryption({
    data,
    key: 'carelinkercareli',
    param: ['password'],
  });
  return user;
};
export { encryptionPassword };
