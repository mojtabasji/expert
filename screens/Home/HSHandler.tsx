import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./Home";
import ShowOne from "../ShowOne";
import FullScreenImage from "../FullScreenImage";

const HomeStack = createNativeStackNavigator();
const HSHandler = ()=>{
    return(
        <HomeStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="ShowOneExp" component={ShowOne} />
            <HomeStack.Screen name="FullScreenImage" component={FullScreenImage} />
        </HomeStack.Navigator>
    );
}


export default HSHandler;