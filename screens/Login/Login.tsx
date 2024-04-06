import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { api } from '../../constants/Const';

import LoginHandler from '../../constants/LoginHandler';
import { StorageHandler } from '../../constants/StorageHandler';
import css from '../../constants/css';


const Login = (props: any) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);

    const login = async () => {
        if(username == '' || password == '') {
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
        console.log(api.login, form);
        axios.post(api.login, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add any other headers if needed
                'Cookie': 'cookie1=value1; cookie2=value2' // Include cookies here
            },
            withCredentials: true,
        }).then(async (response) => {
            if (response.data.result == "true") {
                console.log(response.data);
                await StorageHandler.storeData("session_id", response.data.session_id).then(() => {console.log("session_id stored");});
                StorageHandler.retrieveData("session_id").then(data => { console.log("session_id retrieved:", data); });
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
        <View style={styles.container}>
            <View style={styles.logoArea}>
                <Image source={require('../../assets/images/startup3.png')} style={styles.logoImage} />
            </View>
            <View style={styles.optionsArea}>
                <Text style={css.largeText}>ورود</Text>
                <Text style={[css.normalText, { color: 'gray' }]}>با حساب کاربری خود وارد شوید</Text>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '85%',
                }} >
                    <Icon name="comment" size={30} color="#000" />
                    <TextInput
                        style={styles.input}
                        placeholder="نام کاربری"
                        onChangeText={(text) => setUsername(text)}
                        value={username}
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    width: '85%',
                }} >
                    <Icon name="heart" size={30} color="#000" />
                    <TextInput
                        style={styles.input}
                        placeholder="رمز عبور"
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <TouchableOpacity style={{
                    width: '75%',
                    height: 40,
                    borderRadius: 30,
                    backgroundColor: css.colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                    onPress={login}
                >
                    <Text style={css.btn_text}>ورود</Text>
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
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: css.colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <Text style={css.btn_text}>فیسبوک</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        width: '45%',
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: css.colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        onPress={() => {
                        }} >
                        <Text style={css.btn_text}>گوگل</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                    onPress={()=>{
                        props.change_screen("Register");
                    }}
                    >
                        <Text style={css.btn_text}>ثبت نام</Text>
                    </TouchableOpacity>
                    <Text style={[css.smallText, { color: 'gray' }]}>حساب کاربری ندارید؟</Text>
                </View>
            </View>
        </View >
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
        flex: 2,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    input: {
        borderRadius: 30,
        width: '80%',
        height: 40,
        borderWidth: 1,
        paddingHorizontal: 10,
    }
});

export default Login;
