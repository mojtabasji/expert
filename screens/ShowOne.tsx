import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/FontAwesome6";
import axios from "axios";

import css from "../constants/css";
import { Exp, Response, User } from "../constants/Types";
import { StorageHandler } from "../constants/StorageHandler";
import { api } from "../constants/Const";

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
    const [loggedUserId, setLoggedUserId] = useState(-1 as number);


    useEffect(() => {
        setExp(props.route.params.exp);
        StorageHandler.retrieveData("user_id").then((value) => {
            if (value) setLoggedUserId(parseInt(value));
        });
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

    const changeLikeState = (resp: Response, type: "LIKE" | "DISLIKE", command: "ADD" | "REMOVE") => {
        let form = new FormData();
        form.append("response_id", resp.id.toString());
        form.append("type", type);
        form.append("command", command);
        axios.post(api.changeLikeState, form).then((res) => {
            let data = res.data;
            if (data.result === "true") {
                let newResponse = response.map((item: Response) => {
                    if (item.id === resp.id) {
                        if (type === "LIKE") {
                            if (command === "ADD") {
                                item.likes.push(loggedUserId);
                                if (item.dislikes.includes(loggedUserId)) {
                                    item.dislikes = item.dislikes.filter((id) => id !== loggedUserId);
                                }
                            } else {
                                item.likes = item.likes.filter((id) => id !== loggedUserId);
                            }
                        } else {
                            if (command === "ADD") {
                                item.dislikes.push(loggedUserId);
                                if (item.likes.includes(loggedUserId)) {
                                    item.likes = item.likes.filter((id) => id !== loggedUserId);
                                }
                            } else {
                                item.dislikes = item.dislikes.filter((id) => id !== loggedUserId);
                            }
                        }
                    }
                    return item;
                });
                setResponse(newResponse);
            }
        }).catch((err) => {
            console.log(err);
        });
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
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                        position: 'absolute',
                                                        right: 10,
                                                    }}>
                                                        <Text style={[css.smallText, { marginLeft: 10 }]}>{item.likes.length}</Text>
                                                        <Icon name="thumbs-up" size={15} style={{ color: css.redesign.darker, marginLeft: 10 }} solid={item.likes.includes(loggedUserId)}
                                                        onPress={()=>{changeLikeState(item, "LIKE", item.likes.includes(loggedUserId) ? "REMOVE" : "ADD")}} />
                                                        <Text style={[css.smallText, { marginLeft: 10 }]}>{item.dislikes.length}</Text>
                                                        <Icon name="thumbs-down" size={15} style={{ color: css.redesign.darker, marginLeft: 10 }} solid={item.dislikes.includes(loggedUserId)}
                                                        onPress={()=>{changeLikeState(item, "DISLIKE", item.dislikes.includes(loggedUserId) ? "REMOVE" : "ADD")}} />
                                                    </View>
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

                <TextInput onChangeText={(text) => { setComment(text) }} multiline={true} style={styles.input} placeholder="نظر خود را بنویسید" />
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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