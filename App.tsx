import React, { useEffect, useContext } from 'react';
import {
  SafeAreaView, ScrollView, StatusBar,
  StyleSheet, Text, useColorScheme, View,
} from 'react-native';
import axios from 'axios';
import PushNotification from 'react-native-push-notification';
import BackgroundService from 'react-native-background-actions';

import { api } from './constants/Const';
import { StorageHandler } from './constants/StorageHandler';
import LoginHandler from './constants/LoginHandler';
import NotificationHandler from './constants/NotificationHandler';
import Welcome from './screens/Welcome';
import BTabHandler from './screens/BTabHandler';

const veryIntensiveTask = async (taskDataArguments: any) => {
  // Handle notifications Here
  StorageHandler.retrieveData("notifications_is_enable").then(async data => {
    if (data == undefined) {
      StorageHandler.storeData("notifications_is_enable", "true");
    }
    if (data == "true" || data == undefined) {
      // For loop with a delay
      const { delay } = taskDataArguments;
      await new Promise(async (resolve) => {
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
              if (notification.is_pushed == "false") {
                not_ids.push(notification.id);
                PushNotification.localNotification({
                  channelId: 'com.bytecraft.expert.notification_channel_id',
                  title: notification.title,
                  message: notification.content,
                  playSound: true,
                  soundName: 'default',
                  invokeApp: true,
                });
              }
            });
            axios.post(api.set_push_notification_read, { notification_ids: not_ids }, {
              headers: {
                'Content-Type': 'application/json',
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
            BackgroundService.stop();
            return;
          }
        });
        BackgroundService.updateNotification({ taskDesc: 'New ExampleTask description' });
        await new Promise((resolve) => setTimeout(resolve, delay));
      });
    }
    if (data == "false") {
      BackgroundService.stop();
      return;
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
    delay: 1000 * 60 * 15,
  },
};

const InitializeBackgroundService = async () => {
  await BackgroundService.start(veryIntensiveTask, options);
}

// InitializeBackgroundService();


PushNotification.createChannel(
  {
    channelId: 'default_notification_channel_id', // Provide a unique channel ID
    channelName: 'Expert Notification Channel',
    channelDescription: 'A channel to categorize my notifications',
    soundName: 'default', // Optional, specify the default sound
    importance: 4, // Set the importance level (4 = high) 
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
