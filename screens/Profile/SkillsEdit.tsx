import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, Button, TextInput, ScrollView, TouchableWithoutFeedback, Alert } from 'react-native';
import SearchableDropDown from 'react-native-searchable-dropdown';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome6';
import axios from 'axios';

import { StorageHandler } from '../../constants/StorageHandler';
import { Exp, User, Skill } from '../../constants/Types';
import { api } from '../../constants/Const';
import css from '../../constants/css';
import { background } from 'native-base/lib/typescript/theme/styled-system';

const SkillsEdit = (props: any) => {
    const [skills, setSkills] = useState([] as Skill[]);
    const [userSkills, setUserSkills] = useState([] as Skill[]);

    const [session, setSession] = useState("" as string);
    const [showDropDownList, setShowDropDownList] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const [newSkill, setNewSkill] = useState("");


    useEffect(() => {
        StorageHandler.retrieveData("session_id").then(data => {
            let session = data as string;
            setSession(session);

            axios.get(api.get_user_skills, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(user_res => {
                let userSkills = user_res.data as Skill[];
                setUserSkills(userSkills);
                axios.get(api.get_skills, {
                    headers: {
                        Cookie: `session_id=${session};`
                    }
                }).then(res => {
                    let allSkills = res.data as Skill[];
                    setSkills(allSkills);
                    let temp = allSkills.filter(i => !userSkills.some(j => j.id === i.id));
                    setSkills(temp);
                }).catch(err => { console.log(err); });
            }).catch(err => { console.log(err); });

        });
    }, []);

    const addUSerSkill = () => {
        let form = new FormData();
        form.append('skills', userSkills.map(item => item.id).join(','));
        axios.post(api.add_skill_to_user, form, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Cookie": `session_id=${session};`
            }
        }).then(res => {
            console.log(res.data);
            if (res.data.result == "true") {
                props.navigation.navigate('Profile');
            }
        }).catch(err => { console.log(err); });
    }

    const removeUserSkill = (skill: Skill) => {
        let form = new FormData();
        form.append('skill_id', skill.id);
        axios.post(api.remove_skill_from_user, form, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Cookie": `session_id=${session};`
            }
        }).then(res => {
            console.log(res.data);
            if (res.data.result == "true") {
                let temp = userSkills.filter(i => i.id !== skill.id);
                setUserSkills(temp);
                setSkills([...skills, skill]);
            }
        }).catch(err => { console.log(err); });
    }

    return (
        <TouchableWithoutFeedback onPress={() => { setShowDropDownList(false); setShowPopup(false); }}>
            <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
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
                    }]}>ویرایش مهارت ها</Text>
                </View>
                <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                    <Text style={[css.normalText, { textAlign: 'center', fontWeight: 'bold' }]}>مهارت های شما</Text>
                    <Text style={[css.normalText, { textAlign: 'center' }]}>حذف</Text>
                </View>
                <ScrollView>
                    {userSkills.map((item, index) => {
                        return (
                            <View key={index} style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                                <Text style={css.smallText}>{item.name}</Text>
                                <TouchableOpacity onPress={() => {
                                    removeUserSkill(item);
                                }}>
                                    <Icon name="trash" size={16} color={css.redesign.supplement} />
                                </TouchableOpacity>
                            </View>
                        );
                    })}
                </ScrollView>
                <TouchableOpacity onPress={() => { setShowPopup(true); }}
                    style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 10 }}>
                    <Icon name="square-plus" size={18} color={css.redesign.darker} solid={true} />
                    <Text style={[css.smallText, { textAlign: 'center', fontWeight: 'bold', marginHorizontal: 10, color: css.redesign.darker }]}>افزودن مهارت جدید به پایگاه داده</Text>
                </TouchableOpacity>
                <View>
                    <SearchableDropDown
                        onItemSelect={(item: any) => {
                            setUserSkills([...userSkills, item]);
                            let temp = skills.filter(i => i.id !== item.id);
                            setSkills(temp);
                        }}
                        onTextChange={() => setShowDropDownList(true)}
                        itemsContainerStyle={
                            showDropDownList ? { maxHeight: 300 } : { display: "none" }
                        }
                        containerStyle={{ padding: 5 }}
                        itemStyle={{
                            padding: 10,
                            marginTop: 5,
                            backgroundColor: css.redesign.secondary,
                            borderColor: css.redesign.darker,
                            borderWidth: 1,
                            borderRadius: 10,
                        }}
                        itemTextStyle={{ color: css.redesign.darker }}
                        items={skills}
                        defaultIndex={2}
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
                    <Icon name="chevron-down" size={16} style={{ position: 'absolute', left: 25, top: 25 }} />
                </View>
                <TouchableOpacity style={styles.btn}
                    onPress={() => {
                        addUSerSkill();
                    }}>
                    <Text style={[css.normalText, { textAlign: 'center', color: css.redesign.lightest }]}>ذخیره</Text>
                </TouchableOpacity>
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 10,
    },
    btn: {
        padding: 10,
        backgroundColor: css.redesign.darker,
        borderRadius: 10,
        marginVertical: 10,
    },
    popup: {
        position: "absolute",
        width: "90%",
        top: 100,
        left: "7%",
        backgroundColor: css.redesign.lightest,
        justifyContent: "center",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: css.colors.black,

    },
});

export default SkillsEdit;
