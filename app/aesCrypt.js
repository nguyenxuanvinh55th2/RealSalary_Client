var CryptoJS = require("crypto-js");

export const encrypted = (input) => {
  let encrypted = CryptoJS.AES.encrypt(input, 'abc!@#$%');
  let encryptedString = encrypted.toString();
  while(encryptedString.indexOf('/') > 0){
    encryptedString = encryptedString.replace('/', '_');
  }
  return encryptedString
}

export const decrypted = (input) => {
  while(input.indexOf('_') > 0){
    input = input.replace('_', '/');
  };
  let bytes  = CryptoJS.AES.decrypt(input, 'abc!@#$%');
  let decryptedString = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedString;
}
