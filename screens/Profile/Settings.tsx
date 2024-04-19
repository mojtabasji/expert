import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Dimensions, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Menu, Pressable, HamburgerIcon, Box, ThreeDotsIcon, Switch } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

import css from '../../constants/css';
import NotificationHandler from '../../constants/NotificationHandler';


const Settings = (props: any) => {
    const [notifications, setNotifications] = useState(false);
    const { notificationIsEnable, updateNotificationIsEnable } = useContext(NotificationHandler);

    useEffect(() => {
        setNotifications(notificationIsEnable);
    }, []);

    useEffect(() => {
        updateNotificationIsEnable(notifications);
    }, [notifications]);

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <View style={{ justifyContent: "center", paddingVertical: 10, paddingHorizontal: 10, }}>
                <TouchableOpacity onPress={() => props.navigation.goBack()}
                    style={{
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: css.redesign.darker,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <Icon name="chevron-left" size={20} onPress={() => props.navigation.goBack()} color={css.redesign.darker} />
                </TouchableOpacity>
                <Text style={[css.titleText, {
                    color: css.redesign.darker,
                    position: "absolute",
                    alignSelf: "center",
                }]}>تنظیمات</Text>
            </View>
            <ScrollView contentContainerStyle={{
                width: "100%",
                marginTop: 20,
            }} style={{
                borderTopWidth: 1,
                borderTopColor: css.redesign.darker,
            }}>
                <View style={styles.item}>
                    <Text style={[css.normalText, {}]}>اعلان ها</Text>
                    <Switch size="lg" colorScheme="green" isChecked={notifications} onToggle={() => setNotifications(!notifications)} />
                </View>
            </ScrollView>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: css.redesign.primary,
    },
    item: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center"
    }
});

export default Settings;