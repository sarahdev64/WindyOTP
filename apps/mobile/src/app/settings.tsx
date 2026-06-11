import {StatusBar} from 'expo-status-bar';
import {Pressable, View} from 'react-native';
import {Link, router} from "expo-router";
import {useUnstableNativeVariable} from "nativewind";
import {Lucide} from "@react-native-vector-icons/lucide";

export default function SettingsPage() {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  
  return (
    <View className="bg-backdrop flex-col h-full">
      <View className="h-full shrink">
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <Pressable onPress={() => {
          // @ts-ignore
          router.navigate('/');
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-delete w-16 h-16 rounded-full text-center align-middle" name={"circle-off"}/>
        </Pressable>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
