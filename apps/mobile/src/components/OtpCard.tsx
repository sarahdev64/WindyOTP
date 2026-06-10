import { View, Text, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { getTotp } from "../utils/totp";
import { type TotpData } from "../utils/url";
import { decrypt } from "../utils/crypto";
import OtpMenu from "./OtpMenu";

export default function OtpCard({ name, data, setRefresh }: { name: string, data: TotpData, setRefresh: (val: number) => void }) {
    const [showMenu, setShowMenu] = useState<Boolean>(false)
    const [thisCode, setThisCode] = useState<string>("error")
    const getCounter = () => {
        const counterVal = Math.floor(Date.now() / 1000 % data.period);
        return counterVal;
    }
    const [counter, setCounter] = useState<number>(getCounter())
    const [percentage, setPercentage] = useState<number>(0)

    // Loop counter interval
    useEffect(() => {
        const timer = setInterval(() => {
            const tmpCounter = getCounter()
            setCounter(tmpCounter)
            setPercentage(100 - ((tmpCounter / data.period) * 100))
        }, 500)
        return () => {
            clearInterval(timer)
        }
    }, [])

    useEffect(() => {
        decrypt(data.secret).then((res) => {
            setThisCode(getTotp(data, res));
        }).catch((err) => {
            console.log(`Failed to decrypt key: ${err}`)
        })
    }, [percentage])

    return (
        <TouchableOpacity className="w-full h-auto bg-card bor border mt-2 border-progress/50 rounded-lg" onLongPress={() => setShowMenu(true)}>
            <View className="flex flex-row px-4 gap-6">
                <View>
                    <Text className="text-txt text-lg">{name}</Text>
                    {
                        showMenu ? (
                            <OtpMenu name={name} data={data} setShowMenu={setShowMenu} setRefresh={setRefresh} />
                        ) : (
                            <View className="flex flex-row space-x-2">
                                <Text className="text-txt text-2xl pb-2">{thisCode.substring(0, Math.floor(thisCode.length / 2))}</Text>
                                <Text className="text-txt text-2xl pb-2">{thisCode.substring(Math.floor(thisCode.length / 2), thisCode.length)}</Text>
                            </View>
                        )
                    }
                </View>
            </View>
            <View className="w-11/12 mx-auto pb-2">
                {!showMenu ? (
                    <View className="h-4 bg-progress" style={{
                        width: `${percentage}%`
                    }} />
                ) : null}
            </View>
        </TouchableOpacity>
    )
}