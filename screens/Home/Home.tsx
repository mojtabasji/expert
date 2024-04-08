import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import css from '../../constants/css';
import { api } from '../../constants/Const';
import axios from 'axios';
import LinearGradient from 'react-native-linear-gradient';
import { Shadow } from 'react-native-shadow-2';

import { StorageHandler } from '../../constants/StorageHandler';
import { Exp, User } from '../../constants/Types';


import data, { top_users } from '../../assets/data';

const Home = (props: any) => {
    const [exps, setExps] = useState(data);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        StorageHandler.retrieveData("session_id").then(data => {
            let session;
            session = data;
            axios.get(api.get_user_related_exps, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(res => {
                console.log("related exps: ", res.data);
                setExps(res.data as Exp[]);
            }).catch(err => { console.log(err); }).finally(() => {
                setRefreshing(false);
            });
        });
    };

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then(data => {
            let session;
            session = data;
            axios.get(api.get_user_related_exps, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(res => {
                setExps(res.data as Exp[]);
            }).catch(err => { console.log(err); });
        });
    }, [])

    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    };

    const render_items = (item: Exp, index: number) => {
        let image_uri = item.image == null ? null : item.image;
        let scaled_height: number = 300;
        if (image_uri) Image.getSize(image_uri, (width_, height_) => {
            scaled_height = (height_ * Dimensions.get('window').width * 0.95) / width_;
        });
        return (
            <View key={index}>
                <Shadow style={{
                    marginBottom: 20
                }} distance={10} >
                    <TouchableOpacity style={styles.itemArea}
                        onPress={() => {
                            change_screen("ShowOneExp", { exp: exps[index] });
                        }}
                    >
                        {
                            image_uri &&
                            <Image source={{ uri: image_uri }} style={{
                                width: '100%',
                                height: scaled_height,
                                // borderRadius: 15,
                                borderTopLeftRadius: 15,
                                borderTopRightRadius: 15,
                            }} />
                        }
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', position: 'absolute', right: 0, top: 10 }}>
                            {
                                item.user?.avatar ?
                                    <Image style={styles.avatar} source={{ uri: item.user?.avatar }} />
                                    :
                                    <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                            }
                            <Text style={css.minimalText}>{item.user?.username}</Text>
                        </View>
                        <View style={{ marginBottom: 10, paddingHorizontal: 10, paddingBottom: 10 }}>
                            <Text style={{ fontSize: 20, color: "#202020", marginVertical: 10, fontWeight: "bold" }}>{item.title}</Text>
                            <Text style={{ marginTop: 10, }}>{item.content.length > 150 ? item.content.substring(0, 150) + "..." : item.content}</Text>
                        </View>
                    </TouchableOpacity>
                </Shadow>
            </View>
        );
    }

    return (
        <LinearGradient colors={[css.redesign.secondary, css.redesign.primary]} style={styles.container}>
            <ScrollView style={{
                width: '100%',
                height: '100%',
            }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={100} // Adjust the offset as needed for the elastic effect
                    />
                } >
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingBottom: 10,
                }} >
                    <View style={{
                        width: '100%',
                        height: 100,
                        borderBottomColor: css.colors.fourth,
                        borderBottomWidth: 2,
                    }} >
                        <ScrollView horizontal={true} >
                            {
                                top_users.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            margin: 10,
                                            backgroundColor: css.colors.primary,
                                        }}
                                            onPress={() => {
                                                change_screen("ShowOneUser", { user: item });
                                            }}
                                        >
                                            <Image source={{ uri: item.avatar }} style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                borderWidth: 1,
                                                borderColor: css.colors.fourth,
                                            }} />
                                        </TouchableOpacity>
                                    );
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{
                        flex:1,
                        marginTop: 15,
                    }}>
                    {
                        exps.map((item, index) => render_items(item, index))
                    }
                    </View>
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: css.colors.secondary,
    },
    itemArea: {
        backgroundColor: css.redesign.lightest,
        borderRadius: 15,
        width: Dimensions.get('window').width -20,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 1,
        borderColor: css.colors.fourth,
    }
});


export default Home;