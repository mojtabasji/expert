import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';

import { notifications } from '../../assets/data';
import { Notification } from '../../constants/types';
import css from '../../constants/css';
import { ScrollView } from 'native-base';
import { api } from '../../constants/Const';


const Bell = (Props: any) => {
    const [notifications, setNotifications] = useState([] as Notification[]);

    useEffect(() => {
        axios.get(api.get_notifications).then(res => {
            setNotifications(res.data);
        }).catch(err => {
            console.log(err);
        });
    }, []);

    const setRead = (notification: Notification) => {
        axios.get(api.set_notification_read + `?id=${notification.id}`).then(res => {
            console.log(res.data);
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <View style={styles.container}>
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
                                    notification.is_read = true;
                                    Props.navigation.navigate('ShowOneExp', { exp: notification.exp })
                                }}>
                                    <Image source={{ uri: notification.exp.image ? notification.exp.image : notification.user.avatar }} style={{ width: 50, height: 50, borderRadius: 20 }} />
                                    <View style={{ marginLeft: 10, flexDirection: "row" }}>
                                        <Text>{notification.user.fullname}</Text>
                                        <Text>{notification.content}</Text>
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
        </View>
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