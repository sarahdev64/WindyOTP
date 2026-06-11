import { StatusBar } from 'expo-status-bar';
import { Text, View, Button } from 'react-native';
import { Link, router } from 'expo-router';
import {useEffect, useRef, useState} from 'react';
import {Camera, CameraView, useCameraPermissions} from 'expo-camera';
import { type TotpData, validTotpUrl, parseTotpUrl } from '../utils/url';
import { addCode } from '../utils/codes';
import { type GoogleCode, type GoogleExports, decodeMigration, isMigration, toTotpData } from '../utils/import';

type CodeState = {
  scanned?: boolean,
  showScan?: boolean,
  invalid?: boolean,
}

export default function CodePage() {
  const [codeState, setCodeState] = useState<CodeState>({ invalid: false, showScan: true })
  const [permission, requestPermission] = useCameraPermissions({
    get: true,
    request: true
  });
  
  const cameraRef = useRef<CameraView>(null);

  if (!permission?.granted) {
    return <Button onPress={requestPermission} title="Grant Camera Access" />;
  }

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
      if (totpData != null) {
        codeData.push(totpData);
      }
    }

    let success = true;
    addCode(codeData).catch((err) => {
      console.log(`Error adding codes: ${err}`);
      success = false;
    });

    setCodeState({ ...codeState, scanned: true, invalid: !success, showScan: false })
    console.log(`Success: ${success}`)
    if (success) {
      setTimeout(() => {
        router.push("/");
      }, codeData.length * 100)
    }
  };

  return (
    <View className="bg-backdrop flex-col h-full">
      <View className="h-full shrink">
        {codeState.invalid ? (
          <View className='w-full bg-red-500'>
            <Text className='text-txt text-xl text-center font-semibold py-2'>Unsupported TOTP QR Code</Text>
          </View>
        ) : null}
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={codeState.scanned ? undefined : handleBarCodeScanned}
          facing="back"
          style={{flex: 1}}
          ref={cameraRef}
          onCameraReady={() => {
            console.log(`Camera ready`)
          }}
          onMountError={(err) => {
            console.log(`Error mounting camera: ${err}`)
          }}
          onLayout={() => {
            console.log("layout change");
          }}
          onAvailableLensesChanged={(event) => {
            console.log(`lenses changed: ${JSON.stringify(event.lenses)}`)
          }}
        />
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <View className="rounded-full bg-delete">
          <Link href="/" className="text-2xl text-center text-txt w-10 h-10">x</Link>
        </View>
      </View>
      <StatusBar style="auto" hidden={true} />
    </View>
  );
}