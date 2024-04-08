import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TextInput, ScrollView, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import css from '../../constants/css';
import LinearGradient from 'react-native-linear-gradient';

import data from '../../assets/data';

const Search = (props: any) => {


    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <View style={styles.searchArea}>
                <TextInput style={{
                    width: "85%",
                    paddingHorizontal: 20,
                }}>
                </TextInput>
                <Icon name="search" size={27} style={{
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
                    data.map((item, index) => {
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