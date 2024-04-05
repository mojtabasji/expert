import React, { useContext, useEffect, useState, useRef, Fragment } from "react";
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, TextInput, Alert, Button, TouchableWithoutFeedback } from "react-native";
import css from "../../constants/css";
import { api } from "../../constants/Const";
import axios from "axios";
import { StorageHandler } from "../../constants/StorageHandler";
import { Exp, User, Skill } from "../../constants/Types";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from "react-native-vector-icons/FontAwesome5";
import SearchableDropdown from 'react-native-searchable-dropdown';


const NewExp = (props: any) => {
    const [skills, setSkills] = useState([] as Skill[]);
    const [session, setSession] = useState("" as string | undefined);
    const [showPopup, setShowPopup] = useState(false);

    const [image, setImage] = useState({ uri: "" } as any);
    const [selectedItems, setSelectedItems] = useState([] as any);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const [newSkill, setNewSkill] = useState("" as string | undefined);


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
            });
        });
    }, []);

    useEffect(()=>{
        setNewSkill("");
    },[showPopup]);

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
            if(res.data.result == "true"){
                setSkills([]);
                setContent("");
                selectedItems([]);
                setTitle("");
                setImage({uri:""});
                props.navigation.navigate("HSHandler");
            }
        }).catch(err => {
            console.log(err);
        });
    }

    return (
        <TouchableWithoutFeedback onPress={() => setShowPopup(false)}>
            <View style={styles.container}>
                <ScrollView keyboardShouldPersistTaps="handled">
                    <View>
                        <TouchableOpacity onPress={chooseImage}>
                            <Text style={styles.textLink}>+ choose image</Text>
                        </TouchableOpacity>
                        {
                            image.uri.indexOf('file') !== -1 &&
                            <View style={{
                                borderWidth: 1,
                                borderColor: css.colors.light_dark,
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
                        <Text>Title</Text>
                        <TextInput style={[css.normalText, {
                            width: '100%',
                            borderBottomWidth: 1,
                            borderColor: css.colors.light_dark,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            textAlign: 'justify',
                        }]} multiline={true} onChangeText={(text) => setTitle(text)} ></TextInput>
                        <Text style={{
                            marginTop: 20,
                        }}>Content</Text>
                        <TextInput style={[css.normalText, {
                            width: '100%',
                            borderBottomWidth: 1,
                            borderColor: css.colors.light_dark,
                            borderRadius: 10,
                            paddingHorizontal: 10,
                            textAlign: 'justify',
                        }]} multiline={true} onChangeText={(text) => setContent(text)} ></TextInput>
                        <View style={{
                            marginTop: 20,
                            width: "100%",
                        }}>
                            <SearchableDropdown
                                multi={true}
                                selectedItems={selectedItems}
                                onItemSelect={(item: any) => {
                                    const items = selectedItems;
                                    items.push(item)
                                    setSelectedItems(items);
                                }}
                                containerStyle={{ padding: 5 }}
                                onRemoveItem={(item: any, index: number) => {
                                    const items = selectedItems.filter((sitem: any) => sitem.id !== item.id);
                                    setSelectedItems(items);
                                }}
                                itemStyle={{
                                    padding: 10,
                                    marginTop: 2,
                                    backgroundColor: '#ddd',
                                    borderColor: '#bbb',
                                    borderWidth: 1,
                                    borderRadius: 5,
                                }}
                                itemTextStyle={{ color: '#222' }}
                                itemsContainerStyle={{ maxHeight: 140 }}
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
                                            borderColor: '#ccc',
                                            borderRadius: 5,
                                        },
                                    }
                                }
                                listProps={
                                    {
                                        nestedScrollEnabled: true,
                                    }
                                }
                            />
                            <TouchableOpacity style={{ marginBottom: 20 }} onPress={()=>{setShowPopup(true);}}>
                                <Text style={[css.smallText, {
                                    color: css.colors.linkBlue,
                                    alignSelf: 'flex-end',
                                }]}>add new skill to list</Text>
                            </TouchableOpacity>
                        </View>
                        <Button title="ایجاد" onPress={uploadNewExp} />
                    </View>
                </ScrollView>
                {
                    showPopup &&
                    <View style={styles.popup}>
                        <Text>new Item add</Text>
                        <TextInput placeholder="new skill" style={{
                            borderBottomWidth: 1,
                            borderColor: css.colors.light_dark,
                            marginVertical: 10,
                        }} onChangeText={(text) => {
                            setNewSkill(text);
                        }} />
                        <Button title="add" onPress={() => {
                            console.log(newSkill);
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
                                setSkills(res.data);
                                setShowPopup(false);
                                console.log(res.data);
                            }).catch(err => {
                                console.log(err);
                            });
                        }} />
                    </View>
                }
            </View>
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
        borderColor: css.colors.light_dark,

    },
});

export default NewExp;
