import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from "./Profile";
import ShowOne from "../ShowOne";

const HomeStack = createNativeStackNavigator();
const HSHandler = ()=>{
    return(
        <HomeStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <HomeStack.Screen name="Profile" component={Profile} />
            <HomeStack.Screen name="PShowOneExp" component={ShowOne} />
        </HomeStack.Navigator>
    );
}


export default HSHandler;