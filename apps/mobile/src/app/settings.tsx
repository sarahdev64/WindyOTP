import {StatusBar} from 'expo-status-bar';
import {View} from 'react-native';
import {Link} from "expo-router";

export default function SettingsPage() {
  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="flex flex-row justify-center">
        <View className="rounded-full bg-backdrop">
          <Link href="/" className="font-semibold text-3xl text-txt px-4 py-2">back</Link>
        </View>
      </View>
      <StatusBar style="auto"/>
    </View>
  );
}
