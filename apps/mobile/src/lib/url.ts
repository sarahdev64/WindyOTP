export type TotpAlgorithm = "sha1" | "sha256" | "sha512" | "md5"
export type TotpDigits = 6 | 8
export type TotpPeriod = 15 | 30 | 60

export type TotpData = {
    account: string,
    secret: string,
    digits: TotpDigits,
    algorithm: TotpAlgorithm
    period: TotpPeriod
}

export type TotpUrl = string

export function validTotpUrl(url: string): TotpUrl | null {
    const rx = /(apple-|)otpauth:\/\/totp\/(?:[a-zA-Z0-9%]+:)?([^\?]+)\?secret=([0-9A-Za-z]+)/g;
    const success = rx.test(url);
    return success ? url as TotpUrl : null
}

type ParserFunction = (val: string) => boolean
type ConverterFunction<T> = (val: string) => T
function urlOrDefault<T>(url: URL, param: string, parser: ParserFunction, converter: ConverterFunction<T>, defaultValue: T): T {
    if (!url.searchParams.has(param)) {
        return defaultValue;
    }
    if (parser(url.searchParams.get(param)!)) {
        return converter(url.searchParams.get(param)!)
    }
    return defaultValue;
}

export function parseTotpUrl(totpUrl: TotpUrl | null): TotpData | null {
    if (!totpUrl) {
        return null
    }
    const url = new URL(totpUrl);
    const secretValue = url.searchParams.get("secret")
    if (!secretValue) {
        return null
    }

    const codeDigits = urlOrDefault<TotpDigits>(url, "digits", (val: string) => {
        return ["6", "8"].includes(val)
    }, (val: string) => {
        return parseInt(val)! as TotpDigits
    }, 6);

    const codeInterval = urlOrDefault<TotpPeriod>(url, "period", (val: string) => {
        return ["15", "30", "60"].includes(val)
    }, (val: string) => {
        return parseInt(val)! as TotpPeriod
    }, 30)

    const codeAlgorithm = urlOrDefault<TotpAlgorithm>(url, "algorithm", (val: string) => {
        const newVal = val.toLowerCase().replace("hmac", "")
        return ["sha1", "sha256", "sha512", "md5"].includes(newVal)
    }, (val: string) => {
        const newVal = val.toLowerCase().replace("hmac", "")
        return newVal as TotpAlgorithm
    }, "sha1")

    const result: TotpData = {
        secret: secretValue,
        account: url.pathname.substring(1, url.pathname.length),
        digits: codeDigits,
        period: codeInterval,
        algorithm: codeAlgorithm
    }
    return result
}