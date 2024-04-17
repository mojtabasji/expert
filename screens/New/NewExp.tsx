import React, { useContext, useEffect, useState, useRef, Fragment } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert, Button, TouchableWithoutFeedback } from "react-native";
import css from "../../constants/css";
import { api } from "../../constants/Const";
import axios from "axios";
import { StorageHandler } from "../../constants/StorageHandler";
import { Exp, User, Skill } from "../../constants/Types";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/FontAwesome6";
import SearchableDropdown from 'react-native-searchable-dropdown';
import LinearGradient from "react-native-linear-gradient";


const NewExp = (props: any) => {
    const [skills, setSkills] = useState([] as Skill[]);
    const [session, setSession] = useState("" as string | undefined);
    const [showPopup, setShowPopup] = useState(false);

    const [image, setImage] = useState({ uri: "" } as any);
    const [selectedItems, setSelectedItems] = useState([] as any);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [newSkill, setNewSkill] = useState("" as string | undefined);
    const [showDropDownList, setShowDropDownList] = useState(false);

    const [retry, setRetry] = useState(false);

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then((data) => {
            setSession(data);
            axios.get(api.get_skills, {
                headers: {
                    Cookie: `session_id=${data};`
                }
            }).then(res => {
                setSkills(res.data);
            }).catch(err => {
                console.log(err);
                setTimeout(() => {
                    setRetry(!retry);
                }, 3000);
            });
        });
    }, [retry]);

    useEffect(() => {
        setNewSkill("");
    }, [showPopup]);

    const chooseImage = () => {
        launchImageLibrary({ mediaType: "photo" }, (res) => {
            if (res.didCancel)
                return
            if (res.assets)
                setImage(res.assets[0]);
        });
    }

    const uploadNewExp = () => {
        let form = new FormData();
        form.append("title", title);
        form.append("description", content);
        if (image.uri.indexOf('file') !== -1)
            form.append("image", {
                uri: image.uri,
                type: 'image/jpeg',
                name: 'image.jpg',
            });
        form.append("skills", selectedItems.map((item: any) => item.id).join(","));
        axios.post(api.new_exp, form, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Cookie": `session_id=${session};`
            },
            withCredentials: true,
        }).then(res => {
            if (res.data.result == "true") {
                setSkills([]);
                setContent("");
                setSelectedItems([]);
                setTitle("");
                setImage({ uri: "" });
                props.navigation.navigate("Profile");
            }
            else if (res.data.ww == "true")
                Alert.alert("خطا", "مقدار وارد شده شامل محتوی نا مناسب است.");
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <TouchableWithoutFeedback onPress={() => { setShowPopup(false), setShowDropDownList(false); }}>
            <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <Text style={[css.titleText, { fontWeight: "bold", alignSelf: 'center', marginBottom: 20 }]}>مبحث جدید</Text>
                        <TouchableOpacity onPress={chooseImage} style={{ flexDirection: "row-reverse", alignItems: "center" }} >
                            <Icon name="square-plus" size={25} solid={true} color={css.redesign.darker} style={{}} />
                            <Text style={[css.smallText, { color: css.redesign.darker, fontWeight: "bold", marginHorizontal: 10 }]}>افزودن تصویر</Text>
                        </TouchableOpacity>
                        {
                            image.uri.indexOf('file') !== -1 &&
                            <View style={{
                                borderWidth: 1,
                                borderColor: css.colors.black,
                                borderRadius: 5,
                                marginVertical: 20,
                            }}>
                                <Image style={{
                                    width: "100%",
                                    height: Dimensions.get("screen").width * 0.9 * image.height / image.width,
                                    maxHeight: 500,
                                    resizeMode: 'center',
                                }} source={{ uri: image.uri }} />
                                <TouchableOpacity style={{
                                    width: 25,
                                    height: 25,
                                    borderRadius: 10,
                                    position: "absolute",
                                    right: 10,
                                    top: 10,
                                }} onPress={() => { setImage({ uri: '' }) }}
                                >
                                    <Icon name="times-circle" size={25} color={css.colors.red} />
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={{
                            marginVertical: 20,
                        }} >
                            <View style={styles.InputArea}>
                                <Text style={[css.normalText, { marginBottom: 10 }]}>عنوان:</Text>
                                <TextInput style={[css.smallText, styles.Input]} placeholder="عنوان" onChangeText={text => setTitle(text)} value={title} />
                            </View>
                            <View style={styles.InputArea}>
                                <Text style={[css.normalText, { marginBottom: 10 }]}>متن بحث:</Text>
                                <TextInput numberOfLines={5} multiline={true} style={[css.smallText, styles.Input]} textAlignVertical="top" placeholder="متن بحث" onChangeText={text => setContent(text)} value={content} />
                            </View>
                            <TouchableOpacity onPress={() => { setShowPopup(true); }}
                                style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 10 }}>
                                <Icon name="square-plus" size={18} color={css.redesign.darker} solid={true} />
                                <Text style={[css.smallText, { textAlign: 'center', fontWeight: 'bold', marginHorizontal: 10, color: css.redesign.darker }]}>افزودن مهارت جدید به پایگاه داده</Text>
                            </TouchableOpacity>
                            <View>
                                <SearchableDropdown
                                    multi={true}
                                    selectedItems={selectedItems}
                                    onItemSelect={(item: any) => {
                                        const items = selectedItems;
                                        items.push(item)
                                        setSelectedItems(items);
                                    }}
                                    containerStyle={{ padding: 20 }}
                                    onTextChange={() => setShowDropDownList(true)}
                                    onRemoveItem={(item: any, index: number) => {
                                        const items = selectedItems.filter((sitem: any) => sitem.id !== item.id);
                                        setSelectedItems(items);
                                    }}
                                    itemStyle={{
                                        padding: 10,
                                        marginTop: 5,
                                        backgroundColor: css.redesign.secondary,
                                        borderColor: css.redesign.darker,
                                        borderWidth: 1,
                                        borderRadius: 10,
                                    }}
                                    itemTextStyle={{ color: '#222' }}
                                    itemsContainerStyle={
                                        showDropDownList ? { maxHeight: 300 } : { display: "none" }
                                    }
                                    items={skills.map(item => {
                                        return {
                                            id: item.id,
                                            name: item.name
                                        }
                                    })}
                                    defaultIndex={2}
                                    chip={true}
                                    resetValue={false}
                                    textInputProps={
                                        {
                                            placeholder: "مهارت ها",
                                            underlineColorAndroid: "transparent",
                                            style: {
                                                padding: 12,
                                                borderWidth: 1,
                                                borderColor: css.redesign.darker,
                                                borderRadius: 15,
                                                backgroundColor: css.redesign.lightest,
                                            },
                                        }
                                    }
                                    listProps={
                                        {
                                            nestedScrollEnabled: true,
                                        }
                                    }
                                />
                                {/* <Icon name="chevron-down" size={16} style={{ position: 'absolute', left: 25, top: 25 }} /> */}
                            </View>
                            <TouchableOpacity style={styles.btn}
                                onPress={uploadNewExp}>
                                <Text style={[css.normalText, { textAlign: 'center', color: css.redesign.lightest }]}>ارسال</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                {
                    showPopup &&
                    <View style={styles.popup}>
                        <Text style={[css.normalText, { fontWeight: "bold" }]}>افزودن مهارت جدید به لیست:</Text>
                        <TextInput placeholder="مهارت جدید" style={{
                            borderRadius: 20,
                            backgroundColor: css.redesign.primary,
                            marginVertical: 10,
                            paddingHorizontal: 20,
                        }} onChangeText={(text) => {
                            setNewSkill(text);
                        }} />
                        <TouchableOpacity onPress={() => {
                            if (newSkill === "")
                                return;
                            let form = new FormData();
                            form.append("name", newSkill);
                            axios.post(api.skills_add, form, {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    "Cookie": `session_id=${session};`
                                },
                                withCredentials: true,
                            }).then(res => {
                                if (res.data.result === "false" && res.data.ww == "true")
                                    Alert.alert("خطا", "مقدار وارد شده شامل محتوی نا مناسب است.");
                                else
                                    setSkills(res.data);
                                setShowPopup(false);
                            }).catch(err => {
                                console.log(err);
                            });
                        }} style={{
                            marginHorizontal: 10,
                            height: 40,
                            backgroundColor: css.redesign.darker,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Text style={[css.smallText, { color: css.redesign.lightest }]}>افزودن</Text>
                        </TouchableOpacity>
                    </View>
                }
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        paddingTop: 20,
        paddingHorizontal: 10,
    },
    textLink: {
        color: css.colors.linkBlue
    },
    popup: {
        position: "absolute",
        width: "90%",
        top: 100,
        left: "7%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: css.colors.black,

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
        padding: 10,
        backgroundColor: css.redesign.darker,
        borderRadius: 10,
        marginVertical: 10,
    },
});

export default NewExp;
