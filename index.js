/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import App from './App';
import { name as appName } from './app.json';

// Must be outside of any component
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('🔥 Message handled in the background!', remoteMessage);
    // Handle the background message here
    await onDisplayNotification(remoteMessage);
    // You can process data, trigger local notifications, etc.
});

async function onDisplayNotification(remoteMessage) {
    await notifee.displayNotification({
        title: remoteMessage.notification?.title,
        body: remoteMessage.notification?.body,
        android: {
            channelId: 'default',
        },
    });
}

AppRegistry.registerComponent(appName, () => App);
