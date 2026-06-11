import * as protobuf from 'protobufjs';
import { type SupportedAlgorithms, type GoogleCode, type GoogleExports } from "./import";
import { type TotpData } from "./url";
import { decrypt } from "./crypto";
import { authBuffer } from '../data/proto';

export async function codesToGoogle(codes: TotpData[]): Promise<GoogleExports> {
  const result: GoogleExports = {
    otpParameters: [],
    "batchIndex": 0,
    "batchId": 0,
    "batchSize": codes.length,
    "version": 1
  };

  const getValues = async (code: TotpData): Promise<GoogleCode> => {
    const codeDigits = code.digits === 8 ? "DIGIT_COUNT_EIGHT" : "DIGIT_COUNT_SIX";
    const codeSecret = await decrypt(code.secret);
    const newGoogle: GoogleCode = {
      algorithm: "ALGORITHM_" + code.algorithm.toUpperCase() as SupportedAlgorithms,
      counter: "0",
      digits: codeDigits,
      issuer: "WindyOTP",
      name: code.account,
      secret: codeSecret,
      type: "OTP_TYPE_TOTP"
    }

    return newGoogle;
  }

  result.otpParameters = await Promise.all(codes.map(async (code) => {
    return getValues(code);
  }));
  
  return result;
}

export async function encodeGoogleExports(codes: GoogleExports): Promise<Uint8Array> {
  const getRoot = await protobuf.parse(authBuffer);
  const root = getRoot.root;
  const GoogleAuthenticatorImport = root.lookupType('WindyOTP.GoogleAuthenticatorImport');
  const encodedExports = GoogleAuthenticatorImport.encode(GoogleAuthenticatorImport.fromObject(codes)).finish();
  return encodedExports
}