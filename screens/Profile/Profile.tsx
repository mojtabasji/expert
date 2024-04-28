import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Alert, Dimensions, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { Menu, Pressable, HamburgerIcon, Box, ThreeDotsIcon } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { Shadow } from 'react-native-shadow-2';

import { } from '../../constants/Components';
import LoginHandler from '../../constants/LoginHandler';
import css from '../../constants/css';
import data, { top_users } from '../../assets/data';
import TabView from '../../constants/TabView';
import { StorageHandler } from '../../constants/StorageHandler';
import { api } from '../../constants/Const';
import { Exp, Skill, User } from '../../constants/Types';


const Profile = (Props: any) => {
    const tabs = [{ name: "مبحث" }, { name: "پاسخ" }];

    const [user, setUser] = useState({
        avatar: null,
    } as User);
    const [areaContent, setAreaContent] = useState(tabs[0].name);
    const [expContent, setExpContent] = useState([] as Exp[]);

    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);
    const [session_id, setSession_id] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const [expsFetch, setExpsFetch] = useState(false);


    useEffect(() => {
        setRefreshing(false);
        StorageHandler.retrieveData("session_id").then((session) => {
            StorageHandler.retrieveData("user_id").then((uid) => {
                if (session) {
                    setSession_id(session);
                    axios.get(api.get_user_info + uid, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `session_id=${session}`
                        }
                    }).then((response) => {
                        setUser(response.data as User);
                    }).catch((error) => { console.log(error); });
                }
            });
        });
    }, []);

    useEffect(() => {
        if (session_id == "") return;
        if (refreshing) return;
        setExpsFetch(true);
        setExpContent([]);
        if (areaContent == tabs[0].name) {
            axios.get(api.my_exps, {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `session_id=${session_id};`
                }
            }).then((response) => {
                let data = response.data as Exp[];
                setExpContent(data.reverse());
            }).catch((error) => { console.log(error); }).finally(() => { setExpsFetch(false); });
        } else {
            axios.get(api.my_responses + `?user_id=${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `session_id=${session_id}`
                }
            }).then((response) => {
                let data = response.data as Exp[];
                setExpContent(data.reverse());
            }).catch((error) => { console.log(error); }).finally(() => { setExpsFetch(false); });
        }
    }, [areaContent, session_id, refreshing]);

    const onRefresh = () => {
        setRefreshing(true);
        StorageHandler.retrieveData("session_id").then((session) => {
            StorageHandler.retrieveData("user_id").then((uid) => {
                if (session) {
                    setSession_id(session);
                    axios.get(api.get_user_info + uid, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `session_id=${session}`
                        }
                    }).then((response) => {

                        setUser(response.data);
                    }).catch((error) => { console.log(error); });
                }
                if (uid == null) {
                    updateLoggedIn(false);
                }
            });
        }).then(() => { setRefreshing(false); });
    };

    const uploadAvatar = () => {
        launchImageLibrary({
            mediaType: "photo",
            quality: 1,
        }, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.errorCode) {
                console.log("ImagePicker Error: ", response.errorMessage);
            } else {
                if (response.assets == null) return;
                const data = new FormData();
                data.append("profile", {
                    name: response.assets[0].fileName,
                    type: response.assets[0].type,
                    uri: response.assets[0].uri
                });
                axios.post(api.uploadProfileImage, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Cookie': `session_id=${session_id}`
                    },
                }).then((response) => {
                    setUser({ ...user, avatar: response.data.url });
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }

    const topUserRequest = () => {
        let form = new FormData();
        form.append("sender_name", user.username);
        form.append("sender_email", user.phone);
        form.append("message_body", `user information: Id: ${user.id}, fullname: ${user.fullname}, bio: ${user.bio}, phone: ${user.phone}`);
        form.append("subject", "درخواست اضافه شدن به هایلایت ها از نسخه موبایل");
        axios.post(api.add_me2tops, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
            Alert.alert("درخواست شما ثبت شد. پس از تایید مدیر اضافه خواهید شد.");
        }).catch(err => console.log(err));
    }

    const LogOut = () => {
        console.log("Log out");
        StorageHandler.removeData("session_id").then(() => {
            updateLoggedIn(false);
        });
        StorageHandler.removeData("user_id").then(() => { });
    }

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={100} // Adjust the offset as needed for the elastic effect
                    />
                }>
                <View style={styles.topArea}>
                    <Box style={{ position: "absolute", top: 10, right: 10 }}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable {...triggerProps}>
                                {/* <HamburgerIcon size={10} /> */}
                                <ThreeDotsIcon size={8} color={css.redesign.darker} />
                            </Pressable>
                        }}>
                            <Menu.Item onPress={topUserRequest}>اضافه شدن به هایلایت</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("EditProfile", { user: user });
                            }}>ویرایش پروفایل</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("SkillsEdit", { user: user });
                            }}>ویرایش مهارت ها</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("Settings", { user: user });
                            }}>تنظیمات</Menu.Item>
                            <Menu.Item style={{ borderTopWidth: 1, borderTopColor: css.colors.fourth }} onPress={() => {
                                Alert.alert("خروج", "آیا مطمین هستید که میخواهید از حساب کاربری خود خارج شودید؟", [
                                    {
                                        text: "بله",
                                        onPress: LogOut,
                                    },
                                    {
                                        text: "حیر",
                                    }
                                ]);
                            }}>خروج</Menu.Item>
                        </Menu>
                    </Box>
                    <Text style={styles.topTitle}>{user.username}</Text>
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <TouchableOpacity onPress={uploadAvatar}>
                            {
                                user.avatar ?
                                    <Image style={styles.avatar} source={{ uri: user.avatar }} alt='' />
                                    :
                                    <Image style={styles.avatar} alt='' source={require('../../assets/images/user_avatar.png')} />
                            }
                            <View style={{
                                position: "absolute", bottom: 10, right: 0,
                                backgroundColor: css.redesign.darker,
                                padding: 8,
                                borderRadius: 16,
                                justifyContent: "center",
                                alignItems: "center",
                            }}>
                                <Icon name="pen" size={12} color={css.colors.white} />
                            </View>
                        </TouchableOpacity>
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignItems: "center",
                            paddingHorizontal: 40,
                        }}>
                            <View style={{
                                alignItems: "center",
                            }}>
                                <Text style={styles.btnText}>{user.exps_count}</Text>
                                <Text style={styles.btnText}>مبحث ها</Text>
                            </View>
                            <View style={{
                                alignItems: "center",
                            }}>
                                <Text style={styles.btnText}>{user.answers_count}</Text>
                                <Text style={styles.btnText}>پاسخ ها</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{user.fullname}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    <View style={styles.skillsArea}>
                        {
                            user.skills && user.skills.map((item, index) => {
                                return (
                                    <View style={{ margin: 5 }} key={index}>
                                        <Shadow style={{
                                            borderRadius: 20,
                                            backgroundColor: css.redesign.lightest,
                                        }} distance={10}>
                                            <Text style={{
                                                marginHorizontal: 10,
                                                marginVertical: 5,
                                                color: css.redesign.darker,
                                                textAlign: "center",
                                            }}>{item.name}</Text>
                                        </Shadow>
                                    </View>
                                );
                            })
                        }
                    </View>
                </View>
                <TabView items={tabs} onChange={(tabName) => {
                    setAreaContent(tabName);
                }}
                    Colors={{
                        backgroundColor: css.redesign.gray,
                        textColor: css.redesign.lightest,
                        itemColor: css.redesign.darker,
                        selectedTextColor: css.redesign.lightest,
                    }}
                />
                <View style={styles.bottomArea}>
                    <View style={styles.expArea}>
                        <ActivityIndicator size="large" color={css.redesign.darker} animating={expsFetch} style={{
                            position: "absolute", alignSelf: "center", top: 100, zIndex: 1,
                        }} />
                        {
                            expContent.length === 0 ? <Text style={{ alignSelf: "center", }}>مبحثی وجو ندارد</Text> :
                                expContent.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <Shadow style={{
                                                marginBottom: 20
                                            }} distance={10} >
                                                <TouchableOpacity style={styles.expItem}
                                                    onPress={() => {
                                                        Props.navigation.navigate("PShowOneExp", { exp: item });
                                                    }}
                                                >
                                                    {
                                                        item.image &&
                                                        <Image source={{ uri: item.image }} alt='' style={{ width: Dimensions.get("window").width - 20, height: 300, borderTopLeftRadius: 15, borderTopRightRadius: 15 }} />
                                                    }
                                                    <View style={{
                                                        width: Dimensions.get("window").width - 20,
                                                        paddingHorizontal: 10,
                                                        paddingBottom: 10,
                                                    }}>
                                                        <Text style={styles.expTitle}>{item.title}</Text>
                                                        <Text>{item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </Shadow>
                                        </View>
                                    );
                                })
                        }
                    </View>
                </View>
            </ScrollView>
        </LinearGradient >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: css.redesign.primary,
    },
    topArea: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    topTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: css.redesign.darker,
        marginHorizontal: 10,
        marginVertical: 10,
        alignSelf: "flex-start",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: css.redesign.darker,
    },
    name: {
        fontSize: 20,
        fontWeight: "bold",
        color: css.redesign.darker,
        marginVertical: 10,
    },
    bio: {
        fontSize: 15,
        color: css.redesign.darker,
        marginVertical: 10,
    },
    skillsArea: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    btnText: {
        fontSize: 16,
        fontWeight: "bold",
        color: css.redesign.darker,
    },
    bottomArea: {
        flex: 1,
        marginTop: 20,
    },
    bottomTitle: {
        fontSize: 20,
        color: "#202020",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    expArea: {
        width: "100%",
        padding: 10,
    },
    expTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#202020",
        marginVertical: 10,
    },
    expItem: {
        width: "100%",
        maxHeight: 550,
        overflow: "hidden",
        backgroundColor: css.redesign.lightest,
        borderRadius: 15,
    },
});

export default Profile;