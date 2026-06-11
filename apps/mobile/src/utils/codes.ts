import AsyncStorage from '@react-native-async-storage/async-storage'
import { encrypt } from './crypto'
import * as Device from 'expo-device'
import { type TotpData } from './url'

export type CodeList = {
    installDate: number,
    codes: Record<string, TotpData>
}

export async function addCode(data: TotpData[]): Promise<void> {
    const modelName: string = Device.modelName ?? "unknown";
    const res = await AsyncStorage.getItem(Buffer.from(modelName).toString("hex"));
    if (res === null || res === "") {
        throw "AddCode Error: key not set"
    }
    let codes: CodeList = JSON.parse(res)
    data.forEach((codeData: TotpData) => {
        encrypt(codeData.secret).then((key) => {
            codes.codes[codeData.account] = { ...codeData, secret: key };
            AsyncStorage.setItem(Buffer.from(modelName).toString("hex"), JSON.stringify(codes)).then(() => {
                console.log(`Added account: ${codeData.account}`)
            }).catch((err) => {
                console.log(err)
            })
        })
    })
}

export async function getCodes(): Promise<CodeList> {
    const modelName: string = Device.modelName ?? "unknown";
    const timeStamp: number = new Date().getTime()
    const newList: CodeList = { installDate: timeStamp, codes: {} }
    console.log("Setting storage item buffer");
    const storageItem = Buffer.from(modelName).toString("hex");
    console.log(`Set storage item buffer: ${storageItem}`);
    let val = await AsyncStorage.getItem(storageItem);
    console.log("Tried getting storage item from asyncstorage");
    if (!val) {
        val = JSON.stringify(newList);
        await AsyncStorage.setItem(Buffer.from(modelName).toString("hex"), val).catch((err) => {
            console.log(`set error: ${err}`)
        })
    }
    return JSON.parse(val)
}

export async function updateCode(name: string, data: TotpData): Promise<void> {
    const modelName: string = Device.modelName ?? "unknown";
    const allCodes = await getCodes();
    allCodes.codes[name] = { ...data };
    await AsyncStorage.setItem(Buffer.from(modelName).toString("hex"), JSON.stringify(allCodes))
}