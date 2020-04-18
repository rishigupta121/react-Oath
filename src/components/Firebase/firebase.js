import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
    apiKey: "AIzaSyAvU9Zijuaal7YxqytXV8QbvSJpm2y7b_c",
    authDomain: "orderme-9dc52.firebaseapp.com",
    databaseURL: "https://orderme-9dc52.firebaseio.com",
    projectId: "orderme-9dc52",
    storageBucket: "gs://orderme-9dc52.appspot.com/",
    messagingSenderId: "127530783009",
    appId: "1:127530783009:web:08ea5015da3a4b79f36e60"
};

class Firebase {
    constructor() {
        app.initializeApp(config);
        this.auth = app.auth();
        this.db = app.database();
        this.storage = app.storage();
    }
}

export default Firebase;