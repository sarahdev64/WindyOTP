import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Stack} from "expo-router";
import {useEffect, useState} from 'react';
import {getCurrentTheme, transformTheme, tryInit} from "@/lib/themes";
import {VariableContextProvider} from "nativewind";
import {defaultTheme} from "@/constants/themes";
import {usePathname} from "expo-router";
import "../global.css";

export default function Layout() {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState<Record<string, string | number>>(transformTheme(defaultTheme));
  const [refresh, setRefresh] = useState<number>(0);
  
  useEffect(() => {
    tryInit().then(() => {
      getCurrentTheme().then((res) => {
        if (res !== null) {
          const newTheme = transformTheme(res);
          if (JSON.stringify(newTheme) !== JSON.stringify(currentTheme)) {
            setCurrentTheme(newTheme);
            setRefresh(refresh + 1);
          }
        }
      })
    })
  }, [pathname]);

  
  return (
      <GestureHandlerRootView>
        <VariableContextProvider value={currentTheme}>
          <Stack key={refresh} screenOptions={{
            headerShown: false,
          }}/>
        </VariableContextProvider>
      </GestureHandlerRootView>
  );
}