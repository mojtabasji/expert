import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import css from '../../constants/css';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

import { StorageHandler } from '../../constants/StorageHandler';
import data from '../../assets/data';
import { Exp } from '../../constants/Types';
import { api } from '../../constants/Const';

const Search = (props: any) => {
    const [searchResult, setSearchResult] = useState([] as Exp[]);
    const [loading, setLoading] = useState(false);

    const search = (searchText: string) => {
        setLoading(true);
        StorageHandler.retrieveData('session').then(session => {
            axios.get(api.search, {
                headers: {
                    Cookie: `session_id=${session};`
                },
                params: {
                    query: searchText
                }
            })
                .then(res => {
                    setSearchResult(res.data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        });
    }

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <View style={styles.searchArea}>
                <TextInput style={{
                    width: "85%",
                    paddingHorizontal: 20,
                }} placeholder="Search" onChangeText={(text) => search(text)}>
                </TextInput>
                <Icon name="search" size={22} style={{
                    width: "15%",
                    aspectRatio: 1,
                    alignSelf: 'center',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                }} color={css.redesign.darker} />
            </View>
            <ScrollView style={{
                paddingTop: 15
            }}>
                {
                    loading ? 
                    <ActivityIndicator size="large" color={css.colors.dark} style={{
                        marginTop: 80,
                        alignSelf: 'center',
                    }} /> :
                    searchResult.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                width: Dimensions.get('window').width * 0.9,
                                paddingVertical: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: css.redesign.primary,
                            }}
                                onPress={() => {
                                    props.navigation.navigate("SShowOneExp", { exp: item });
                                }}
                            >
                                {
                                    item.user.avatar ?
                                        <Image style={styles.avatar} source={{ uri: item.user.avatar }} />
                                        :
                                        <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                                }
                                <Text style={[css.smallText, { textAlign: "justify" }]}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })
                }
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20
    },
    searchArea: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: css.redesign.gray,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 2,
        borderColor: css.colors.dark,
    },
});

export default Search;