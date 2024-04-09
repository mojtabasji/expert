import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Box, HamburgerIcon, Pressable, Menu, Input } from "native-base";
import Icon from "react-native-vector-icons/FontAwesome6";
import axios from "axios";
import LinearGradient from "react-native-linear-gradient";

import { Exp, User } from "../../constants/Types";
import { StorageHandler } from "../../constants/StorageHandler";
import LoginHandler from "../../constants/LoginHandler";
import css from "../../constants/css";
import { api } from "../../constants/Const";
import { top_users } from "../../assets/data";

const EditProfile = (props: any) => {
    const [user, setUser] = useState(props.route.params.user as User);
    const [session_id, setSession_id] = useState(null as string | null);

    const [fullname, setFullname] = useState(user.fullname);
    const [phone, setPhone] = useState(user.phone);
    const [bio, setBio] = useState(user.bio);
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    useEffect(() => {
        setFullname(user.fullname);
        setPhone(user.phone);
        setBio(user.bio);
    }, [user]);

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then((session) => {
            if (session) setSession_id(session);
        });
    }, []);

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <ScrollView>
                <View style={{ justifyContent: "center", paddingVertical: 10, paddingHorizontal: 10, }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()}
                    style={{
                        width: 40,
                        height: 40,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderColor: css.redesign.darker,
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <Icon name="chevron-left" size={20} onPress={() => props.navigation.goBack()} color={css.redesign.darker} />
                    </TouchableOpacity>
                    <Text style={[css.titleText, {
                        color: css.redesign.darker,
                        position: "absolute",
                        alignSelf: "center",
                    }]}>Edit Profile</Text>
                </View>
                <View style={styles.InputArea}>
                    <Text style={[css.normalText, { marginBottom: 10 }]}>Full name:</Text>
                    <TextInput style={[css.smallText, styles.Input]} placeholder="Full Name" value={fullname} onChangeText={text => setFullname(text)} />
                </View>
                <View style={styles.InputArea}>
                    <Text style={[css.normalText, { marginBottom: 10 }]}>Phone:</Text>
                    <TextInput style={[css.smallText, styles.Input]} placeholder="Phone" value={phone} onChangeText={text => setPhone(text)} />
                </View>
                <View style={styles.InputArea}>
                    <Text style={[css.normalText, { marginBottom: 10 }]}>Bio:</Text>
                    <TextInput multiline={true} numberOfLines={5} style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="Biography" value={bio ? bio : ""} onChangeText={text => setBio(text)} />
                </View>
                <View style={styles.InputArea}>
                    <Text style={[css.normalText, { marginBottom: 10 }]}>Password:</Text>
                    <TextInput style={[css.smallText, styles.Input]} placeholder="Password" textContentType="password" onChangeText={text => setPassword(text)} />
                </View>
                <View style={styles.InputArea}>
                    <Text style={[css.normalText, { marginBottom: 10 }]}>Password Confirm:</Text>
                    <TextInput style={[css.smallText, styles.Input]} placeholder="Password Confirm" textContentType="password" onChangeText={text => setPasswordConfirm(text)} />
                </View>
                <TouchableOpacity style={styles.btn} onPress={() => {
                    axios.post(api.update_user_info, {
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
        </LinearGradient>
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
    InputArea: {
        margin: 10,
        padding: 10,
    },
    Input: {
        backgroundColor: css.redesign.lightest,
        borderRadius: 10,
        padding: 10,
    },
    btn: {
        borderRadius: 10,
        backgroundColor: css.redesign.darker,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 10

    }
});

export default EditProfile;
