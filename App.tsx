import React, { useEffect, useContext } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, useColorScheme, View, Alert, Platform
} from 'react-native';
import axios from 'axios';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from 'react-native-push-notification';
import BackgroundService from 'react-native-background-actions';

import { api } from './constants/Const';
import { StorageHandler } from './constants/StorageHandler';
import LoginHandler from './constants/LoginHandler';
import NotificationHandler from './constants/NotificationHandler';
import Welcome from './screens/Welcome';
import BTabHandler from './screens/BTabHandler';


// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token: any) {
    console.log("TOKEN:", token);
  },

  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification: any) {
    console.log("NOTIFICATION:", notification);

    // process the notification

    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
  onAction: function (notification: any) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);

    // process the action
  },

  // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
  onRegistrationError: function (err: any) {
    console.error(err.message, err);
  },

  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,

  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: Platform.OS === 'ios',
});


const sleep = (time: any) => new Promise((resolve: any) => setTimeout(() => resolve(), time));

const veryIntensiveTask = async (taskDataArguments: any) => {
  // Example of an infinite loop task
  const { delay } = taskDataArguments;
  await new Promise(async (resolve) => {
    while (BackgroundService.isRunning()) {
      console.log("Running background service");
      let session: any;
      await StorageHandler.retrieveData("session_id").then(data => {
        session = `session_id=${data};`
      });
      axios.post(api.get_push_notification, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Cookie': session
        },
        withCredentials: true
      }).then(res => {
        if (res.data.result == "true") {
          let not_ids: any = [];
          res.data.notifications.forEach((notification: any) => {
            if (notification.is_pushed == "false" || notification.is_pushed == false) {
              not_ids.push(notification.id);
              PushNotification.localNotification({
                channelId: 'com.bytecraft.expert.notification_channel_id',
                title: notification.title,
                message: notification.content,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                invokeApp: true,
                actions: [],
              });
            }
          });
          let form = new FormData();
          form.append("notification_ids", not_ids.join(","));
          axios.post(api.set_push_notification_read, form, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Cookie': session
            },
            withCredentials: true
          }).then(res => {
            if (res.data.result == "true") {
              console.log("Notifications are marked as pushed");
            }
          }).catch(err => { console.log(err); });
        }
      }).catch(err => { console.log(err); });
      StorageHandler.retrieveData("notifications_is_enable").then(data => {
        if (data == "false") {
          console.log("background service is stopped here ");
          BackgroundService.stop();
          return;
        }
      });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Expert',
  taskTitle: 'Expert Notification Service',
  taskDesc: 'expert notification service is running in the background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'https://expert.bytecraft.ir',
  parameters: {
    delay: 1000 * 60 * 5,
  },
};

const InitializeBackgroundService = async () => {
  StorageHandler.retrieveData("notifications_is_enable").then(async data => {
    if (data == undefined) {
      StorageHandler.storeData("notifications_is_enable", "true");
    }
    if (data == "true" || data == undefined) {
      await BackgroundService.start(veryIntensiveTask, options);
      await BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
    }
  });
}

// InitializeBackgroundService();


PushNotification.createChannel(
  {
    channelId: 'com.bytecraft.expert.notification_channel_id', // Provide a unique channel ID
    channelName: 'Expert Notification Channel',
    channelDescription: 'A channel to categorize my notifications',
    soundName: 'default', // Optional, specify the default sound
    vibrate: true, // Enable vibration
  },
  (created: any) => console.log(`Channel created: ${created}`)
);


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
          // PushNotification.requestPermissions();
          if (BackgroundService.isRunning() == false) {
            InitializeBackgroundService();
          }
        }
        else {
          BackgroundService.stop();
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
