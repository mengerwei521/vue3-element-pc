// 加解密
import CryptoJS from 'crypto-js'
import envConfig from '@/env-config'
//des加密
export function encrypt(next) {
  let key = envConfig.enc_dec.key;     //秘钥必须为：8/16/32位
  let iv = envConfig.enc_dec.iv;
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  let ivHex = CryptoJS.enc.Utf8.parse(iv);
  let encrypted = CryptoJS.DES.encrypt(next, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }
  );
  return encodeURIComponent(encrypted.toString());
}

//des解密
export function decrypt(next) {
  let key = envConfig.enc_dec.key;     //秘钥必须为：8/16/32位
  let iv = envConfig.enc_dec.iv;
  let keyHex = CryptoJS.enc.Utf8.parse(key);
  let ivHex = CryptoJS.enc.Utf8.parse(iv);
  let decrypted = CryptoJS.DES.decrypt(next, keyHex, {
    iv: ivHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }
  );
  return CryptoJS.enc.Utf8.stringify(decrypted)
}
