import { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { type TotpData } from "@/lib/url";
import { View } from "react-native";
import { StyledButton as Button } from "./StyledButton";
import { updateCode } from "@/lib/codes";

export default function OtpRename({ name, data, setShowRename, setRefresh }: {
  name: string,
  data: TotpData,
  setShowRename: (val: boolean) => void,
  setRefresh: (val: number) => void
}) {
  const [rename, setRename] = useState<string>(data.account);
  return (
    <View className="flex flex-col ml-4">
      <TextInput className="bg-input text-inputTxt px-4 mx-4" value={rename} onChangeText={(val: string) => {
        setRename(val);
      }} />
      <View className="flex flex-row gap-4 py-2">
        <Button title="Cancel" className="px-4 py-2" onPress={() => {
          setRename(data.account);
          setShowRename(false);
        }} />
        <Button title="Rename" className="bg-rename px-4 py-2" onPress={() => {
          console.log(`Renaming ${data.account} to ${rename}`);
          updateCode(name, { ...data, account: rename }).then(() => {
            setRefresh(Math.random())
            setShowRename(false)
          }).catch((err) => {
            console.log(`Error renaming account: ${err}`)
          })
        }} />
      </View>
    </View>
  )
}