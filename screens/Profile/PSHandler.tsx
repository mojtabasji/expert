import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from "./Profile";
import ShowOne from "../ShowOne";
import FullScreenImage from "../FullScreenImage";
import SkillsEdit from "./SkillsEdit";
import EditProfile from "./EditProfile";

const ProfileStack = createNativeStackNavigator();
const HSHandler = ()=>{
    return(
        <ProfileStack.Navigator screenOptions={{
            headerShown: false
        }}>
            <ProfileStack.Screen name="Profile" component={Profile} />
            <ProfileStack.Screen name="PShowOneExp" component={ShowOne} />
            <ProfileStack.Screen name="FullScreenImage" component={FullScreenImage} />
            <ProfileStack.Screen name="SkillsEdit" component={SkillsEdit} />
            <ProfileStack.Screen name="EditProfile" component={EditProfile} />
        </ProfileStack.Navigator>
    );
}


export default HSHandler;