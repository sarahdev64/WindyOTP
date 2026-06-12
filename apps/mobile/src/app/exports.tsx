import * as LocalAuthentication from 'expo-local-authentication';
import QRCode from 'react-native-qrcode-svg';
import { useEffect, useState } from 'react';
import {Text, View, useWindowDimensions, Pressable} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {router, useLocalSearchParams} from 'expo-router';

import { codesToGoogle, encodeGoogleExports } from '@/lib/exports';
import { type CodeList, getCodes } from '@/lib/codes';
import { type GoogleExports } from '@/lib/import';
import {Lucide} from "@react-native-vector-icons/lucide";
import {useUnstableNativeVariable} from "nativewind";
import {TotpData} from "@/lib/url";

export default function ExportsPage() {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  const { keyName }: {keyName: string} = useLocalSearchParams();
  const { height, width } = useWindowDimensions();
  const [codes, setCodes] = useState<CodeList>()
  const [exportData, setExportData] = useState<string>("no codes")
  const [permission, setPermission] = useState<Boolean>(false)
  const [supported, setSupported] = useState<Boolean>(false)

  useEffect(() => {
    // Get codes
    getCodes().then((res: CodeList) => {
      setCodes(res);
    }).catch((err) => {
      console.log(err);
    })
  }, [])

  useEffect(() => {
    // Check if device has authentication methods
    LocalAuthentication.isEnrolledAsync().then((res) => {
      setSupported(res);
      if (!res || typeof codes === "undefined" || Object.keys(codes.codes).length === 0) {
        return;
      }
      
      if (typeof keyName !== "undefined" && Object.hasOwn(codes.codes, keyName)) {
        console.log(`using specific export key`);
        LocalAuthentication.authenticateAsync({}).then((authRes) => {
          setPermission(authRes.success);
          const data: TotpData = codes.codes[keyName];
          setExportData(`otpauth://totp/label?secret=${data.secret}&algorithm=${data.algorithm}&digits=${data.digits}&period=${data.period}`);
        });
        
        return;
      }
      
      LocalAuthentication.authenticateAsync({}).then((authRes) => {
        setPermission(authRes.success);
        codesToGoogle(Object.values(codes.codes)).then((gCodes: GoogleExports) => {
          encodeGoogleExports(gCodes).then((displayUri) => {
            const displayBuffer = Buffer.from(displayUri)
            if (gCodes.otpParameters.length > 0) {
              setExportData("otpauth-migration://offline?data=" + displayBuffer.toString("base64"));
            }
          }).catch((displayErr) => {
            console.log("Display Error: " + displayErr)
          })
        }).catch((gError) => {
          console.log("gCode error: " + gError);
        })
      }).catch((authErr) => {
        console.log(authErr);
      });
    }).catch((err) => {
      console.log(err);
    });
  }, [codes])

  return (
    <View className="bg-backdrop flex-col h-full">
      <View className="h-full shrink flex-col justify-center">
        <View className='p-4'>
          {supported ? (
            <>
              {
                permission ? (
                  <>
                    {
                      exportData !== "no codes" ? (
                        <QRCode
                          value={exportData}
                          size={width - 32}
                          quietZone={6}
                        />
                      ) : <Text className='text-txt'>You don't have any exportable codes</Text>
                    }
                  </>
                ) : (
                  <Text className='text-txt'>
                    Failed to get device permission
                  </Text>
                )
              }
            </>
          ) : (
            <>
              <Text className="text-txt">
                Your device requires biometric authentication to export your codes
              </Text>
            </>
          )}
        </View>
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <Pressable onPress={() => {
          router.back();
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"x"}/>
        </Pressable>
      </View>
      <StatusBar style="auto" hidden={true} />
    </View>
  );
}
