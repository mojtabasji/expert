import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Box, HamburgerIcon, Pressable, Menu, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome5";
import { api } from "../../constants/Const";
import { Exp } from "../../constants/Types";
import axios from "axios";
import { StorageHandler } from "../../constants/StorageHandler";
import { top_users } from "../../assets/data";
import LoginHandler from "../../constants/LoginHandler";
import css from "../../constants/css";
import TabView from "../../constants/TabView";

const EditProfile = (props: any) => {
    const [user, setUser] = React.useState(props.route.params.user);
    const [session_id, setSession_id] = React.useState(null as string | null);

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then((session) => {
            if (session) setSession_id(session);
        });
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text>Edit Profile</Text>
                <Text>{user.name}</Text>
                <TextInput style={styles.Input} placeholder="Name" value={user.name} />
                <Text style={styles.text}>fullname</Text>
                <TextInput style={styles.Input} placeholder="Full Name" value={user.fullname} />
                <Text style={styles.text}>bio:</Text>
                <TextInput style={styles.Input} placeholder="Bio" value={user.bio} />
                <TouchableOpacity style={styles.btn} onPress={() => {
                    axios.post(api.update_user_info, {
                        name: user.name,
                        fullname: user.fullname,
                        bio: user.bio
                    }, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `session_id=${session_id}`
                        }
                    }).then((response) => {
                        console.log(response.data);
                    }).catch((error) => {
                        console.log(error);
                    });
                }}>
                    <Text style={{
                        color: "white",
                    }}>Save</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        flex: 1,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
    },
    Input: {
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    btn:{
        borderRadius: 10,
        backgroundColor: css.colors.primary,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 10

    }
});

export default EditProfile;
