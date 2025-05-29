import React, { useEffect } from 'react';
import {
  StyleSheet, Alert,
} from 'react-native';
import axios from 'axios';

import { api } from './constants/Const';
import credentials from './constants/credentials';
import { StorageHandler } from './constants/StorageHandler';
import LoginHandler from './constants/LoginHandler';
import NotificationHandler from './constants/NotificationHandler';
import Welcome from './screens/Welcome';
import BTabHandler from './screens/BTabHandler';

import messaging from '@react-native-firebase/messaging';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    Alert.alert('Permission denied for notifications');
  }
}

async function checkNotificationPermission() {
  const settings = await notifee.getNotificationSettings();

  if (settings.authorizationStatus == AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permissions has been authorized');
  } else if (settings.authorizationStatus == AuthorizationStatus.DENIED) {
    console.log('Notification permissions has been denied');
    //  openNotificationSettings
    Alert.alert(
      'Notification permissions denied',
      'Please enable notifications in your device settings.',
      [
        {
          text: 'Open Settings',
          onPress: () => notifee.openNotificationSettings(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            setTimeout(() => {
              checkNotificationPermission();
            }, 20000);
          }
        },
      ],
    );
  }
}

async function getFcmToken() {
  const token = await messaging().getToken();
  console.log('FCM Token:', token);
  // Save/send this token to your backend server!
  StorageHandler.retrieveData("session_id").then(data => {
    if (data == undefined) {
      console.log("session_id is undefined");
      return;
    }
    let session;
    session = `session_id=${data};`
    let form = new FormData();
    form.append("token", token);
    axios.post(api.push_najva_token, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Cookie: session
      }
    }).then(res => {
      console.log("pushNajvaToken: ", res.data);
    }).catch(err => {
      console.log(err);
    });
  });

  return token;
}

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
          // initializePush();
        }
        else {
          // notification is disabled
        }
      }
    });
  }, [notificationIsEnable]);

  // FireBase Config
  useEffect(() => {

    messaging().requestPermission()
      .then(authStatus => {
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          console.log('Authorization status:', authStatus);
        } else {
          Alert.alert('Permission denied for notifications');
        }
      })
      .catch(error => {
        console.error('Error requesting permission:', error);
      });

    // Foreground messages
    // Check if the app is in the foreground or background
    // and request permission to receive notifications
    requestUserPermission().then(() => {
      getFcmToken();
    });

    // killed app state
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('Notification caused app to open from quit state:', remoteMessage.notification);
        }
      });

    // Subscribe to a topic (e.g., "all")
    messaging()
      .subscribeToTopic('all_users')
      .then(() => console.log('Subscribed to topic!'));

    // Foreground messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      // Handle the foreground message here
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || 'You have a new notification.',
        [{ text: 'OK' }],
      );
    }
    );

    // auto-register 
    messaging().registerDeviceForRemoteMessages();

    return unsubscribe;

    // check notification permission
    checkNotificationPermission().then(() => {
      console.log('Notification permission checked');
    }
    ).catch(error => {
      console.error('Error checking notification permission:', error);
    }
    );
  }, []);

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
