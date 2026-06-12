import * as protobuf from 'protobufjs';
import { TotpDigits, type TotpData, TotpAlgorithm } from './url';
import { authBuffer } from '../data/proto';

export type SupportedAlgorithms = "ALGORITHM_UNSPECIFIED" | "ALGORITHM_SHA1" |
  "ALGORITHM_SHA256" | "ALGORITHM_SHA512" | "ALGORITHM_MD5";

export type GoogleCode = {
  secret: string,
  name: string,
  issuer: string,
  algorithm: SupportedAlgorithms,
  digits: "DIGIT_COUNT_UNSPECIFIED" | "DIGIT_COUNT_SIX" | "DIGIT_COUNT_EIGHT",
  type: "OTP_TYPE_UNSPECIFIED" | "OTP_TYPE_HOTP" | "OTP_TYPE_TOTP",
  counter: string
}

export type GoogleExports = {
  otpParameters: GoogleCode[],
  version: number,
  batchSize: number,
  batchIndex: number,
  batchId: number
}

export function isMigration(url: string) {
  const rx = /otpauth-migration:\/\/offline\?data=.*/g;
  return rx.test(url);
}

function isBase32(val: string): Boolean {
  const b32 = /^[A-Z2-7]+=*$/;
  return b32.test(val);
}

function base64ToBase32(base64: string) {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  const bytes = Buffer.from(base64, 'base64');
  let binaryString = '';

  for (let i = 0; i < bytes.length; i++) {
    binaryString += bytes[i].toString(2).padStart(8, '0');
  }

  let base32String = '';

  for (let i = 0; i < binaryString.length; i += 5) {
    const chunk = binaryString.substring(i, i + 5).padEnd(5, "0");
    const index = parseInt(chunk, 2);
    base32String += base32Chars[index];
  }

  return base32String;
}

export async function decodeMigration(url: string): Promise<GoogleExports> {
  try {
    // Extract the Base64-encoded data from the URL
    const base64Data = url.split('data=')[1];

    // Decode Base64-encoded string using Buffer
    const decodedData = Buffer.from(base64Data, 'base64');

    // Convert the decoded Buffer to Uint8Array
    const dataArray = new Uint8Array(decodedData);

    // Load the protobuf definition
    const getRoot = await protobuf.parse(authBuffer);
    const root = getRoot.root;

    // Resolve the GoogleAuthenticatorImport message type
    const GoogleAuthenticatorImport = root.lookupType('WindyOTP.GoogleAuthenticatorImport');

    // Decode the message
    const decodedMessage = GoogleAuthenticatorImport.decode(dataArray);

    // Convert the decoded message to JSON
    const decodedDataJson = GoogleAuthenticatorImport.toObject(decodedMessage, {
      defaults: true,
      longs: String,
      enums: String,
      bytes: String,
    }) as GoogleExports;

    decodedDataJson.otpParameters = decodedDataJson.otpParameters.map((newCode: GoogleCode) => {
      const tmpCode: GoogleCode = { ...newCode };
      if (!isBase32(tmpCode.secret)) {
        tmpCode.secret = base64ToBase32(tmpCode.secret);
      }
      return tmpCode;
    });
    return decodedDataJson;
  } catch (error) {
    console.error('Error decoding GoogleAuthenticatorImport:', error);
    throw error;
  }
}

export function toTotpData(exportedCode: GoogleCode): TotpData {
  let codeDigits: TotpDigits = 6;
  if (exportedCode.digits === "DIGIT_COUNT_EIGHT") {
    codeDigits = 8;
  }

  let codeAlgorithm: TotpAlgorithm = "sha1";
  if (exportedCode.algorithm != "ALGORITHM_UNSPECIFIED") {
    codeAlgorithm = exportedCode.algorithm.toLowerCase().replace("algorithm_", "") as TotpAlgorithm
  }

  return {
    account: exportedCode.name,
    secret: exportedCode.secret,
    digits: codeDigits,
    period: 30,
    algorithm: codeAlgorithm
  }
}