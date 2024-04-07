import React, { useState } from 'react';
import { View, TouchableOpacity, Text as RText, StyleSheet, Dimensions, Image } from 'react-native';



export const Text = (props: any) => {
    return (
        <RText style={[{ color: 'white' },
        props.style
        ]}
        >{props.children}</RText>
    )
}

