import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Menu, Pressable, HamburgerIcon, Box } from 'native-base';

import LoginHandler from '../../constants/LoginHandler';
import css from '../../constants/css';
import data, { top_users } from '../../assets/data';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TabView from '../../constants/TabView';
import { StorageHandler } from '../../constants/StorageHandler';


const Profile = (Props: any) => {
    const [user, setUser] = useState(top_users[0]);
    const [areaContent, setAreaContent] = useState("Exps");
    const [expContent, setExpContent] = useState([data[0]]);

    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);

    useEffect(() => {
        if (areaContent == "Exps") {
            setExpContent([...data.slice(0, 2)]);
        } else {
            setExpContent([...data.slice(2, 4)]);
        }
    }, [areaContent]);

    const LogOut = () => {
        console.log("Log out");
        StorageHandler.removeData("session_id").then(() => {
            updateLoggedIn(false);
        });
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.topArea}>
                    <Icon name="arrow-left" size={30} color={css.colors.gray} style={{ position: "absolute", top: 10, left: 10 }}
                        onPress={() => {
                            Props.navigation.goBack();
                        }}
                    />
                    <Box style={{ position: "absolute", top: 10, right: 10 }}>
                        <Menu w="190" trigger={triggerProps => {
                            return <Pressable {...triggerProps}>
                                <HamburgerIcon size={10} />
                            </Pressable>
                        }}>
                            <Menu.Item isDisabled>Sofia</Menu.Item>
                            <Menu.Item>Edit Profile</Menu.Item>
                            <Menu.Item onPress={() => {
                                Props.navigation.navigate("SkillsEdit", { user: user });
                            }}>Edit Skills</Menu.Item>
                            <Menu.Item onPress={() => {
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
                    <Text style={styles.topTitle}>Profile</Text>
                    {
                        user.avatar ?
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            :
                            <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                    }
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
        alignItems: "center",
    },
    topTitle: {
        fontSize: 20,
        color: "#202020",
        marginHorizontal: 10,
        marginVertical: 10,
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
    btn: {
        width: 200,
        height: 40,
        borderRadius: 20,
        backgroundColor: css.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },
    btnText: {
        fontSize: 20,
        color: "#ffffff",
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