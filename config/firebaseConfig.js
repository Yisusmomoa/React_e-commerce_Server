import "dotenv/config"
const APIKEY=process.env.API_KEY
const AUTHDOMAIN=process.env.AUTH_DOMAIN
const PROJECTID=process.env.PROJECT_ID
const STORAGEBUCKET=process.env.STORAGE_BUCKET
const MESSAGINGSENDERID=process.env.MESSAGING_SENDER_ID
const APPID=process.env.APP_ID
const MEASUREMENTID=process.env.MEASUREMENT_ID

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTHDOMAIN,
    projectId: PROJECTID,
    storageBucket: STORAGEBUCKET,
    messagingSenderId: MESSAGINGSENDERID,
    appId: APPID,
    measurementId: MEASUREMENTID
};