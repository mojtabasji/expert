import React, { useEffect, useState, useRef, } from 'react';
import {
    View, Text, StyleSheet, Image, Easing,
    TouchableOpacity, Linking, Animated,
    Dimensions, Alert, TextInput
} from 'react-native';
import { Box, Menu, ThreeDotsIcon, Pressable } from 'native-base';
import axios from 'axios';

import css from '../../constants/css';
import { api } from '../../constants/Const';
import { User, Skill, Exp } from '../../constants/Types';
import { StorageHandler } from '../../constants/StorageHandler';

const LineLoadingBar = (props: any) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: 1,
            duration: 10000, // milliseconds
            useNativeDriver: false,
        }).start(() => {
            props.onFinished();
        });
    }, [animation]);

    const width = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.loading_container}>
            <Animated.View style={[styles.bar, { width }]} />
        </View>
    );
};

const TopUserDetail = (props: any) => {
    const [topUserId, setTopUserId] = useState(props.route.params.topUserId);
    const [topUser, setTopUser] = useState({
        username: '',
        fullname: '',
        avatar: '',
        phone: '',
        bio: '',
        is_top: true,
        top_background: '',
        top_link: '',
        skills: [],
    });
    const [reportPanel, setReportPanel] = useState({
        description: "",
        content_type: "HIGHLIGHT" as "EXP" | "RESPONSE" | "USER" | "HIGHLIGHT",
        visible: false,
        item: {} as {
            id: string,
        }
    });


    const report = () => {
        let detail: string = "هایلایت این کاربر توسط کاربری گزارش تخلف شده است."
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
                    setReportPanel({ ...reportPanel, visible: false });
                    Alert.alert("گزارش", ". گزارش شما با موفقیت ثبت شد. نتیجه بررسی به اطلاع شما خواهد رسید");
                }
            }).catch((err) => {
                console.log(err);
            });
        });
    }


    useEffect(() => {
        StorageHandler.retrieveData('session').then(session => {
            axios.get(api.get_top_users_detail, {
                headers: {
                    Cookie: `session_id=${session};`
                },
                params: {
                    user_id: topUserId
                }
            })
                .then(res => {
                    console.log(res.data.user);
                    setTopUser(res.data.user);
                })
                .catch(err => console.log(err));
        });
    }, []);

    return (
        <View style={styles.container}>
            <LineLoadingBar onFinished={() => {
                props.navigation.goBack();
            }} />
            <Image source={{ uri: topUser.top_background }} style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                zIndex: -1,
                resizeMode: 'stretch',
            }} />
            <View style={{
                position: 'absolute',
                bottom: 10,
                width: "100%",
                paddingHorizontal: 20,
                flexDirection: 'row',
                justifyContent: "space-between",
            }}>
                <Box style={{}}>
                    <Menu w="190" trigger={triggerProps => {
                        return <Pressable {...triggerProps}>
                            {/* <HamburgerIcon size={10} /> */}
                            <ThreeDotsIcon size={10} color={css.redesign.lightest} />
                        </Pressable>
                    }}>
                        <Menu.Item onPress={() => {
                            setReportPanel({ ...reportPanel, visible: true, content_type: "HIGHLIGHT", item: { id: topUserId } })
                        }}>گزارش</Menu.Item>
                    </Menu>
                </Box>
                <View style={{ flexDirection: 'row-reverse', alignItems: "center" }}>
                    <Image source={{ uri: topUser.avatar }} style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        borderWidth: 2,
                        borderColor: 'white',
                    }} />
                    <Text style={[css.normalText, {
                        color: css.redesign.lightest,
                        marginHorizontal:5,
                    }]}>{topUser.username}</Text>
                </View>
            </View>
            <TouchableOpacity style={{
                position: 'absolute',
                bottom: 100,
                left: 30,
            }} onPress={() => Linking.openURL(topUser.top_link)}>
                <Text style={[css.normalText, { color: css.redesign.supplement }]}>{topUser.top_link}</Text>
            </TouchableOpacity>
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
                        }} onPress={() => setReportPanel({ item: { id: "" }, visible: false, description: "", content_type: "HIGHLIGHT" })}>
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    loading_container: {
        width: '100%',
        height: 5,
        borderRadius: 5,
        overflow: 'hidden',
        position: 'absolute',
        top: 0
    },
    bar: {
        height: '100%',
        backgroundColor: css.redesign.supplement,
    },
    input: {
        flex: 8,
        backgroundColor: css.redesign.lightest,
        borderRadius: 20,
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

export default TopUserDetail;