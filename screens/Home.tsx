import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import css from '../assets/css';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { max_comment_see_in_home } from '../assets/const';

type User = {
    uID: number,
    username: string,
    avatar_uri: string,
}
type Response = {
    user: User,
    content: string,
    likes: number,
    dislikes: number,
}
type Exp = {
    image_uri: string | null,
    user: User,
    description: string,
    responses?: Response[],
}

import data, { top_users } from '../assets/data';

const Home = () => {
    let exps: Exp[] = data;

    const render_responses = (response: Response, index: number) => {
        return (
            <View style={{ justifyContent: 'space-between' }} key={index} >
                <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'yellow' }} >
                            <Image source={{ uri: response.user.avatar_uri }} style={{ width: 40, height: 40, borderRadius: 20 }} />
                        </View>
                        <Text style={[css.minimalText, { marginHorizontal: 10 }]}>{response.user.username}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                        <Icon name="thumbs-up" size={15} color={css.colors.dark} />
                        <Text style={[css.minimalText, { marginHorizontal: 10 }]}>{response.likes}</Text>
                        <View style={{ width: 15 }} />
                        <Icon name="thumbs-down" size={15} color={css.colors.dark} />
                        <Text style={[css.minimalText, { marginHorizontal: 10 }]}>{response.dislikes}</Text>
                    </View>
                </View>
                <View style={{ width: '94%', alignSelf: 'center', marginVertical: 10, borderLeftColor: css.colors.light_dark, borderLeftWidth: 1, alignItems: 'flex-start', paddingHorizontal: 10 }}>
                    <Text style={[css.minimalText, { color: css.colors.dark, textAlign: 'justify' }]}>{response.content}</Text>
                </View>
            </View>
        );
    }

    const render_items = (item: Exp, index: number) => {
        const [scaled_height, set_scaled_height] = React.useState(300);
        if (item.image_uri != null) {
            Image.getSize(item.image_uri, (width_, height_) => {
                set_scaled_height((height_ * Dimensions.get('window').width * 0.95) / width_);
            });
        }
        return (
            <View style={styles.itemArea} key={index} >
                {
                    item.image_uri == null ?
                        <View style={{
                            height: 40,
                        }} />
                        :
                        <Image source={{ uri: item.image_uri }} style={{
                            width: '100%',
                            height: scaled_height,
                            borderTopLeftRadius: 15,
                            borderTopRightRadius: 15,
                        }} />
                }
                <View style={{
                    width: 40, height: 40, borderRadius: 20, backgroundColor: 'yellow',
                    position: 'absolute', top: 10, right: 10
                }}>
                    <Image source={{ uri: item.user.avatar_uri }} style={{
                        width: 40, height: 40, borderRadius: 20,
                    }} />
                </View>
                <Text style={[css.minimalText, {
                    height: 40, color: item.image_uri == null ? css.colors.dark : 'white', textAlignVertical: 'center',
                    position: 'absolute', top: 10, right: 60
                }]}>{item.user.username}</Text>
                <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                    <Text style={{ marginTop: 10, color: css.colors.black }}>{item.description}</Text>
                </View>
                <View style={{ width: '95%', alignSelf: 'center', height: 1, backgroundColor: css.colors.light_dark }}>
                    <Icon name="comment-dots" size={25} color={css.colors.dark} style={{ position: 'absolute', top: -20, right: 10 }} />
                </View>
                <View style={{ width: '95%', alignSelf: 'center', justifyContent: 'space-between', marginVertical: 10, paddingHorizontal: 10, }}>
                    {
                        item.responses?.slice(0, max_comment_see_in_home).map((response: Response, index: number) => render_responses(response, index))
                    }
                    {
                        item.responses != null && item.responses?.length > max_comment_see_in_home ?
                            <View>
                                <Text>read more ...</Text>
                            </View>
                            : null
                    }
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container} >
            <ScrollView style={{
                width: '100%',
                height: '100%',
            }}>
                <View style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingBottom: 10,
                }} >
                    <View style={{
                        width: '100%',
                        height: 100,
                        borderBottomColor: css.colors.gray,
                        borderBottomWidth: 1,
                    }} >
                        <ScrollView horizontal={true} >
                            {
                                top_users.map((user, index) => {
                                    return (
                                        <View style={{
                                            width: 80,
                                            height: 80,
                                            borderRadius: 40,
                                            margin: 10,
                                            backgroundColor: css.colors.cyan,
                                            overflow: 'hidden',
                                        }}>
                                            <Image source={{uri:user.avatar_uri}} style={{width:'100%', height:'100%'}} />
                                        </View>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                    {
                        exps.map((item, index) => render_items(item, index))
                    }
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    itemArea: {
        backgroundColor: css.colors.gray,
        borderRadius: 15,
        marginTop: 15,
        width: "95%",
    },
});


export default Home;