import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import NewExp from "./NewExp";

const NewExpStack = createNativeStackNavigator();
const NESHandler = ()=>{
    return(
        <NewExpStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <NewExpStack.Screen name="NewExp" component={NewExp} />
        </NewExpStack.Navigator>
    );
}


export default NESHandler;