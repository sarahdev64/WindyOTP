import {StatusBar} from 'expo-status-bar';
import {Pressable, View, Text} from 'react-native';
import {router} from "expo-router";
import {useUnstableNativeVariable} from "nativewind";
import {Lucide} from "@react-native-vector-icons/lucide";

export default function SettingsPage() {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  
  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="h-full flex flex-col shrink px-2 py-20">
        <Pressable onPress={() => {
          router.navigate('/exports');
        }} className="w-full border border-progress/50 rounded-lg p-2">
          <Text className="text-txt text-2xl text-center">Export</Text>
        </Pressable>
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <Pressable onPress={() => {
          router.navigate('/');
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"home"}/>
        </Pressable>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
