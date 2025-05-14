import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider, Box } from "native-base";

import css from '../constants/css';
import HSHandler from './Home/HSHandler';
import PSHandler from './Profile/PSHandler';
import SSHandler from './Search/SSHandler';
import NoSHandler from './Notification/NoSHandler';
import NESHandler from './New/NSHandler';
import { StorageHandler } from '../constants/StorageHandler';


const Tab = createBottomTabNavigator();
const BTabHandler = () => {

    return (
        <NativeBaseProvider>
            <NavigationContainer>
                <Tab.Navigator screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName = '';

                        if (route.name == "HSHandler") iconName = 'comments';
                        if (route.name == "SSHandler") iconName = 'sun';    // sun, square-minus, 
                        if (route.name == "NESHandler") iconName = 'circle-question';
                        if (route.name == "Notification") iconName = 'bell';
                        if (route.name == "user") iconName = 'user';

                        if (focused) {
                            color = css.redesign.darker;
                        }
                        else {
                            color = css.redesign.darker;
                        }
                        return <Icon key={iconName} name={iconName} size={size} color={color}  solid={focused} light={!focused} />;
                    },
                    tabBarActiveTintColor: css.redesign.darker,
                    // tabBarShowLabel: false,
                    tabBarLabel: ({ focused, color }) => {
                        let name;
                        if (route.name == "HSHandler") name = "خانه";
                        if (route.name == "SSHandler") name = "جستجو";
                        if (route.name == "NESHandler") name = "جدید";
                        if (route.name == "Notification") name = "اعلان";
                        if (route.name == "user") name = "کاربر";
                        return <Text key={name} style={{ color: color, fontSize: 12, textAlign: 'center' }}>{name}</Text>
                    },
                    tabBarStyle: {
                        paddingVertical: 5,
                        height: 55,
                        backgroundColor: css.redesign.primary,
                    },
                })}>
                    <Tab.Screen name="HSHandler" component={HSHandler} />
                    <Tab.Screen name="SSHandler" component={SSHandler} />
                    <Tab.Screen name="NESHandler" component={NESHandler} />
                    <Tab.Screen name="Notification" component={NoSHandler} />
                    <Tab.Screen name="user" component={PSHandler} />
                </Tab.Navigator>
            </NavigationContainer>
        </NativeBaseProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff"
    },
    btn: {
        width: '45%',
        height: 40,
        borderRadius: 20,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarArea: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: css.colors.gray,
    },
    contentArea: {
        flex: 1,
    },
    add_new: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: css.colors.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 15,
        left: Dimensions.get('window').width / 2 - 25,
    }
});

export default BTabHandler;

