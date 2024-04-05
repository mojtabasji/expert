import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';


const FullScreenImage = (Props: any) => {
    const [images, setImages] = useState([{
        url: 'https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w600/2023/10/free-images.jpg'
}] as any);

    useEffect(()=>{
        setImages([Props.route.params.images]);
    },[]);

    const onClose = ()=>{
        Props.navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <ImageViewer
                imageUrls={images}
                enableSwipeDown
                onSwipeDown={() => onClose()} // Optional: Implement a close action
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default FullScreenImage;
