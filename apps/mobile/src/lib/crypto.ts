import * as expoCrypto from 'expo-crypto';
import * as Device from "expo-device";
import * as SecureStore from "expo-secure-store";

// @ts-ignore
import {cryptoNative} from "vanilla-totp";

const algorithm = "aes-256-cbc";

export async function clearSecret() {
    const modelName: string = Device.modelName ?? "unknown";
    const secureKey = await SecureStore.getItemAsync(Buffer.from(modelName).toString("hex") + Device.brand);
    const ivKey = await SecureStore.getItemAsync(Buffer.from(modelName).toString("hex") + Device.brand + "-iv");
    if (secureKey) {
        await SecureStore.deleteItemAsync(Buffer.from(modelName).toString("hex") + Device.brand);
    }
    if (ivKey) {
        await SecureStore.deleteItemAsync(Buffer.from(modelName).toString("hex") + Device.brand + "-iv");
    }
}

async function getSecret(): Promise<Uint8Array> {
    let asyncKey = Buffer.from(Device.modelName ?? "unkown").toString("hex") + Device.brand;
    let secureKey = await SecureStore.getItemAsync(asyncKey);
    if (secureKey) {
        const secretArray: number[] = Object.values(JSON.parse(secureKey));
        const unit8Key: Uint8Array = new Uint8Array(secretArray);
        return unit8Key;
    } else {
        const newKey = expoCrypto.getRandomBytes(32)
        const strSecret = JSON.stringify(newKey);
        await SecureStore.setItemAsync(asyncKey, strSecret);
        return newKey;
    }
}


async function getIv(): Promise<Uint8Array> {
    const modelName = Device.modelName ?? "unknown";
    let asyncKey = Buffer.from(modelName).toString("hex") + Device.brand + "-iv";
    let secureIv = await SecureStore.getItemAsync(asyncKey);
    if (secureIv) {
        const ivArray: number[] = Object.values(JSON.parse(secureIv))
        const unit8Iv: Uint8Array = new Uint8Array(ivArray);
        return unit8Iv;
    } else {
        const newKey = expoCrypto.getRandomBytes(16)
        const strIv = JSON.stringify(newKey);
        await SecureStore.setItemAsync(asyncKey, strIv);
        return newKey;
    }
}

export async function encrypt(value: string): Promise<string> {
    const secret = await getSecret();
    const iv = await getIv();
    const secretBuffer = Buffer.from(secret);
    let cipher = cryptoNative.createCipheriv(algorithm, secretBuffer, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
    return encrypted;
}

export async function decrypt(value: string): Promise<string> {
    const secret = await getSecret();
    const iv = await getIv();
    const secretBuffer = Buffer.from(secret);
    let decipher = cryptoNative.createDecipheriv(algorithm, secretBuffer, iv);
    let decrypted = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
}