import 'react-native-get-random-values';
import {StatusBar} from 'expo-status-bar';
import {View, FlatList, Button, Pressable} from 'react-native';
import {router, useRouter} from 'expo-router';
import {type CodeList, getCodes} from '@/lib/codes';
import {useEffect, useState} from 'react';
import OtpCard from '../components/OtpCard';
import { Lucide } from "@react-native-vector-icons/lucide";
import "../global.css";

import { useUnstableNativeVariable } from 'nativewind';

export default function HomePage() {
  // @ts-ignore
  const txtColor = useUnstableNativeVariable("--color-txt");
  const router = useRouter();
  
  const [codes, setCodes] = useState<CodeList>({
    installDate: 0,
    codes: {}
  });
  
  const [refresh, setRefresh] = useState<number>()
  
  // Get codes
  useEffect(() => {
    getCodes().then((res: CodeList) => {
      setCodes(res);
    }).catch((err) => {
      console.log(`Error getting codes: ${err}`);
    })
  }, [refresh])

  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="flex flex-row justify-end p-2 pb-0">
        <Pressable onPress={() => {
          router.navigate('/settings');
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-card w-16 h-16 rounded-full text-center align-middle" name={"settings"}/>
        </Pressable>
      </View>
      <FlatList
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        data={Object.keys(codes.codes)}
        renderItem={({item, index}) => {
          return (
            <OtpCard
              key={index}
              name={codes!.codes[item].account}
              data={codes!.codes[item]}
              setRefresh={setRefresh}
            />
          )
        }}
        keyExtractor={item => item}
        className="p-2"
      />
      <View className="bg-nav flex flex-row py-2 justify-center">
        <Pressable onPress={() => {
          router.navigate('/code');
        }}>
          <Lucide size={30} style={{color: txtColor}} className="bg-progress w-16 h-16 rounded-full text-center align-middle" name={"plus"}/>
        </Pressable>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
