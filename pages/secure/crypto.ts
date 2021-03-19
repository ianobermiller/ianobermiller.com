import {decode, encode} from './base64';

// https://gist.github.com/andreburgaud/6f73fd2d690b629346b8

const algoEncrypt = {
  name: 'AES-GCM',
  iv: new Uint8Array(12),
  tagLength: 128,
};

function stringToArrayBuffer(str: string): ArrayBuffer {
  var buf = new ArrayBuffer(str.length * 2);
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function arrayBufferToString(buf: ArrayBuffer): string {
  return String.fromCharCode(...new Uint16Array(buf));
}

export async function encrypt(
  plainText: string,
): Promise<{key: string; cipherText: string}> {
  const key = await window.crypto.subtle.generateKey(
    {name: 'AES-GCM', length: 128},
    true,
    ['encrypt', 'decrypt'],
  );
  const exported = await window.crypto.subtle.exportKey('raw', key);
  const exportedKeyBuffer = new Uint8Array(exported);

  const cipherText = await window.crypto.subtle.encrypt(
    algoEncrypt,
    key,
    stringToArrayBuffer(plainText),
  );

  return {key: encode(exportedKeyBuffer), cipherText: encode(cipherText)};
}

export async function decrypt({
  key,
  cipherText,
}: {
  key: string;
  cipherText: string;
}): Promise<string> {
  const decodedKey = decode(key);
  const decodedCipherText = decode(cipherText);

  const importedKey = await window.crypto.subtle.importKey(
    'raw',
    decodedKey,
    'AES-GCM',
    false,
    ['decrypt'],
  );

  const decrypted = await window.crypto.subtle.decrypt(
    algoEncrypt,
    importedKey,
    decodedCipherText,
  );

  return arrayBufferToString(decrypted);
}
