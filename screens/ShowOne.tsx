import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView } from "react-native";

import css from "../constants/css";
import { Exp, Responses } from "../constants/Types";

const ShowOne = (props: any) => {

    const [exp, setExp] = useState({
        title: "",
        content: "",
        image: "",
        user: {
            avatar: ""
        }
    } as Exp);
    const [response, setResponse] = useState([] as Responses[]);
    const [scaled_height, setScaledHeight] = useState(300);


    useEffect(() => {
        setExp(props.route.params.exp);
        if (exp.image) {
            Image.getSize(exp.image, (width_, height_) => {
                setScaledHeight((height_ * Dimensions.get('window').width * 0.95) / width_);
            });
        }
    }, []);

    useEffect(() => {
        if (exp.responses) setResponse(exp.responses);
    }, [exp]);

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
                <View style={{ width: Dimensions.get('window').width }}>
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
                            <TouchableOpacity onPress={()=>{
                                props.navigation.navigate("FullScreenImage", { images: {
                                    url: exp.image
                                } });
                            }}>
                            <Image style={{
                                width: '100%',
                                height: scaled_height,
                                resizeMode: "cover", margin: 1,
                            }} source={{ uri: exp.image }} />
                            </TouchableOpacity>
                        }
                        <View style={{
                            paddingHorizontal: 10,
                        }}>
                            <Text style={[css.normalText, { textAlign: "justify", marginVertical: 5 }]}>{exp.title}</Text>
                            <Text style={[css.minimalText, { textAlign: "justify", }]}>{exp.content}</Text>
                        </View>
                    </View>
                    {
                        exp.user.avatar ?
                            <Image style={styles.avatar} source={{ uri: exp.user.avatar }} />
                            :
                            <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
                    }
                    {
                        response.map((item, index) => {
                            return (
                                <View key={index}>
                                    <View key={index} style={styles.responseArea}>
                                        <Text style={[css.minimalText, { textAlign: "justify", marginVertical: 5 }]}>{item.content}</Text>
                                    </View>
                                    {
                                        item.user.avatar ?
                                            <Image style={styles.avatar} source={{ uri: item.user.avatar }} />
                                            :
                                            <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
                                    }
                                </View>
                            );
                        })
                    }
                </View>
            </ScrollView>
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
        marginLeft: 10,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: css.colors.dark,
    },
    responseArea: {
        width: "96%",
        backgroundColor: css.colors.gray,
        borderColor: css.colors.light_dark,
        borderWidth: 2,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderBottomRightRadius: 15,
        margin: 5,
        paddingHorizontal: 10,
    },
});

export default ShowOne;