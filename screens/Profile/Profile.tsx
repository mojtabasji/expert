import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

import css from '../../constants/css';
import data, { top_users } from '../../assets/data';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Profile = (Props: any) => {
    const [user, setUser] = useState(top_users[0]);
    const [areaContent, setAreaContent] = useState("exp");
    const [expContent, setExpContent] = useState([data[0]]);

    useEffect(() => {
        if (areaContent == "exp") {
            setExpContent([...data.slice(0, 2)]);
        } else {
            setExpContent([...data.slice(2, 4)]);
        }
    }, [areaContent]);

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.topArea}>
                    <Text style={styles.topTitle}>Profile</Text>
                    {
                        user.avatar ?
                            <Image style={styles.avatar} source={{ uri: user.avatar }} />
                            :
                            <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                    }
                    <Text style={styles.name}>{user.fullname}</Text>
                    <Text style={styles.bio}>{user.bio}</Text>
                    <TouchableOpacity style={styles.btn}>
                        <Text style={styles.btnText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomArea}>
                    <View style={styles.expTabAre}>
                        <Icon name="comment-dots" size={30} color={areaContent == "exp" ? css.colors.info : css.colors.light_dark} onPress={() => setAreaContent("exp")} />
                        <Icon name="reply" size={30} color={areaContent == "answer" ? css.colors.info : css.colors.light_dark} onPress={() => setAreaContent("answer")} />
                    </View>
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
                                            <Text style={styles.expTitle}>{item.title}</Text>
                                            <Text>{item.content}</Text>
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
        backgroundColor: "#ffffff",
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
    expTabAre: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        justifyContent: "space-around",
        borderBottomColor: css.colors.light_dark,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        alignItems: "center",
    },
    expItem: {
        width: "100%",
        backgroundColor: css.colors.gray,
        borderRadius: 15,
        marginBottom: 10,
        padding: 5,
    },
});

export default Profile;