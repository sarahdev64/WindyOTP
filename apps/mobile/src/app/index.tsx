import 'react-native-get-random-values';
import {StatusBar} from 'expo-status-bar';
import {View, FlatList} from 'react-native';
import {Link} from 'expo-router';
import {type CodeList, getCodes} from '../utils/codes';
import {useEffect, useState} from 'react';
import "../global.css";
import OtpCard from '../components/OtpCard';

export default function HomePage() {
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
      />
      <View className="bg-nav flex flex-row justify-center py-2">
        <View className="rounded-full bg-progress">
          <Link href="/code" className="text-2xl text-center text-txt w-10 h-10">+</Link>
        </View>
        <View className="rounded-full bg-backdrop">
          <Link href="/exports" className="font-semibold text-3xl text-txt px-4 py-2">{"\u2197"}</Link>
        </View>
      </View>
      <StatusBar style="auto" hidden={true}/>
    </View>
  );
}
