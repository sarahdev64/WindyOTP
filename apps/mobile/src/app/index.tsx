import {StatusBar} from 'expo-status-bar';
import {Text, View, FlatList} from 'react-native';
import {Link} from 'expo-router';
import {type CodeList, getCodes} from '../utils/codes';
import {useEffect, useState} from 'react';
import OtpCard from '../components/OtpCard';

export default function HomePage() {
  const [codes, setCodes] = useState<CodeList>()
  const [refresh, setRefresh] = useState<number>()
  // Get codes
  useEffect(() => {
    getCodes().then((res: CodeList) => {
      setCodes(res);
    }).catch((err) => {
      console.log(err);
    })
  }, [refresh])

  return (
    <View className="bg-backdrop flex flex-col h-full">
      <View className="bg-nav p-4 pt-6 flex flex-row justify-evenly">
        <Text className="font-semibold text-2xl text-txt px-4 py-2">WindyOTP</Text>
        <View className="rounded-full bg-backdrop">
          <Link href="/code" className="font-semibold text-3xl text-txt px-4 py-2">+</Link>
        </View>
        <View className="rounded-full bg-backdrop">
          <Link href="/exports" className="font-semibold text-3xl text-txt px-4 py-2">{"\u2197"}</Link>
        </View>
      </View>
      <FlatList
        scrollEnabled={true}
        scrollToOverflowEnabled={true}
        data={codes && codes.codes ? Object.keys(codes.codes) : null}
        renderItem={({item, index}) => {
          return (
            <OtpCard
              key={index}
              name={codes.codes[item].account}
              data={codes.codes[item]}
              setRefresh={setRefresh}
            />
          )
        }}
        keyExtractor={item => item}
      />
      <StatusBar style="auto"/>
    </View>
  );
}
