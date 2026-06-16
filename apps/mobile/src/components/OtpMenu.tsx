import {View, Pressable} from "react-native";
import {Lucide} from "@react-native-vector-icons/lucide";
import {useUnstableNativeVariable} from "nativewind";
import { router } from "expo-router";

export default function OtpMenu({ name }: {
  name: string
}) {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  
  return (
    <View className="w-24 h-24 bg-card border mt-2 border-primary/50 rounded-lg">
      <View className="w-full h-full flex flex-col py-2 justify-center">
        <Pressable onPress={() => {
          router.navigate({
            pathname: "/edit",
            params: {
              keyName: name
            }
          })
        }}>
          <Lucide size={30} style={{color: txtColor}} className="w-10 h-10 text-center mx-auto align-middle" name={"edit"}/>
        </Pressable>
      </View>
    </View>
  )
}