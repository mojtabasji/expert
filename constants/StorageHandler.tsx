import EncryptedStorage from 'react-native-encrypted-storage';

export const StorageHandler = {
    async storeData(key: string, value: string) {
        try {
            await EncryptedStorage.setItem(key, value);
        } catch (error) {
            console.log("error in storing data");
        }
    },
    async retrieveData(key: string) {
        try {
            const value = await EncryptedStorage.getItem(key);
            if (value !== null) {
                return value;
            }
        } catch (error) {
            console.log("error in retrieving data");
        }
    },
    async removeData(key: string) {
        try {
            await EncryptedStorage.removeItem(key);
        } catch (error) {
            console.log("error in removing data");
        }
    }
}




