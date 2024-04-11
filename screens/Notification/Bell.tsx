import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';

import { notifications as Notifs } from '../../assets/data';
import { Notification } from '../../constants/types';
import css from '../../constants/css';
import { ScrollView } from 'native-base';
import { api } from '../../constants/Const';
import { StorageHandler } from '../../constants/StorageHandler';


const Bell = (Props: any) => {
    const [notifications, setNotifications] = useState([] as Notification[]);

    useEffect(() => {
        axios.get(api.get_notifications).then(res => {
            let notifs: Notification[] = res.data;
            setNotifications(notifs.reverse());
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const setRead = (notification: Notification) => {
        StorageHandler.retrieveData("session_id").then((session) => {
            axios.get(api.set_notification_read + `?id=${notification.id}`, {
                headers: {
                    'Cookie': `session_id=${session}`
                }
            }).then(res => {
                if (res.data.result == "true") {
                }
            }).catch(err => {
                console.log(err);
            });
            let newNotifications = notifications.map((notif, index) => {
                if (notif.id == notification.id) notif.is_read = true;
                return notif;
            });
            setNotifications(newNotifications);
        });
    }

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <ScrollView style={{ width: '100%' }}>
                <View style={{ width: '100%', alignItems: 'center', }}>
                    {
                        notifications.length === 0 ? <Text>No notification</Text> :
                            notifications.map((notification: Notification) => {
                                return (
                                    <TouchableOpacity style={{
                                        width: '90%',
                                        paddingHorizontal: 20,
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        paddingVertical: 10,
                                        borderBottomWidth: 1,
                                        borderBottomColor: css.colors.gray,
                                    }} onPress={() => {
                                        setRead(notification);
                                        Props.navigation.navigate('ShowOneExp', { exp: notification.exp })
                                    }}>
                                        {
                                            notification.exp.image || notification.user.avatar ?
                                                <Image source={{ uri: notification.exp.image ? notification.exp.image : notification.user.avatar ? notification.user.avatar : "" }} style={{ width: 50, height: 50, borderRadius: 20 }} />
                                                :
                                                <Image source={require('../../assets/images/user_avatar.png')} style={{ width: 50, height: 50, borderRadius: 20 }} />
                                        }
                                        <View style={{ marginLeft: 10, flexDirection: "row" }}>
                                            <Text style={{ maxWidth: "90%", textAlign: "left" }}>{notification.user.fullname} {notification.content}</Text>
                                        </View>
                                        {
                                            notification.is_read ? null :
                                                <View style={{ position: 'absolute', left: 5, width: 5, height: 5, borderRadius: 2.5, backgroundColor: css.colors.primary }}></View>
                                        }
                                    </TouchableOpacity>
                                )
                            })
                    }
                </View>
            </ScrollView>
        </LinearGradient>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 20,
    }
});

export default Bell;