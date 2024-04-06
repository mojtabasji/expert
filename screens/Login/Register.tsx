import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';

import LoginHandler from '../../constants/LoginHandler';
import { StorageHandler } from '../../constants/StorageHandler';
import { api } from '../../constants/Const';
import css from '../../constants/css';

const Register = (props: any) => {
    const [phone, setPhone] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password_confirm, setPasswordConfirm] = useState("");
    const [fullname, setFullname] = useState("");

    const [is_username_valid, setIsUsernameValid] = useState(true);
    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);

    const checkUsernameValidity = () => {
        axios.get(api.is_username_valid + "username=" + username).then(response => {
            if (response.data.result == "true") {
                setIsUsernameValid(true);
            } else {
                setIsUsernameValid(false);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const register = () => {
        if (!is_username_valid) {
            Alert.alert("نام کاربری قبلا ثبت شده است");
            return;
        }
        if (password != password_confirm) {
            Alert.alert("رمز عبور و تکرار آن باید یکسان باشد");
            return;
        }
        let form = new FormData();
        form.append("username", username);
        form.append("password", password);
        form.append("phone", phone);
        form.append("fullname", fullname);
        axios.post(api.register, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add any other headers if needed
                'Cookie': 'cookie1=value1; cookie2=value2' // Include cookies here
            },
            withCredentials: true,
        }).then(async (response) => {
            if (response.data.result == "true") {
                console.log(response.data);
                await StorageHandler.storeData("session_id", response.data.session_id).then(() => { console.log("session_id stored"); });
                updateLoggedIn(true);
            } else {
                Alert.alert("خطا در ثبت نام");
            }
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{
                    width: Dimensions.get("window").width * .9,
                    height: Dimensions.get("window").height,
                    justifyContent: 'space-around',
                    alignItems: 'center',
                }}>
                    <View style={{
                        width: '100%',
                        paddingHorizontal: 20,
                    }}>
                        <Text>نام کاربری</Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <TextInput
                                style={[styles.form_input, {
                                    borderBottomColor: is_username_valid ? 'gray' : 'red',
                                    color: is_username_valid ? 'black' : 'red',
                                }]}
                                onChangeText={text => setUsername(text)}
                                value={username}
                                onBlur={checkUsernameValidity}
                            />
                            {
                                is_username_valid ?
                                    <Icon name="check" size={20} color="green" />
                                    :
                                    <Icon name="times" size={20} color="red" />
                            }
                        </View>
                        <Text>نام و نام خانوادگی</Text>
                        <TextInput
                            style={styles.form_input}
                            onChangeText={text => setFullname(text)}
                            value={fullname}
                        />
                        <Text>شماره تلفن</Text>
                        <TextInput
                            style={styles.form_input}
                            onChangeText={text => setPhone(text)}
                            value={phone}
                        />
                        <Text>رمز عبور</Text>
                        <TextInput
                            style={styles.form_input}
                            onChangeText={text => setPassword(text)}
                            value={password}
                            secureTextEntry={true}
                        />
                        <Text>تکرار رمز عبور</Text>
                        <TextInput
                            style={styles.form_input}
                            onChangeText={text => setPasswordConfirm(text)}
                            value={password_confirm}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={{
                        width: '100%',
                        alignItems: 'center',
                    }} >
                        <TouchableOpacity style={{
                            width: '75%', height: 40, borderRadius: 20,
                            justifyContent: 'center', alignItems: 'center', marginBottom: 10 ,
                            backgroundColor: css.colors.primary,
                            }} 
                            onPress={register} >
                            <Text>ثبت نام</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => {
                                props.change_screen("Login");
                            }}>
                            <Text>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    form_input: {
        width: '75%',
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
});

export default Register;