import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from "./Home";
import ShowOne from "../ShowOne";
import FullScreenImage from "../FullScreenImage";
import TopUserDetail from "./TopUserDetail";

const HomeStack = createNativeStackNavigator();
const HSHandler = ()=>{
    return(
        <HomeStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <HomeStack.Screen name="Home" component={Home} />
            <HomeStack.Screen name="ShowOneExp" component={ShowOne} />
            <HomeStack.Screen name="FullScreenImage" component={FullScreenImage} />
            <HomeStack.Screen name="TopUserDetail" component={TopUserDetail} />
        </HomeStack.Navigator>
    );
}


export default HSHandler;