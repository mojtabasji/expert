import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import css from '../constants/css';
import HSHandler from './Home/HSHandler';
import PSHandler from './Profile/PSHandler';
import SSHandler from './Search/SSHandler';
import Bell from './Bell';
import NESHandler from './New/NSHandler';
import { StorageHandler } from '../constants/StorageHandler';


const Tab = createBottomTabNavigator();
const BTabHandler = () => {

    return (
        <NavigationContainer>
            <Tab.Navigator screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';

                    if (route.name == "HSHandler") iconName = 'home';
                    if (route.name == "SSHandler") iconName = 'search';
                    if (route.name == "NESHandler") iconName = 'plus-circle';
                    if (route.name == "Bell") iconName = 'bell';
                    if (route.name == "user") iconName = 'user';

                    if (focused) {
                        color = css.colors.dark;
                    }
                    else {
                        color = css.colors.light_dark;
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                }
            })}>
                <Tab.Screen name="HSHandler" component={HSHandler} />
                <Tab.Screen name="SSHandler" component={SSHandler} />
                <Tab.Screen name="NESHandler" component={NESHandler} />
                <Tab.Screen name="Bell" component={Bell} />
                <Tab.Screen name="user" component={PSHandler} />
            </Tab.Navigator>
        </NavigationContainer>
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

