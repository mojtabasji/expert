import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from "react-native";


type TabViewProps = {
    items: Array<{ name: string }>,
    style?: any,
    onChange?: (tab: string) => void,
    Colors?: {
        backgroundColor?: string,
        textColor?: string,
        itemColor?: string,
        selectedTextColor?: string,
    }
}

const TabView = (Props: TabViewProps) => {
    const [tabs, setTabs] = useState(Props.items);
    const [currentTab, setCurrentTab] = useState("Exps");

    useEffect(() => {
        if (Props.onChange) {
            Props.onChange(currentTab);
        }
    }, [currentTab]);

    const Colors = {
        background: Props.Colors?.backgroundColor || "#ddd",
        text: Props.Colors?.textColor || "#202020",
        item: Props.Colors?.itemColor || "#eee",
        selectedTextColor: Props.Colors?.selectedTextColor || "#000",
    }
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignSelf: "center",
            flexDirection: "row",
            backgroundColor: Colors.background,
            borderRadius: 25,
        },
        item: {
            width: 100,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 25,
            margin: 2,
        },
        selectedTab: {
            backgroundColor: Colors.item,
        },
        text: {
            color: Colors.text,
            fontSize: 14,
        }
    });

    return (
        <View style={[styles.container, Props.style]}>
            {
                tabs.map((tab, index) => (
                    <TouchableOpacity style={[styles.item, {
                        backgroundColor: tab.name === currentTab ? Colors.item : "transparent"
                    }]} key={index} onPress={() => setCurrentTab(tab.name)}>
                        <View>
                            <Text style={[styles.text, {
                                color: tab.name === currentTab ? Colors.selectedTextColor : Colors.text
                            }]}>{tab.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))
            }
        </View>
    );
}

export default TabView;