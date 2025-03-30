import crypto from 'crypto';

function aesDecrypt(data: Buffer, key: Buffer, iv: Buffer): Buffer {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(data);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted;
}

function rotaenoDecrypt(data: Buffer, key: Buffer): Buffer {
    const iv = Buffer.from(data.subarray(0, 16));
    const source = Buffer.from(data.subarray(16));
    return aesDecrypt(source, key, iv);
}


/**
 * decryptFromRequest：
 * @param objectID Player's Object ID
 * @param saveDataBase64 Encrypted save data in local storage Base64
 * @returns Decrypted Buffer
 * @throws Failed Error
 */
export function decryptFromRequest(objectID: string, saveDataBase64: string): Buffer {

    // Decode Base64
    const encryptedData = Buffer.from(saveDataBase64, 'base64');
    if (!encryptedData.length) {
        throw new Error('Base64 decode failed or empty data.');
    }

    // Key
    const keyString = objectID + 'areyoureadyiamlady';
    const key = crypto.createHash('sha256').update(keyString).digest(); // 256-bit

    return rotaenoDecrypt(encryptedData, key);
}
