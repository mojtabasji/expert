### run debug
to run the app in debug mode, you should run the following command:
```npm run start```


### release apk

before make the release apk, you should set the keystore file in the android/app/build.gradle file, and set the keystore password, key alias and key password in the android/gradle.properties file.

```
// android/gradle.properties
:
MYAPP_UPLOAD_STORE_FILE=keystore_name.keystore
MYAPP_UPLOAD_KEY_ALIAS=key_alias
MYAPP_UPLOAD_STORE_PASSWORD=********
MYAPP_UPLOAD_KEY_PASSWORD=********  
```

you can create a keystore file by running the following command:
```keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000```


to get the release apk, you should run the following command:
```cd android && ./gradlew assembleRelease```

### run the app
to run the app, you should run the following command:
```react-native run-android```

