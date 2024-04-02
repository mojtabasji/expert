import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions } from "react-native";

import css from "../constants/css";

const ShowOne = (props: any) => {

    const [exp, setExp] = useState({
        title: "noting yet", image: "", content: "", user: {
            avatar: "",
        }
    });
    const [scaled_height, setScaledHeight] = useState(300);
    useEffect(() => {
        setExp(props.route.params.exp);
        try {

            Image.getSize(exp.image.replace("https", "http"), (width_, height_) => {
                setScaledHeight((height_ * Dimensions.get('window').width * 0.95) / width_);
            });
        } catch { }
    }, []);

    return (
        <View style={styles.container}>
            <View style={{
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                borderBottomRightRadius: 15,
                width: "96%",
                backgroundColor: css.colors.cyan,
                borderColor: css.colors.cyan,
                overflow: "hidden",
                borderWidth: 2,
                margin: 5,
            }}>
                {
                    exp.image &&
                    <Image style={{
                        width: '100%',
                        height: scaled_height,
                        resizeMode: "cover", margin: 1,
                    }} source={{ uri: exp.image.replace("https", "http") }} />
                }
                <View style={{
                    paddingHorizontal: 10,
                }}>
                    <Text style={[css.minimalText, { textAlign: "justify", }]}>{exp.content}</Text>
                </View>
            </View>
            {
                exp.user.avatar ?
                    <Image style={styles.avatar} source={{ uri: exp.user?.avatar }} />
                    :
                    <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginLeft:10,
        marginBottom:20,
    }
});

export default ShowOne;