import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import css from '../../constants/css';
import { api } from '../../constants/Const';
import axios from 'axios';
import { StorageHandler } from '../../constants/StorageHandler';
import SearchableDropDown from 'react-native-searchable-dropdown';

import { Exp, User, Skill } from '../../constants/Types';

const SkillsEdit = (props: any) => {
    const [skills, setSkills] = useState([] as Skill[]);
    const [userSkills, setUserSkills] = useState([] as Skill[]);

    const [session, setSession] = useState("" as string);


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

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                <Text style={[css.normalText, { textAlign: 'center' }]}>Skills</Text>
                <TouchableOpacity onPress={() => {
                    addUSerSkill();
                }}>
                    <Text style={[css.normalText, { textAlign: 'center' }]}>Save</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {userSkills.map((item, index) => {
                    return (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text>{item.name}</Text>
                            <TouchableOpacity onPress={() => {
                                console.log(item);
                            }}>
                                <Text style={{ color: 'red' }}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
            <SearchableDropDown
                onItemSelect={(item: any) => {
                    setUserSkills([...userSkills, item]);
                    let temp = skills.filter(i => i.id !== item.id);
                    setSkills(temp);
                }}
                containerStyle={{ padding: 5 }}
                itemStyle={{
                    padding: 10,
                    marginTop: 2,
                    backgroundColor: '#ddd',
                    borderColor: '#bbb',
                    borderWidth: 1,
                    borderRadius: 5,
                }}
                itemTextStyle={{ color: '#222' }}
                itemsContainerStyle={{ maxHeight: 300 }}
                items={skills}
                defaultIndex={2}
                resetValue={false}
                textInputProps={
                    {
                        placeholder: "placeholder",
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SkillsEdit;
