import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image,
    TouchableOpacity, Linking
} from 'react-native';
import axios from 'axios';

import css from '../../constants/css';
import { api } from '../../constants/Const';
import { User, Skill } from '../../constants/Types';
import { StorageHandler } from '../../constants/StorageHandler';

const TopUserDetail = (props: any) => {
    const [topUserId, setTopUserId] = useState(props.route.params.topUserId);
    const [topUser, setTopUser] = useState({
        username: '',
        fullname: '',
        avatar: '',
        phone: '',
        bio: '',
        is_top: true,
        top_background: '',
        top_link: '',
        skills: [],
    });

    useEffect(() => {
        StorageHandler.retrieveData('session').then(session => {
            axios.get(api.get_top_users_detail, {
                headers: {
                    Cookie: `session_id=${session};`
                },
                params: {
                    user_id: topUserId
                }
            })
                .then(res => {
                    setTopUser(res.data);
                })
                .catch(err => console.log(err));
        });
    }, []);

    return (
        <View style={styles.container}>
            <Image source={{ uri: topUser.top_background }} style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: -1,
            }} />
            <Image source={{ uri: topUser.avatar }} style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'white',
                marginBottom: 10,
            }} />
            <Text style={css.normalText}>{topUser.username}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(topUser.top_link)}>
                <Text style={css.normalText}>{topUser.top_link}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TopUserDetail;