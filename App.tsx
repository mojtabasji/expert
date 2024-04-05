import React, { useEffect } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, useColorScheme, View,
} from 'react-native';
import axios from 'axios';

import { api } from './constants/Const';
import { StorageHandler } from './constants/StorageHandler';
import LoginHandler from './constants/LoginHandler';
import Welcome from './screens/Welcome';
import BTabHandler from './screens/BTabHandler';


function App(): React.JSX.Element {
  const [loggedIn, setLoggedIn] = React.useState(true);
  const updateLoggedIn = (value: boolean) => {
    setLoggedIn(value);
  }

  useEffect(() => {
    StorageHandler.retrieveData("session_id").then(data => {
      let session;
      session = data;
      console.log("req url: ", api.is_auth_valid);
      axios.get(api.is_auth_valid, {
        headers: {
          Cookie: `session_id=${session};`
        }
      }).then(res => {
        console.log("is_auth_valid", res.data.result);
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
      {
        loggedIn ? <BTabHandler /> : <Welcome />
      }
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
