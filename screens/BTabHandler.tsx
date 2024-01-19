import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import css from '../assets/css';
import Home from './Home';
import Search from './Search';
import Bell from './Bell';
import Profile from './Profile';



const BTabHandler = () => {
    const [currentTab, setCurrentTab] = useState('home');


    const change_tab = (tab_name: string) => {
        setCurrentTab(tab_name);
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentArea}>
                {
                    currentTab == 'home' ? <Home /> : null
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
                <View style={{ width: '40%', justifyContent: 'space-around', flexDirection: 'row'}} >
                    <Icon name='home' size={20} color={currentTab == 'home' ? 'black' : 'gray'} onPress={() => { change_tab('home') }} />
                    <Icon name='search' size={20} color={currentTab == 'search' ? 'black' : 'gray'} onPress={() => { change_tab('search') }} />
                </View>
                <View style={{ width: '40%', justifyContent: 'space-around', flexDirection: 'row' }}>
                    <Icon name='bell' size={20} color={currentTab == 'bell' ? 'black' : 'gray'} onPress={() => { change_tab('bell') }} />
                    <Icon name='user' size={20} color={currentTab == 'user' ? 'black' : 'gray'} onPress={() => { change_tab('user') }} />
                </View>
                <View style={styles.add_new}>
                    <Icon name='plus' size={20} color={css.colors.black} />
                </View>
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

