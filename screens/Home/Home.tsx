import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView, RefreshControl, Alert, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Shadow } from 'react-native-shadow-2';
import Icon from 'react-native-vector-icons/FontAwesome6'
import axios from 'axios';

import { StorageHandler } from '../../constants/StorageHandler';
import { Exp, User } from '../../constants/Types';
import LoginHandler from '../../constants/LoginHandler';
import css from '../../constants/css';
import { api } from '../../constants/Const';


const Home = (props: any) => {
    const [exps, setExps] = useState([] as Exp[]);
    const [top_users, setTopUsers] = useState([] as User[]);
    const [currentUser, setCurrentUSer] = useState({} as User);
    const [sessionValue, setSessionValue] = useState(undefined as string | undefined);

    const [refreshing, setRefreshing] = useState(false);
    const { loggedIn, updateLoggedIn } = useContext(LoginHandler);

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
                setExps(res.data as Exp[]);
            }).catch(err => { console.log(err); }).finally(() => {
                setRefreshing(false);
            });
            axios.get(api.get_top_users, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(res => {
                setTopUsers(res.data as User[]);
            }).catch(err => { console.log(err); });
        });
    };

    useEffect(() => {
        StorageHandler.retrieveData("session_id").then(data => {
            if (data == undefined) updateLoggedIn(false);
            let session: string | undefined;
            session = data;
            setSessionValue(session);
            // Get current user info
            StorageHandler.retrieveData("user_id").then(id => {
                if (id != undefined) {
                    axios.get(api.get_user_info + id, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Cookie': `session_id=${session};`
                        }
                    }).then((response) => {
                        setCurrentUSer(response.data as User);
                    }).catch((error) => { console.log(error); });
                }
            });

            // Get user related exps
            axios.get(api.get_user_related_exps, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(res => {
                setExps(res.data as Exp[]);
            }).catch(err => { console.log(err); });
            axios.get(api.get_top_users, {
                headers: {
                    Cookie: `session_id=${session};`
                }
            }).then(res => {
                setTopUsers(res.data as User[]);
            }).catch(err => { console.log(err); });
        });
    }, [])

    const change_screen = (screen_name: string, values: object = {}) => {
        props.navigation.navigate(screen_name, values);
    };

    const topUserRequest = () => {
        let form = new FormData();
        form.append("sender_name", currentUser.username);
        form.append("sender_email", currentUser.phone);
        form.append("message_body", `user information: Id: ${currentUser.id}, fullname: ${currentUser.fullname}, bio: ${currentUser.bio}, phone: ${currentUser.phone}`);
        form.append("subject", "درخواست اضافه شدن به هایلایت ها از نسخه موبایل");
        axios.post(api.add_me2tops, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }).then(res => {
            Alert.alert("درخواست شما ثبت شد. پس از تایید مدیر اضافه خواهید شد.");
        }).catch(err => console.log(err));
    }

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
                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', position: image_uri ? 'absolute' : 'relative', right: 0, top: 10 }}>
                            {
                                item.user?.avatar ?
                                    <Image style={styles.avatar} source={{ uri: item.user?.avatar }} />
                                    :
                                    <Image style={styles.avatar} source={require('../../assets/images/user_avatar.png')} />
                            }
                            <Text style={[css.smallText, { color: image_uri ? css.redesign.lightest : css.redesign.darker }]}>{item.user?.username}</Text>
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
                            <TouchableOpacity onPress={() => {
                                if (top_users.some(item => item.id == currentUser.id)) {
                                    change_screen("TopUserDetail", { topUserId: currentUser.id });
                                }
                                else {
                                    Alert.alert("هایلایت", "آیا میخواهید به هایلایت ها اضافه شوید؟؟", [
                                        {
                                            text: "بله",
                                            onPress: topUserRequest
                                        },
                                        {
                                            text: "خیر"
                                        }
                                    ])
                                }
                            }} style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.redesign.lightest
                            }}>
                                {
                                    currentUser.avatar ?
                                        <Image style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            borderWidth: 1,
                                            borderColor: css.redesign.darker,
                                        }} source={{ uri: currentUser.avatar }} alt='' />
                                        :
                                        <Image style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            borderWidth: 1,
                                            borderColor: css.colors.fourth,
                                        }} alt='' source={require('../../assets/images/user_avatar.png')} />
                                }
                                <View style={{
                                    position: "absolute", bottom: 10, right: 0,
                                    backgroundColor: css.redesign.darker,
                                    padding: 8,
                                    borderRadius: 16,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    {
                                        !top_users.some(item => item.id == currentUser.id) &&
                                            <Icon name="plus" size={12} color={css.colors.white} />
                                    }
                                </View>
                            </TouchableOpacity>
                            {
                                top_users.map((item, index) => {
                                    if (item.id != currentUser.id)
                                        return (
                                            <TouchableOpacity key={index} style={{
                                                width: 80,
                                                height: 80,
                                                borderRadius: 40,
                                                margin: 10,
                                                backgroundColor: css.colors.primary,
                                            }}
                                                onPress={() => {
                                                    change_screen("TopUserDetail", { topUserId: item.id });
                                                }}
                                            >
                                                {
                                                    item.avatar != null ?
                                                        <Image source={{ uri: item.avatar }} style={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: 40,
                                                            borderWidth: 1,
                                                            borderColor: css.colors.fourth,
                                                        }} /> :
                                                        <Image style={{
                                                            width: 80,
                                                            height: 80,
                                                            borderRadius: 40,
                                                            borderWidth: 1,
                                                            borderColor: css.colors.fourth,
                                                        }} alt='' source={require('../../assets/images/user_avatar.png')} />
                                                }
                                            </TouchableOpacity>
                                        );
                                })
                            }
                        </ScrollView>
                    </View>
                    <View style={{
                        flex: 1,
                        marginTop: 15,
                    }}>
                        {
                            exps.length > 0 ?
                                exps.map((item, index) => render_items(item, index))
                                :
                                // <ActivityIndicator size={'large'} color={css.redesign.darker} />
                                <Text style={[css.normalText, { color: css.redesign.darker, marginHorizontal: 20, marginTop: 100, textAlign: "justify" }]}>چیزی برای نمایش وجود ندارد. مهارت های خود را ویرایش کنید.</Text>
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
        width: Dimensions.get('window').width - 20,
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