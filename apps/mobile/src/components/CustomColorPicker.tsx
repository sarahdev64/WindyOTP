import {Text, Pressable, View} from "react-native";
import {
  Panel1,
  Preview,
  Swatches,
  HueSlider,
  SaturationSlider, BrightnessSlider
} from "reanimated-color-picker";
import {Picker} from "@react-native-picker/picker";
import ColorPicker from "reanimated-color-picker/lib/src/ColorPicker";
import {useEffect, useState} from "react";
import {getCurrentTheme, getTheme, Theme, updateTheme} from "@/lib/themes";
import {defaultTheme} from "@/constants/themes";
import {useRouter} from "expo-router";
import {Lucide} from "@react-native-vector-icons/lucide";

export default function CustomColorPicker({themeName}: {themeName: string}) {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [initTheme, setInitTheme] = useState<Theme>(defaultTheme);
  const [currentKey, setCurrentKey] = useState<string>("primary");

  useEffect(() => {
      if (themeName) {
        getTheme(themeName).then((res) => {
          if (res !== null) {
            setInitTheme(res);
            setCurrentTheme(res);
          }
        })
      } else {
        getCurrentTheme().then((res) => {
          if (res !== null) {
            setInitTheme(res);
            setCurrentTheme(res);
          }
        });
      }
  }, []);
  
  const save = async () => {
    const changed = await updateTheme(currentTheme);
    if (changed) {
      router.push("/");
    } else {
      console.log(`failed to update theme`)
    }
  };
  
  const reset = async () => {
    const newTheme = {...defaultTheme, name: currentTheme.name};
    const changed = await updateTheme(newTheme);
    if (changed) {
      router.push("/");
    } else {
      console.log(`failed to update theme`)
    }
  }
  
  return (
    <View>
      <View className="p-2 bg-card border border-primary rounded-lg mb-4">
        <Picker style={{
          color: initTheme.txt
        }} mode={"dropdown"} selectedValue={currentKey} onValueChange={(val) => {
          setCurrentKey(val);
        }}>
          {
            Object.keys(initTheme).map((entry) => {
              if (["id", "name"].includes(entry)) {
                return null;
              }
              
              return (
                <Picker.Item label={entry} value={entry} />
              )
            })
          }
        </Picker>
      </View>
      <ColorPicker value={(initTheme as Record<string, any>)[currentKey]} onChangeJS={(val) => {
        const newTheme: Record<string, any> = {...currentTheme};
        newTheme[currentKey] = val.hex;
        setCurrentTheme(newTheme as Theme);
      }}>
        <Preview hideInitialColor={true} />
        <Panel1/>
        <View className="pt-2">
        <Swatches/>
        </View>
        
      </ColorPicker>
      
      <View className="flex flex-row gap-2 py-4">
        <Pressable onPress={async () => {
          await reset();
        }}>
          <Lucide size={30} style={{color: initTheme.txt}} className="bg-danger w-16 h-16 rounded-full text-center align-middle" name={"eraser"}/>
          <Text className="text-txt text-center text-xl align-middle">Default</Text>
        </Pressable>
        <Pressable onPress={async () => {
          await save()
        }}>
          <Lucide size={30} style={{color: initTheme.txt}} className="bg-primary w-16 h-16 rounded-full text-center align-middle" name={"save"}/>
          <Text className="text-txt text-center text-xl align-middle">Save</Text>
        </Pressable>
      </View>
    </View>
  )
}