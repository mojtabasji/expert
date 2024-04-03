import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginHandler from '../constants/LoginHandler';

const { width, height } = Dimensions.get('window');
import css from '../constants/css';
import { StorageHandler } from '../constants/StorageHandler';
import Login from './Login';


const Welcome = (props: any) => {
    const [showWelcome, setShowWelcome] = useState(true);
    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);
    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    };

    return (
        <>
            {
                showWelcome ?
                    <View style={styles.container}>
                        <View style={{ flex: 1, overflow: 'hidden' }}>
                            <Image source={require('../assets/images/startup1.png')} style={styles.welcome_image} />
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, }} >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'transparent', 'transparent']}
                                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: "100%" }}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                    />
                                </View>
                                <View style={{ flex: 1, }} >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'transparent', 'transparent']}
                                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: "100%" }}
                                        start={{ x: 1, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                    />
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, }} >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'transparent', 'transparent']}
                                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: "100%" }}
                                        start={{ x: 0, y: 1 }}
                                        end={{ x: 1, y: 0 }}
                                    />
                                </View>
                                <View style={{ flex: 1, }} >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.9)', 'transparent', 'transparent']}
                                        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: "100%" }}
                                        start={{ x: 1, y: 1 }}
                                        end={{ x: 0, y: 0 }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.optionsArea}>
                            <Text style={css.largeText}>به اکسپرت خوش آمدید</Text>
                            <Text style={[css.normalText, { color: 'gray', width: '80%' }]}>سوالات خود را از متخصص بپرسید و به سوالاتی که در آن تخصص دارید پاسخ دهید.</Text>
                            <View style={{
                                height: '50%', width: '100%',
                                flexDirection: 'row-reverse',
                                justifyContent: 'space-evenly', alignItems: 'center',
                            }}>
                                <TouchableOpacity style={styles.btn} onPress={() => {
                                    StorageHandler.retrieveData("session_id").then((data) => {
                                        if (data != undefined) {
                                            updateLoggedIn(true);
                                        } else {
                                            setShowWelcome(false);
                                        }
                                    })
                                }}>
                                    <Text style={css.btn_text}>برای شروع وارد شوید</Text>
                                </TouchableOpacity>
                                <View style={styles.btn}>
                                    <Text style={css.btn_text}>ثبت نام</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                    :
                    <Login />
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    welcome_image: {
        width: width,
        height: height / 2,
        // borderRadius: width / 2,
        position: 'absolute',
    },
    optionsArea: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    btn: {
        backgroundColor: '#45cafc',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,

    }
});

export default Welcome;
