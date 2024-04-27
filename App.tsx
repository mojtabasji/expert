import React, { useEffect, useContext } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, useColorScheme, View, Alert, Platform
} from 'react-native';
import axios from 'axios';
import najva from "react-native-najva";

import { api } from './constants/Const';
import credentials from './constants/credentials';
import { StorageHandler } from './constants/StorageHandler';
import LoginHandler from './constants/LoginHandler';
import NotificationHandler from './constants/NotificationHandler';
import Welcome from './screens/Welcome';
import BTabHandler from './screens/BTabHandler';

const initializePush = async () => {
  const apikey = credentials.najva.apikey; // get api key from najva panel
  const websiteId = credentials.najva.websiteId; // get website id from najva panel
  
  await najva.initialize(apikey, websiteId, false /* location */, false);
  const najvaToken = await najva.getSubscribedToken();
  console.log("najvaToken: ", najvaToken);
};

function App(): React.JSX.Element {
  const [loggedIn, setLoggedIn] = React.useState(true);
  const updateLoggedIn = (value: boolean) => {
    setLoggedIn(value);
  }
  const [notificationIsEnable, setNotificationIsEnable] = React.useState(true);
  const updateNotificationIsEnable = (value: boolean) => {
    setNotificationIsEnable(value);
  }

  useEffect(() => {
    StorageHandler.retrieveData("notifications_is_enable").then(data => {
      if (data != "false") {
        if (notificationIsEnable) {
          // notification is enabled
          initializePush();
        }
        else {
          // notification is disabled
        }
      }
    });
  }, [notificationIsEnable]);

  useEffect(() => {
    StorageHandler.retrieveData("notifications_is_enable").then(data => {
      if (data == "false") {
        updateNotificationIsEnable(false);
      }
    });
    StorageHandler.retrieveData("session_id").then(data => {
      if (data == undefined) setLoggedIn(false);
      StorageHandler.retrieveData("user_id").then(id => {
        if (id == undefined) setLoggedIn(false);
      });
      let session;
      session = `session_id=${data};`
      axios.get(api.is_auth_valid, {
        headers: {
          Cookie: session
        }
      }).then(res => {
        if (res.data.result == "true") {
          setLoggedIn(true);
        }
        else {
          setLoggedIn(false);
        }
      }).catch(err => { console.log(err); });
    });
  }, [])

  return (
    <LoginHandler.Provider value={{ loggedIn, updateLoggedIn }}>
      <NotificationHandler.Provider value={{ notificationIsEnable, updateNotificationIsEnable }}>

        {
          loggedIn ? <BTabHandler /> : <Welcome />
        }
      </NotificationHandler.Provider>
    </LoginHandler.Provider>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
