import React from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import css from '../assets/css';

interface Props {
    navigation: any,
}

const Login = (props: Props) => {

    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoArea}>
                <Image source={require('../assets/images/startup3.png')} style={styles.logoImage} />
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
                        keyboardType="phone-pad" />
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
                        placeholder="نام کاربری"
                        keyboardType="phone-pad" />
                </View>
                <TouchableOpacity style={{
                    width: '75%',
                    height: 40,
                    borderRadius: 30,
                    backgroundColor: css.colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onPress={()=>{change_screen("BTabHandler");}}
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
                    }}>
                        <Text style={css.btn_text}>گوگل</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity>
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
