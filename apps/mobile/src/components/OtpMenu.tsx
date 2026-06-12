import { View } from "react-native";
import { StyledButton as Button } from "./StyledButton";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import { type CodeList } from "@/lib/codes";
import { type TotpData } from "@/lib/url";
import OtpRename from "./OtpRename";

export default function OtpMenu({ name, data, setShowMenu, setRefresh }: {
  name: string,
  data: TotpData,
  setShowMenu: (val: boolean) => void,
  setRefresh: (val: number) => void
}) {
  const [showConfirm, setShowConfirm] = useState<Boolean>(false)
  const [showRename, setShowRename] = useState<Boolean>(false);
  
  return (
    <>
      {showRename ? (
        <OtpRename name={name} data={data} setShowRename={setShowRename} setRefresh={setRefresh} />
      ) : (
        <View className="flex flex-row gap-4 h-12 my-2">
          {!showConfirm ? (
            <>
              <Button title="Cancel" className="px-2 py-1" onPress={() => {
                setShowMenu(false)
              }} />
              <Button title="Delete" className="bg-delete px-2 py-1" onPress={() => {
                setShowConfirm(true)
              }} />
              <Button title="Rename" className="bg-rename px-2 py-1" onPress={() => {
                setShowRename(true)
              }} />
            </>
          ) : (
            <>
              <Button title="Delete" className="bg-delete px-2 py-1" onPress={() => {
                // Add delete code
                AsyncStorage.getItem(Buffer.from(Device.modelName ?? "unknown").toString("hex")).then((res: string | null) => {
                  if (res === null || res === "") {
                      return;
                  }
                  
                  const codes: CodeList = JSON.parse(res);
                  delete codes.codes[data.account];
                  AsyncStorage.setItem(Buffer.from(Device.modelName ?? "unknown").toString("hex"), JSON.stringify(codes)).then((res) => {
                    setRefresh(Math.random())
                  }).catch((err) => {
                    console.log(`Delete error 1: ${err}`)
                  });
                }).catch((err) => {
                  console.log(`Delete error: ${err}`)
                })
                setShowConfirm(false)
                setShowMenu(false)
              }} />
              <Button title="Cancel" className="px-2 py-1" onPress={() => {
                setShowConfirm(false)
                setShowMenu(false)
              }} />
            </>
          )}
        </View>
      )}
    </>
  )
}