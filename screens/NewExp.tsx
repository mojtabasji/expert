import React, {useContext, useEffect, useState, useRef} from "react";
import {View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView} from "react-native";
import css from "../constants/css";
import {api} from "../constants/Const";
import axios from "axios";
import {StorageHandler} from "../constants/StorageHandler";
import {Exp, User} from "../constants/Types";

const NewExp = (props: any) => {
    useEffect(() => {
        StorageHandler.retrieveData("session_id").then((data) => {
        });
    }, []);

    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.contentArea}>
                <View style={styles.topUsersArea}>
                    <Text style={styles.topUsersTitle}>Top Users</Text>
                </View>
                <View style={styles.expArea}>
                    <Text style={styles.expTitle}>Experiences</Text>
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
    contentArea: {
        flex: 1,
    },
    topUsersArea: {
        width: "100%",
        height: 100,
        borderBottomColor: css.colors.gray,
        borderBottomWidth: 1,
    },
    topUsersTitle: {
        fontSize: 20,
        color: "#202020",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    topUserArea: {
        width: 80,
        height: 80,
        borderRadius: 40,
        margin: 10,
        alignItems: "center",
    },
    topUserAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    topUserUsername: {
        fontSize: 12,
        color: "#202020",
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
    itemArea: {
        width: "100%",
        backgroundColor: "#f0f0f0",
        borderRadius: 15,
        marginBottom: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    username: {
        fontSize: 12,
        color: "#202020",
    },
    title: {
        fontSize: 20,
        color: "#202020",
        marginVertical: 10,
        marginHorizontal: 10,
    },
    description: {
        fontSize: 16,
        color: "#202020",
        marginHorizontal: 10,
        marginBottom: 10,
    },
});

export default NewExp;
