import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Search from "./Search";
import ShowOne from "../ShowOne";
import FullScreenImage from "../FullScreenImage";

const SearchStack = createNativeStackNavigator();
const SSHandler = ()=>{
    return(
        <SearchStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <SearchStack.Screen name="Search" component={Search} />
            <SearchStack.Screen name="SShowOneExp" component={ShowOne} />
            <SearchStack.Screen name="FullScreenImage" component={FullScreenImage} />
        </SearchStack.Navigator>
    );
}


export default SSHandler;