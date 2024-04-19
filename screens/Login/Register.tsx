import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Box, Checkbox, NativeBaseProvider } from 'native-base';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

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
    const [privacyState, setPrivacyState] = useState(false);

    const [is_username_valid, setIsUsernameValid] = useState(true);
    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);
    const [show_privacy, setShowPrivacy] = useState(false);

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
        if (!privacyState) {
            Alert.alert("شما باید شرایط حریم خصوصی را بپذیرید");
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
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <NativeBaseProvider>
                <ScrollView>
                    <View style={{
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height * .9,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}>
                        <Text style={css.largeText}>ثبت نام</Text>
                        <Text style={[css.normalText, { color: 'gray' }]}>لطفا اطلاعات خود را وارد کنید</Text>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>نام کاربری:</Text>
                            <TextInput style={[css.smallText, styles.Input, {
                                borderWidth: 1,
                                borderColor: is_username_valid ? "green" : 'red',
                            }]} placeholder="نام کاربری"
                                onChangeText={text => setUsername(text)}
                                value={username}
                                onBlur={checkUsernameValidity} />
                        </View>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}> نام و نام خانوادگی:</Text>
                            <TextInput style={[css.smallText, styles.Input]} placeholder="نام و نام خانوادگی"
                                onChangeText={text => setFullname(text)}
                                value={fullname} />
                        </View>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>شماره تلفن:</Text>
                            <TextInput style={[css.smallText, styles.Input]} placeholder="شماره تلفن"
                                onChangeText={text => setPhone(text)}
                                value={phone} />
                        </View>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>رمز عبور:</Text>
                            <TextInput style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="رمز عبور"
                                onChangeText={text => setPassword(text)}
                                value={password}
                                secureTextEntry={true} />
                        </View>
                        <View style={styles.InputArea}>
                            <Text style={[css.normalText, { marginBottom: 10 }]}>تکرار رمز عبور:</Text>
                            <TextInput style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="تکرار رمز عبور" onChangeText={text => setPasswordConfirm(text)}
                                value={password_confirm}
                                secureTextEntry={true} />
                        </View>
                        <View style={styles.InputArea}>
                            <Box style={{
                                flexDirection: "row-reverse",
                                marginVertical: 20,
                                alignItems: 'center'
                            }}>
                                <Checkbox value="success" colorScheme="success" onChange={(state) => { setPrivacyState(state); }} aria-label={"privacy_check"}>
                                </Checkbox>
                                <Text style={[css.smallText, { color: css.redesign.darker, marginHorizontal: 5 }]}>شرایط <Text style={[css.smallText, { color: css.redesign.darker, fontWeight: "bold" }]} onPress={() => { setShowPrivacy(true) }}>حریم خصوصی</Text> را می پذیرم.</Text>
                            </Box>
                        </View>
                        <View style={{
                            width: '100%',
                            alignItems: 'center',
                        }} >
                            <TouchableOpacity style={{
                                width: '75%', height: 40, borderRadius: 20,
                                justifyContent: 'center', alignItems: 'center', marginBottom: 10,
                                backgroundColor: css.redesign.darker,
                            }}
                                onPress={register} >
                                <Text style={[css.smallText, { color: css.redesign.lightest }]}>ثبت نام</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10 }}
                                onPress={() => {
                                    props.change_screen("Login");
                                }}>
                                <Text style={[css.titleText, { color: css.redesign.darker, fontWeight: "bold" }]}>ورود</Text>
                                <Text style={[css.normalText, { color: css.redesign.darker, marginHorizontal: 5 }]}>قبلا ثبت نام کرده ام.</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {
                    show_privacy &&
                    <View style={styles.privacyArea}>
                        <ScrollView contentContainerStyle={{ marginVertical: 20, width: '100%', alignItems: "flex-end", paddingBottom: 30 }} style={{ borderTopWidth: 1, borderBottomWidth: 1 }}>

                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                اطلاعات دریافتی از شما به شرح زیر است.
                            </Text>
                            <Text style={[css.normalText, { marginTop: 10, fontWeight: "bold" }]}>نام کاربری:</Text>
                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                • نام کاربری شما به صورت  یکتا بوده و نمی تواند تغییر کند.
                            </Text>
                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                • نام کاربری به صورت عمومی نمایش داده می شود.
                            </Text>
                            <Text style={[css.normalText, { marginTop: 10, fontWeight: "bold" }]}>نام و نام خانوادگی:</Text>
                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                • نام و نام خانوادگی شما صرفا برای نمایش در پروفایل شما استفاده می شود و به صورت عمومی قابل مشاهده است.
                            </Text>
                            <Text style={[css.normalText, { marginTop: 10, fontWeight: "bold" }]}>شماره تلفن:</Text>
                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                • شماره تلفن شما برای تایید حساب کاربری استفاده خواهد شد. و به صورت خصوصی نگهداری  شده و برای سایر کاربران قابل مشاهده نیست.
                            </Text>
                            <Text style={[css.normalText, { marginTop: 10, fontWeight: "bold" }]}>رمز عبور:</Text>
                            <Text style={[css.normalText, { marginTop: 10 }]}>
                                • رمز عبور شما به صورت رمزنگاری شده ذخیره می شود و به هیچ عنوان به دیگران نمایش داده نمی شود.
                            </Text>
                        </ScrollView>
                        <TouchableOpacity style={{
                            width: '75%', borderRadius: 20, paddingVertical: 5,
                            justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 20,
                            backgroundColor: css.redesign.darker,
                        }}
                            onPress={() => {
                                setShowPrivacy(false);
                            }}>
                            <Text style={[css.normalText, { color: css.redesign.lightest, textAlign: 'center' }]}>تایید</Text>
                        </TouchableOpacity>
                    </View>
                }
            </NativeBaseProvider>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20
    },
    form_input: {
        width: '75%',
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    InputArea: {
        width: '80%',
    },
    Input: {
        backgroundColor: css.redesign.lightest,
        borderRadius: 10,
        paddingHorizontal: 10,
    },
    privacyArea: {
        position: 'absolute',
        width: Dimensions.get("window").width * .9,
        height: Dimensions.get("window").height * .85,
        backgroundColor: css.redesign.lightest,
        borderWidth: 1,
        borderColor: css.redesign.darker,
        alignSelf: 'center',
        borderRadius: 20,
        opacity: 1,
        marginTop: 30,
        padding: 10,
        alignItems: 'center',
    }
});

export default Register;