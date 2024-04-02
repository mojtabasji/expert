import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import css from '../constants/css';
import HSHandler from './HSHandler';
import Search from './Search';
import Bell from './Bell';
import Profile from './Profile';
import { StorageHandler } from '../constants/StorageHandler';


const Tab = createBottomTabNavigator();
const BTabHandler = () => {
    const [currentTab, setCurrentTab] = useState('home');


    const change_tab = (tab_name: string) => {
        setCurrentTab(tab_name);
    }

    const get_data = async () => {
        let session_id = await StorageHandler.retrieveData("session_id");
        console.log("session_id:", session_id);
    }

    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
        
        }}>
            <Tab.Screen name="HSHandler" component={HSHandler} />
            <Tab.Screen name="Search" component={Search} />
            <Tab.Screen name="Bell" component={Bell} />
            <Tab.Screen name="user" component={Profile} />
        </Tab.Navigator>
    );

    return (
        <View style={styles.container}>
            <View style={styles.contentArea}>
                {
                    currentTab == 'home' ? <HSHandler /> : null
                }
                {
                    currentTab == 'search' ? <Search /> : null
                }
                {
                    currentTab == 'bell' ? <Bell /> : null
                }
                {
                    currentTab == 'user' ? <Profile /> : null
                }
            </View>
            <View style={styles.tabBarArea}>
                <View style={{ width: '40%', justifyContent: 'space-around', flexDirection: 'row' }} >
                    <Icon name='home' size={20} color={currentTab == 'home' ? 'black' : 'gray'} onPress={() => { change_tab('home') }} />
                    <Icon name='search' size={20} color={currentTab == 'search' ? 'black' : 'gray'} onPress={() => { change_tab('search') }} />
                </View>
                <View style={{ width: '40%', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <Icon name='bell' size={20} color={currentTab == 'bell' ? 'black' : 'gray'} onPress={() => { change_tab('bell') }} />
                    <Icon name='user' size={20} color={currentTab == 'user' ? 'black' : 'gray'} onPress={() => { change_tab('user') }} />
                </View>
                <TouchableOpacity style={styles.add_new} onPress={() => { get_data() }}>
                    <Icon name='plus' size={20} color={css.colors.black} />
                </TouchableOpacity>
            </View>
        </View>
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

