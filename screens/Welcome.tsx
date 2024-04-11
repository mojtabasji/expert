import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LoginHandler from '../constants/LoginHandler';

const { width, height } = Dimensions.get('window');
import css from '../constants/css';
import { StorageHandler } from '../constants/StorageHandler';
import LHandler from './Login/LHandler';


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
                    <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
                        <View style={{ flex: 1, overflow: 'hidden' }}>
                            <Image source={require('../assets/images/LOGO.png')} style={styles.welcome_image} />
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
                                    <Text style={[css.btn_text, { color: css.redesign.lightest }]}>برای شروع وارد شوید</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </LinearGradient>
                    :
                    <LHandler />
            }
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        backgroundColor: css.redesign.darker,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,

    }
});

export default Welcome;
