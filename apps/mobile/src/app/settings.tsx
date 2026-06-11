import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {Link} from "expo-router";

export default function SettingsPage() {
  return (
    <View className="bg-backdrop flex-col h-full">
      <View className="h-full shrink">
      </View>
      <View className="bg-nav flex flex-row justify-evenly py-2">
        <View className="rounded-full bg-delete">
          <Link href="/" className="text-2xl text-center text-txt w-10 h-10">x</Link>
        </View>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
