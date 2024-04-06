import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Bell from "./Bell";
import ShowOne from "../ShowOne";

const NotificationStack = createNativeStackNavigator();
const NoSHandler = ()=>{
    return(
        <NotificationStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <NotificationStack.Screen name="Bell" component={Bell} />
            <NotificationStack.Screen name="ShowOneExp" component={ShowOne} />
        </NotificationStack.Navigator>
    );
}


export default NoSHandler;