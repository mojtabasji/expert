import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Shadow } from "react-native-shadow-2";

import css from "../constants/css";
import { Exp, Response } from "../constants/Types";
import Icon from "react-native-vector-icons/FontAwesome6";

const ShowOne = (props: any) => {

    const [exp, setExp] = useState({
        title: "",
        content: "",
        image: "",
        user: {
            avatar: ""
        }
    } as Exp);
    const [response, setResponse] = useState([] as Response[]);
    const [scaled_height, setScaledHeight] = useState(0);
    const [comment, setComment] = useState('' as string);


    useEffect(() => {
        setExp(props.route.params.exp);
    }, []);

    useEffect(() => {
        if (exp.responses) setResponse(exp.responses);
        if (exp.image) {
            Image.getSize(exp.image, (width_, height_) => {
                setScaledHeight((height_ * Dimensions.get('window').width) / width_);
            });
        }
    }, [exp]);

    const sendCommnet = () => {
        console.log("send comment");
    }

    return (
        <View style={styles.container}>
            {exp.image &&
                <Image
                    source={{ uri: exp.image }}
                    style={[styles.image, { height: scaled_height }]}
                />
            }
            <ScrollView style={styles.scrollView}>
                {
                    exp.image &&
                    <Icon name="expand" size={20} style={{
                        position: 'absolute',
                        top: scaled_height - 40,
                        right: 10,
                        borderRadius: 20,
                        backgroundColor: "rgba(25, 25, 25, 0.1)",
                        padding: 7,
                        color: css.redesign.lightest,
                        zIndex: 1,
                    }} solid={true}
                        onPress={() => {
                            props.navigation.navigate("FullScreenImage", { images: { url: exp.image } });
                        }}
                    />
                }
                <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={[styles.content, { marginTop: scaled_height }]}>
                    <View style={{
                        height: 2,
                        width: "100%",
                        backgroundColor: css.redesign.supplement2,
                    }}></View>
                    <View style={{
                        marginHorizontal: 20,
                    }}>
                        <Text style={[css.titleText, { fontWeight: "bold", marginTop: 20 }]}>{exp.title}</Text>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            {
                                exp.user.avatar ?
                                    <Image style={styles.avatar} source={{ uri: exp.user.avatar }} />
                                    :
                                    <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
                            }
                            <Text style={[css.normalText, { marginLeft: 10 }]}>{exp.user.username}</Text>
                        </View>
                        <Text style={[css.normalText, { marginVertical: 20 }]}>{exp.content}</Text>
                        {
                            response.map((item, index) => {
                                return (
                                    <View key={index} style={{
                                        paddingVertical: 10,
                                    }}>
                                        <Shadow>
                                            <View style={{
                                                backgroundColor: css.redesign.lightest, borderRadius: 10,
                                                width: Dimensions.get('window').width * 0.9,
                                                padding: 10,
                                            }}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                }}>
                                                    {
                                                        exp.user.avatar ?
                                                            <Image style={styles.avatar} source={{ uri: exp.user.avatar }} />
                                                            :
                                                            <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
                                                    }
                                                    <Text style={[css.smallText, { marginLeft: 10 }]}>{item.user.username}</Text>
                                                </View>
                                                <Text style={[css.smallText, { paddingTop: 15 }]}>{item.content}</Text>
                                            </View>
                                        </Shadow>
                                    </View>
                                );
                            })
                        }
                    </View>
                </LinearGradient>
            </ScrollView>
            <View style={styles.commentArea}>

                <TextInput onChangeText={(text)=>{setComment(text)}} multiline={true} style={styles.input} placeholder="نظر خود را بنویسید" />
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Icon name="paper-plane" size={25} solid={true} color={css.redesign.darker} onPress={sendCommnet} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    scrollView: {
        width: '100%',
        flex: 1,
    },
    image: {
        width: '100%',
        resizeMode: 'cover',
        position: 'absolute',
        top: 0,
        zIndex: 0,
    },
    content: {
        zIndex: 2,
        minHeight: Dimensions.get('window').height - 130,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: css.colors.dark,
    },
    input: {
        flex: 8,
        backgroundColor: css.redesign.lightest,
        borderRadius: 20,
        padding: 10,
    },
    commentArea: {
        width: '100%',
        minHeight: 50,
        backgroundColor: css.redesign.primary,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    }
});

export default ShowOne;