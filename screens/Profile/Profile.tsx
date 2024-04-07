import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Menu, Pressable, HamburgerIcon, Box } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import LoginHandler from '../../constants/LoginHandler';
import css from '../../constants/css';
import data, { top_users } from '../../assets/data';
import TabView from '../../constants/TabView';
import { StorageHandler } from '../../constants/StorageHandler';
import { api } from '../../constants/Const';
import { Exp } from '../../constants/Types';


const Profile = (Props: any) => {
    const [user, setUser] = useState(top_users[0]);
    const [areaContent, setAreaContent] = useState("Exps");
    const [expContent, setExpContent] = useState([] as Exp[]);

    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);
    const [session_id, setSession_id] = useState("");

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then((session) => {
            StorageHandler.retrieveData("user_id").then((uid) => {
                console.log(session, uid);
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
            });
        });
    }, []);

    useEffect(() => {
        if (session_id == "") return;
        if (areaContent == "Exps") {
            axios.get(api.my_exps, {
                headers: {
                    'Content-Type': 'application/json',
                    Cookie: `session_id=${session_id};`
                }
            }).then((response) => {
                setExpContent(response.data);
            }).catch((error) => { console.log(error); });
        } else {
            axios.get(api.my_exps, {
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': `session_id=${session_id}`
                }
            }).then((response) => {
                setExpContent(response.data);
            }).catch((error) => { console.log(error); });
        }
    }, [areaContent]);

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
                    console.log(response.data);
                    setUser({ ...user, avatar: response.data.url });
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }

    const LogOut = () => {
        console.log("Log out");
        StorageHandler.removeData("session_id").then(() => {
            updateLoggedIn(false);
        });
        StorageHandler.removeData("user_id").then(() => { });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.topArea}>
                    <Box style={{ position: "absolute", top: 10, right: 10 }}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable {...triggerProps}>
                                <HamburgerIcon size={10} />
                            </Pressable>
                        }}>
                            <Menu.Item isDisabled>Sofia</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("EditProfile", { user: user });
                            }}>Edit Profile</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("SkillsEdit", { user: user });
                            }}>Edit Skills</Menu.Item>
                            <Menu.Item style={{ borderTopWidth: 1, borderTopColor: css.colors.middle }} onPress={() => {
                                Alert.alert("Log out", "Are you sure to log out?", [
                                    {
                                        text: "Yes",
                                        onPress: LogOut,
                                    },
                                    {
                                        text: "No",
                                    }
                                ]);
                            }}>Log out</Menu.Item>
                        </Menu>
                    </Box>
                    <Text style={styles.topTitle}>{user.username}</Text>
                    <View style={{
                        flexDirection: "row",
                    }}>
                        <TouchableOpacity onPress={uploadAvatar}>
                            {
                                user.avatar ?
                                    <Image style={styles.avatar} source={{ uri: user.avatar }} />
                                    :
                                    <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                            }
                            <View style={{
                                position: "absolute", bottom: 10, right: 0,
                                backgroundColor: css.colors.primary,
                                padding: 8,
                                borderRadius: 16,
                                justifyContent: "center",
                                alignItems: "center",

                            }}>
                                <Icon name="pen" size={16} color={css.colors.white} />
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
                                <Text style={styles.btnText}>12</Text>
                                <Text style={styles.btnText}>Exps</Text>
                            </View>
                            <View style={{
                                alignItems: "center",
                            }}>
                                <Text style={styles.btnText}>76</Text>
                                <Text style={styles.btnText}>Answers</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.name}>{user.fullname}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                </View>
                <TabView items={[{ name: "Exps" }, { name: "Answers" }]} onChange={(tabName) => {
                    setAreaContent(tabName);
                }}
                    Colors={{
                        backgroundColor: css.colors.primary,
                        textColor: css.colors.white,
                        itemColor: css.colors.light,
                        selectedTextColor: css.colors.black,
                    }}
                />
                <View style={styles.bottomArea}>
                    <View style={styles.expArea}>
                        {
                            expContent.length === 0 ? <Text style={{ alignSelf: "center", }}>No exp</Text> :
                                expContent.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <TouchableOpacity style={styles.expItem}
                                                onPress={() => {
                                                    Props.navigation.navigate("PShowOneExp", { exp: item });
                                                }}
                                            >
                                                {
                                                    item.image &&
                                                    <Image source={{ uri: item.image }} style={{ width: "100%", height: 300, borderRadius: 15 }} />
                                                }
                                                <View style={{
                                                    paddingHorizontal: 10,
                                                    paddingBottom: 10,
                                                }}>
                                                    <Text style={styles.expTitle}>{item.title}</Text>
                                                    <Text>{item.content}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    );
                                })
                        }
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: css.colors.white,
    },
    topArea: {
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    topTitle: {
        fontSize: 20,
        color: "#202020",
        marginHorizontal: 10,
        marginVertical: 10,
        alignSelf: "flex-start",
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginVertical: 10,
    },
    name: {
        fontSize: 20,
        color: "#202020",
        marginVertical: 10,
    },
    bio: {
        fontSize: 15,
        color: "#202020",
        marginVertical: 10,
    },
    btnText: {
        fontSize: 16,
        color: css.colors.black,
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
        color: "#202020",
        marginVertical: 10,
    },
    expItem: {
        width: "100%",
        backgroundColor: css.colors.middle,
        borderRadius: 15,
        marginBottom: 10,
        padding: 5,
    },
});

export default Profile;