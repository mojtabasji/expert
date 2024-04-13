import React, { useEffect, useState, useRef, } from 'react';
import {
    View, Text, StyleSheet, Image, Easing,
    TouchableOpacity, Linking, Animated,
    Dimensions,
} from 'react-native';
import axios from 'axios';

import css from '../../constants/css';
import { api } from '../../constants/Const';
import { User, Skill } from '../../constants/Types';
import { StorageHandler } from '../../constants/StorageHandler';

const LineLoadingBar = (props: any) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 10000, // 5 seconds
            useNativeDriver: false,
        }).start(()=>{
            props.onFinished();
        });
    }, [animation]);

    const width = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.loading_container}>
            <Animated.View style={[styles.bar, { width }]} />
        </View>
    );
};

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
                    console.log(res.data.user);
                    setTopUser(res.data.user);
                })
                .catch(err => console.log(err));
        });
    }, []);

    return (
        <View style={styles.container}>
            <LineLoadingBar onFinished={()=>{
                props.navigation.goBack();
            }} />
            <Image source={{ uri: topUser.top_background }} style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: -1,
                resizeMode: 'stretch',
            }} />
            <Image source={{ uri: topUser.avatar }} style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                borderWidth: 2,
                borderColor: 'white',
                position: 'absolute',
                bottom: 30,
                right: 30,
            }} />
            <Text style={[css.normalText, {
                color: css.redesign.lightest,
                position: 'absolute',
                bottom: 5,
                right: 20,
            }]}>{topUser.username}</Text>
            <TouchableOpacity style={{
                position: 'absolute',
                bottom: 100,
                left: 30,
            }} onPress={() => Linking.openURL(topUser.top_link)}>
                <Text style={[css.normalText, { color: css.redesign.supplement }]}>{topUser.top_link}</Text>
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
    loading_container: {
        width: '100%',
        height: 5,
        borderRadius: 5,
        overflow: 'hidden',
        position: 'absolute',
        top: 0
    },
    bar: {
        height: '100%',
        backgroundColor: css.redesign.supplement,
    },
});

export default TopUserDetail;