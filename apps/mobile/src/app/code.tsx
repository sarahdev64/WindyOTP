import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import * as Device from 'expo-device'
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { BarCodeScanner } from "expo-barcode-scanner";
import { Camera } from 'expo-camera';
import { type TotpData, validTotpUrl, parseTotpUrl } from '../utils/url';
import { addCode } from '../utils/codes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearSecret } from '../utils/crypto';
import { StyledButton as Button } from '../components/StyledButton';
import { type GoogleCode, type GoogleExports, decodeMigration, isMigration, toTotpData } from '../utils/import';

type CodeState = {
  permission?: boolean,
  scanned?: boolean,
  showCamera: boolean,
  showScan?: boolean,
  invalid?: boolean,
}

export default function CodePage() {
  const [codeState, setCodeState] = useState<CodeState>({ invalid: false, showScan: true, showCamera: false, permission: false })
  const debug = false;
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setCodeState({ ...codeState, permission: status === "granted" });
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: any, data: string }) => {
    const codeData: TotpData[] = [];
    const totpData: TotpData | null = validTotpUrl(data) ? parseTotpUrl(data) : null;
    const checkMigration = isMigration(data);
    if (!totpData && !checkMigration) {
      setCodeState({ ...codeState, invalid: true });
      return
    }

    if (checkMigration) {
      const decodedData = decodeURIComponent(data)
      const migrationCodes: GoogleExports = await decodeMigration(decodedData)
      migrationCodes.otpParameters.forEach((thisCode: GoogleCode) => {
        try {
          const newData = toTotpData(thisCode)
          codeData.push(newData);
        } catch (error) {
          console.log(`Migration import error: ${error}`)
        }
      });
    } else {
      codeData.push(totpData)
    }

    let success = true;
    addCode(codeData).catch((err) => {
      console.log(`Error adding codes: ${err}`);
      success = false;
    });

    setCodeState({ ...codeState, scanned: true, invalid: !success, showCamera: false, showScan: false })
    console.log(`Success: ${success}`)
    if (success) {
      setTimeout(() => {
        router.push("/");
      }, codeData.length * 100)
    }
  };

  const RenderCamera = () => {
    return (
      <View className='overflow-hidden aspect-[1] w-full my-4'>
        <Camera
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={codeState.scanned ? undefined : handleBarCodeScanned}
          className='flex-1'
        />
      </View>
    );
  };

  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="h-full flex-shrink">
        {codeState.invalid ? (
          <View className='w-full bg-red-500'>
            <Text className='text-txt text-xl text-center font-semibold py-2'>Unsupported TOTP QR Code</Text>
          </View>
        ) : null}
        {
          debug ? (
            <>
              <Button title='clear secret' onPress={() => {
                clearSecret().then(() => {
                  console.log("cleared secret")
                }).catch((err) => {
                  console.log(err)
                })
              }} />
              <Button title='clear cache' onPress={() => {
                AsyncStorage.clear()
              }} />
            </>
          ) : null
        }
        {codeState.showScan ? (
          <Button title={codeState.showCamera ? "cancel" : "scan"} text_className='text-xl text-center pt-1' className='w-screen h-10 bg-progress' onPress={() => {
            if (codeState.permission) {
              setCodeState({ ...codeState, showCamera: codeState.showCamera === false })
            }
          }} />
        ) : null}
        {codeState.showCamera ? <RenderCamera /> : <Text className='text-txt'>Showing camera turned off</Text>}
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <View className="rounded-full bg-delete">
          <Link href="/" className="text-2xl text-center text-txt w-10 h-10">x</Link>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}