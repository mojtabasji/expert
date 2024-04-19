import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image, Dimensions, ScrollView, TextInput, Alert } from "react-native";
import { Menu, Pressable, HamburgerIcon, Box, ThreeDotsIcon } from 'native-base';
import LinearGradient from "react-native-linear-gradient";
import { Shadow } from "react-native-shadow-2";
import Icon from "react-native-vector-icons/FontAwesome6";
import axios from "axios";

import css from "../constants/css";
import { Exp, Response, User, Report } from "../constants/Types";
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
    const [reportPanel, setReportPanel] = useState({
        description: "",
        content_type: "EXP" as "EXP" | "RESPONSE" | "USER" | "HIGHLIGHT",
        visible: false,
        item: {} as Exp | Response,
    });


    useEffect(() => {
        setExp(props.route.params.exp);
        letsRefresh();
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

    const letsRefresh = () => {
        if (exp.id === undefined) return;
        StorageHandler.retrieveData("session_id").then((session) => {
            axios.get(api.show_exp + `/${exp.id}/${exp.title}`, {
                headers: {
                    Cookie: `session_id=${session};`
                },
            }).then((res) => {
                setExp(res.data as Exp);
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    const delete_response = (resp: Response) => {
        StorageHandler.retrieveData("session_id").then((session) => {
            if (!session) {
                props.navigation.navigate("Login");
                return;
            }
            let form = new FormData();
            form.append("response_id", resp.id.toString());
            axios.post(api.delete_response, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cookie': `session_id=${session};`
                },
            }).then((res) => {
                let data = res.data;
                if (data.result === "true") {
                    letsRefresh();
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    const sendCommnet = () => {
        StorageHandler.retrieveData("session_id").then((session) => {
            let form = new FormData();
            form.append("exp_id", exp.id.toString());
            form.append("content", comment);
            axios.post(api.add_exp_comment, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cookie': `session_id=${session};`
                },
            }).then((res) => {
                let data = res.data;
                if (data.result === "true") {
                    letsRefresh();
                    setComment('');
                }
                else if (data.ww == "true")
                    Alert.alert("خطا", "مقدار وارد شده شامل محتوی نا مناسب است.");
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    const report = () => {
        let detail: string;
        switch (reportPanel.content_type) {
            case "EXP":
                detail = "یک EXP از نوع " + exp.title + " با شناسه " + exp.id + " گزارش شده است.";
                break;
            case "RESPONSE":
                detail = "یک پاسخ ا بر روی exp " + exp.title + " گزارش شده است." + " شناسه پاسخ: " + reportPanel.item.id;
                break;
            case "USER":
                detail = "یک کاربر با نام کاربری " + exp.user.username + " گزارش شده است.";
                break;
            case "HIGHLIGHT":
                detail = "هایلایت کاربر " + reportPanel.item.user.username + " گزارش شده است.";
                break;
            default:
                detail = "خطای ناشناخته";
                break;
        }
        StorageHandler.retrieveData("session_id").then((session) => {
            if (!session) {
                props.navigation.navigate("Login");
                return;
            }
            let form = new FormData();
            form.append("content_type", reportPanel.content_type);
            form.append("content", reportPanel.item.id.toString());
            form.append("description", reportPanel.description);
            form.append("detail", detail);
            axios.post(api.report, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cookie': `session_id=${session};`
                },
            }).then((res) => {
                let data = res.data;
                if (data.result === "true") {
                    setReportPanel({ ...reportPanel, visible: false, description: "" });
                    Alert.alert("گزارش", ". گزارش شما با موفقیت ثبت شد. نتیجه بررسی به اطلاع شما خواهد رسید");
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }

    const changeLikeState = (resp: Response, type: "LIKE" | "DISLIKE", command: "ADD" | "REMOVE") => {
        StorageHandler.retrieveData("session_id").then((session) => {
            if (!session) {
                props.navigation.navigate("Login");
                return;
            }

            let form = new FormData();
            form.append("response_id", resp.id.toString());
            form.append("type", type);
            form.append("command", command);
            axios.post(api.changeLikeState, form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cookie': `session_id=${session};`
                },
            }).then((res) => {
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
        });
    }

    const delete_exp = () => {
        StorageHandler.retrieveData("session_id").then((session) => {
            if (!session) {
                props.navigation.navigate("Login");
                return;
            }
            axios.delete(api.delete_exp, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cookie': `session_id=${session};`
                },
                params: {
                    exp_id: exp.id
                }
            }).then(res => {
                if (res.data.result == "true") props.navigation.goBack();
            })
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
                            marginTop: 20,
                        }}>
                            {
                                exp.user.avatar ?
                                    <Image style={styles.avatar} source={{ uri: exp.user.avatar }} />
                                    :
                                    <Image style={styles.avatar} source={require('../assets/images/user_avatar.png')} />
                            }
                            <Text style={[css.normalText, { marginLeft: 10 }]}>{exp.user.username}</Text>
                            <Box style={{ position: "absolute", top: 10, right: 10 }}>
                                <Menu w="190" trigger={triggerProps => {
                                    return <Pressable {...triggerProps}>
                                        {/* <HamburgerIcon size={10} /> */}
                                        <ThreeDotsIcon size={3} color={css.redesign.darker} />
                                    </Pressable>
                                }}>
                                    {
                                        loggedUserId == exp.user.id &&
                                        <Menu.Item onPress={delete_exp} >حذف</Menu.Item>
                                    }
                                    <Menu.Item onPress={() => {
                                        setReportPanel({ ...reportPanel, visible: true, content_type: "EXP", item: exp })
                                    }}>گزارش</Menu.Item>
                                </Menu>
                            </Box>
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
                                                        <TouchableOpacity
                                                            onPress={() => { changeLikeState(item, "LIKE", item.likes.includes(loggedUserId) ? "REMOVE" : "ADD") }} >
                                                            <Icon name="thumbs-up" size={15} style={{ color: css.redesign.darker, marginLeft: 10 }} solid={item.likes.includes(loggedUserId)} />
                                                        </TouchableOpacity>
                                                        <Text style={[css.smallText, { marginLeft: 10 }]}>{item.dislikes.length}</Text>
                                                        <TouchableOpacity onPress={() => { changeLikeState(item, "DISLIKE", item.dislikes.includes(loggedUserId) ? "REMOVE" : "ADD") }} >
                                                            <Icon name="thumbs-down" size={15} style={{ color: css.redesign.darker, marginLeft: 10 }} solid={item.dislikes.includes(loggedUserId)} />
                                                        </TouchableOpacity>
                                                        <Box style={{ marginLeft: 20 }}>
                                                            <Menu w="190" trigger={triggerProps => {
                                                                return <Pressable {...triggerProps}>
                                                                    <ThreeDotsIcon size={3} color={css.redesign.darker} />
                                                                </Pressable>
                                                            }}>
                                                                {
                                                                    loggedUserId == item.user.id &&
                                                                    <Menu.Item onPress={() => {
                                                                        Alert.alert("حذف پاسخ", "آیا از پاک کردن این پاسخ اطمینان دارید؟", [
                                                                            {
                                                                                text: "بله",
                                                                                onPress: () => delete_response(item),
                                                                            },
                                                                            {
                                                                                text: "خیر",
                                                                            }
                                                                        ])
                                                                    }} >حذف</Menu.Item>
                                                                }
                                                                <Menu.Item onPress={() => {
                                                                    setReportPanel({ ...reportPanel, visible: true, content_type: "RESPONSE", item: item })
                                                                }}>گزارش</Menu.Item>
                                                            </Menu>
                                                        </Box>
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

                <TextInput value={comment} onChangeText={(text) => { setComment(text) }} multiline={true} style={styles.input} placeholder="نظر خود را بنویسید" />
                <TouchableOpacity style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} onPress={sendCommnet}>
                    <Icon name="paper-plane" size={25} solid={true} color={css.redesign.darker} />
                </TouchableOpacity>
            </View>
            {reportPanel.visible &&
                <View style={styles.reportArea}>
                    <TextInput
                        style={[styles.input, { borderWidth: 1, borderColor: css.redesign.primary, minHeight: 100, textAlignVertical: 'top', }]}
                        placeholder="توضیحات گزارش"
                        multiline={true}
                        value={reportPanel.description}
                        onChangeText={(text) => setReportPanel({ ...reportPanel, description: text })}
                    />
                    <View style={{
                        flexDirection: "row",
                        justifyContent: 'space-around',
                        marginTop: 20,

                    }} >
                        <TouchableOpacity style={{
                            backgroundColor: css.redesign.darker,
                            borderRadius: 20,
                            width: "40%",
                            padding: 10,
                            alignItems: 'center',
                        }} onPress={report}>
                            <Text style={[css.normalText, { color: css.redesign.lightest }]}>ارسال گزارش</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor: css.redesign.darker,
                            borderRadius: 20,
                            width: "40%",
                            padding: 10,
                            alignItems: 'center',
                        }} onPress={() => setReportPanel({ item: {} as Exp | Response, visible: false, description: "", content_type: "EXP" })}>
                            <Text style={[css.normalText, { color: css.redesign.lightest }]}>انصراف</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    },
    reportArea: {
        position: 'absolute',
        alignSelf: 'center',
        width: '90%',
        minHeight: 200,
        backgroundColor: css.redesign.lightest,
        borderColor: css.redesign.darker,
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        zIndex: 3,
        top: 100,
    },
});

export default ShowOne;