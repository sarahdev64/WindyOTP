// @ts-ignore
import { getTotp as totp, cryptoNative } from "vanilla-totp";
import { type TotpData } from "./url";

export function getTotp(data: TotpData, secretKey: string, timestamp = Date.now()) {
    return totp(secretKey, timestamp, data.algorithm, data.digits, data.period, cryptoNative)
}