import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import css from '../assets/css';

type Exp = {
    image_uri: string,
    uID: number,
    username: string,
    description: string,
}


const Home = () => {
    let exps: Exp[] = [
        {
            image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
            uID: 1,
            username: 'ali',
            description: 'this is a description',
        },
        {
            image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
            uID: 1,
            username: 'ali',
            description: 'this is a description',
        },
        {
            image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
            uID: 1,
            username: 'ali',
            description: 'this is a description',
        },
        {
            image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
            uID: 1,
            username: 'ali',
            description: 'this is a description',
        },
    ];


    const render_items = (item: Exp, index: number) => {
        let scaled_height: number = 300;
        Image.getSize(item.image_uri, (width_, height_) => {
            scaled_height = (height_ * Dimensions.get('window').width * 0.95) / width_;
        });
        return (
            <View style={styles.itemArea} key={index} >
                <Image source={{ uri: item.image_uri }} style={{
                    width: '100%',
                    height: scaled_height,
                    // borderRadius: 15,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                }} />
                <View style={{ marginHorizontal: 10, marginBottom: 10 }}>
                    <Text style={{ marginTop: 10, }}>{item.description}</Text>
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