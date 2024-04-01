import React, { useEffect, useState} from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import css from '../assets/css';
import { api } from '../constants/Const';
import axios from 'axios';


import { StorageHandler } from '../constants/StorageHandler';

type Exp = {
    image: string,
    uID: number,
    username: string,
    content: string,
}


const Home = () => {
    const [exps, setExps] = useState([]);

    useEffect(()=>{
        StorageHandler.retrieveData("session_id").then(data=>{
            let session;
            session = data;
            console.log(session);
            //  api.get_user_related_exps
            axios.get(api.get_user_related_exps, {
                headers:{
                    Cookie: `session_id=${session};`
                }            
            }).then( res => {
                setExps(res.data);
            }).catch(err=>{console.log(err);});
        });
    },[])


    const render_items = (item: Exp, index: number) => {
        console.log(index, item);
        let scaled_height: number = 300;
        Image.getSize(item.image, (width_, height_) => {
            scaled_height = (height_ * Dimensions.get('window').width * 0.95) / width_;
        });
        return (
            <View style={styles.itemArea} key={index} >
                <Image source={{ uri: item.image }} style={{
                    width: '100%',
                    height: scaled_height,
                    // borderRadius: 15,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }} />
                <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                    <Text style={{ marginTop: 10, }}>{item.content}</Text>
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
                    paddingBottom:10,
                }} >
                    <View style={{
                        width: '100%',
                        height: 100,
                        borderBottomColor: css.colors.gray,
                        borderBottomWidth:1,
                    }} >
                        <ScrollView horizontal={true} >
                            <TouchableOpacity style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.danger,
                            }}
                            onPress={async ()=>{
                                StorageHandler.retrieveData("session_id").then(data=>{ console.log(data); });
                            }}
                            />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />
                            <View style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                margin: 10,
                                backgroundColor: css.colors.cyan,
                            }} />

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
        marginTop: 10,
        width: "95%",
    },
});


export default Home;