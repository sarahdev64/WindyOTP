import {StatusBar} from 'expo-status-bar';
import {Pressable, View, TextInput, Text, Modal, KeyboardAvoidingView, Platform} from 'react-native';
import {router, useLocalSearchParams} from "expo-router";
import {useUnstableNativeVariable} from "nativewind";
import {Lucide} from "@react-native-vector-icons/lucide";
import {useEffect, useState} from "react";
import * as Device from 'expo-device'
import {CodeList, getCodes, updateCode} from "@/lib/codes";
import {TotpData} from "@/lib/url";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function EditPage() {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  const { keyName }: {keyName: string} = useLocalSearchParams();
  const [refresh, setRefresh] = useState<number>();

  const [codes, setCodes] = useState<CodeList>({
    installDate: 0,
    codes: {}
  });
  
  const [data, setData] = useState<TotpData>();
  
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showRename, setShowRename] = useState<boolean>(false);
  

  // Get codes
  useEffect(() => {
    getCodes().then((res: CodeList) => {
      setCodes(res);
      if (Object.hasOwn(res.codes, keyName)) {
        setData(res.codes[keyName])
      }
    }).catch((err) => {
      console.log(`Error getting codes: ${err}`);
    })
  }, [refresh]);
  
  const actions = {
    save: async () => {
      if (typeof data !== "undefined") {
        await updateCode(keyName, data)
        router.navigate("/");
      }
    },
    promptDelete: () => {
      setShowDelete(true);
    },
    rename: () => {
      setShowRename(true);
    },
    delete: async () => {
      const modelName: string = Device.modelName ?? "unknown";
      delete codes.codes[keyName];
      await AsyncStorage.setItem(Buffer.from(modelName).toString("hex"), JSON.stringify(codes));
      router.navigate("/");
    },
    export: () => {
      
    }
  };
  
  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="h-full shrink flex flex-col p-2 justify-end">
        {
          typeof data !== "undefined" ? (
            <KeyboardAvoidingView behavior={"padding"}>
              <View className={`px-2 ${showDelete ? "blur-sm" : ""}`}>
                <Modal visible={showDelete} transparent={true} animationType={"slide"} presentationStyle={"overFullScreen"}>
                  <View className="w-full h-1/3 p-10 border border-delete/50 bg-nav flex flex-col justify-center rounded-lg">
                    <Text className="text-txt text-2xl">Are you sure you want to delete: {data?.account}?</Text>
                    <View className="flex flex-row gap-10 py-10">
                      <Pressable onPress={() => {
                        setShowDelete(false);
                      }}>
                        <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"x"}/>
                        <Text className="text-txt text-xl align-middle">Cancel</Text>
                      </Pressable>
                      <Pressable onPress={async () => {
                        await actions.delete();
                      }}>
                        <Lucide size={30} style={{color: txtColor}} className="bg-delete w-16 h-16 rounded-full text-center align-middle" name={"trash"}/>
                        <Text className="text-txt text-xl align-middle">Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                  <View className="flex flex-row gap-2">
                    <Text className="text-txt text-xl align-middle">Name</Text>
                    <TextInput className="text-txt text-xl bg-card border border-progress/50 rounded-full grow" value={data.account} onChangeText={(val) => {
                      setData({...data, account: val});
                    }}/>
                  </View>
                <View className="flex flex-row gap-10 py-10">
                  <Pressable onPress={() => {
                    actions.promptDelete();
                  }}>
                    <Lucide size={30} style={{color: txtColor}} className="bg-delete w-16 h-16 rounded-full text-center align-middle" name={"trash"}/>
                    <Text className="text-txt text-xl align-middle">Delete</Text>
                  </Pressable>
                  {/*<Pressable onPress={() => {*/}
                  {/*  actions.export();*/}
                  {/*}}>*/}
                  {/*  <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"arrow-up-right"}/>*/}
                  {/*  <Text className="text-txt text-xl align-middle">Export</Text>*/}
                  {/*</Pressable>*/}
                </View>
              </View>
              </KeyboardAvoidingView>
          ) : null
        }
      </View>
      <View className={`bg-nav flex flex-row justify-evenly py-2 ${showDelete ? "blur-sm" : ""}`}>
        <Pressable onPress={() => {
          router.navigate('/');
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"x"}/>
        </Pressable>
        <Pressable onPress={async () => {
          await actions.save();
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-progress w-16 h-16 rounded-full text-center align-middle" name={"save"}/>
        </Pressable>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
