import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

import LoginHandler from '../../constants/LoginHandler';
import { StorageHandler } from '../../constants/StorageHandler';
import css from '../../constants/css';
import { api } from '../../constants/Const';


const Login = (props: any) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);

    const login = async () => {
        if (username == '' || password == '') {
            Alert.alert(
                "خطا",
                "لطفا نام کاربری و رمز عبور را وارد کنید",
                [
                    {
                        text: "باشه",
                        onPress: () => console.log("OK Pressed")
                    }
                ],
                { cancelable: false }
            );
            return;
        }
        let form = new FormData();
        form.append("username", username);
        form.append("password", password);
        axios.post(api.login, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add any other headers if needed
                'Cookie': 'cookie1=value1; cookie2=value2' // Include cookies here
            },
            withCredentials: true,
        }).then(async (response) => {
            if (response.data.result == "true") {
                await StorageHandler.storeData("session_id", response.data.session_id).then(() => { console.log("session_id stored"); });
                await StorageHandler.storeData("user_id", response.data.userId.toString()).then(() => { console.log("user_id stored"); });
                updateLoggedIn(true);
            } else {
                // alert("incorrect user password");
                Alert.alert(
                    "خطا",
                    "نام کاربری یا رمز عبور اشتباه است",
                    [
                        {
                            text: "باشه",
                            onPress: () => console.log("OK Pressed")
                        }
                    ],
                    { cancelable: false }
                );
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    }

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <ScrollView contentContainerStyle={{}}>
                <View style={{ flex: 1, width: Dimensions.get("window").width, height: Dimensions.get("window").height }}>
                    <View style={styles.logoArea}>
                        <Image source={require('../../assets/images/vue-logo.png')} style={styles.logoImage} />
                    </View>
                    <View style={styles.optionsArea}>
                        <Text style={css.largeText}>ورود</Text>
                        <Text style={[css.normalText, { color: 'gray' }]}>با حساب کاربری خود وارد شوید</Text>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>نام کاربری:</Text>
                            <TextInput style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="نام کاربری" onChangeText={(text) => setUsername(text)}
                                value={username} />
                        </View>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>رمز عبور:</Text>
                            <TextInput style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="رمز عبور" onChangeText={(text) => setPassword(text)}
                                value={password}
                                secureTextEntry={true} />
                        </View>
                        <TouchableOpacity style={{
                            width: '75%',
                            borderRadius: 30,
                            backgroundColor: css.redesign.darker,
                            justifyContent: 'center',
                            alignItems: 'center',
                            paddingVertical: 5,
                        }}
                            onPress={login}
                        >
                            <Text style={[css.btn_text, { color: css.redesign.lightest }]}>ورود</Text>
                        </TouchableOpacity>
                        <Text style={[css.smallText,]}>ورود با</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                            width: '75%',
                        }} >
                            <TouchableOpacity style={{
                                width: '45%',
                                paddingVertical: 5,
                                borderRadius: 20,
                                backgroundColor: css.redesign.gray,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                                onPress={() => {
                                }} >
                                <Text style={[css.btn_text, { color: css.redesign.lightest }]}>گوگل</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    props.change_screen("Register");
                                }}
                            >
                                <Text style={css.btn_text}>ثبت نام</Text>
                            </TouchableOpacity>
                            <Text style={[css.smallText, { color: 'gray' }]}>حساب کاربری ندارید؟</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </LinearGradient >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    logoArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    optionsArea: {
        flex: 3,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingBottom: 20,
    },
    InputArea: {
        width: '80%',
    },
    Input: {
        backgroundColor: css.redesign.lightest,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
});

export default Login;
