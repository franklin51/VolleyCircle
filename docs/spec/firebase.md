# Firebase Documentation

This documentation is loaded from Context7 and provides key examples and patterns for Firebase integration in React Native.

## Authentication

### Google Sign-In

```javascript
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

async function onGoogleButtonPress() {
  // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const signInResult = await GoogleSignin.signIn();

  // Try the new style of google-sign in result, from v13+ of that module
  idToken = signInResult.data?.idToken;
  if (!idToken) {
    // if you are using older versions of google-signin, try old style result
    idToken = signInResult.idToken;
  }
  if (!idToken) {
    throw new Error('No ID token found');
  }

  // Create a Google credential with the token
  const googleCredential = GoogleAuthProvider.credential(signInResult.data.idToken);

  // Sign-in the user with the credential
  return signInWithCredential(getAuth(), googleCredential);
}
```

### Anonymous Sign-In

```javascript
import { getAuth, signInAnonymously } from '@react-native-firebase/auth';

signInAnonymously(getAuth())
  .then(() => {
    console.log('User signed in anonymously');
  })
  .catch(error => {
    if (error.code === 'auth/operation-not-allowed') {
      console.log('Enable anonymous in your firebase console.');
    }
    console.error(error);
  });
```

### Phone Number Verification

```jsx
import React, { useState, useEffect } from 'react';
import { Button, TextInput, Text } from 'react-native';
import {
  PhoneAuthProvider,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  verifyPhoneNumber,
} from '@react-native-firebase/auth';

export default function PhoneVerification() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState('');

  // Handle user state changes
  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // Handle the verify phone button press
  async function handlePhoneNumberVerification(phoneNumber) {
    const confirmation = await verifyPhoneNumber(getAuth(), phoneNumber);
    setConfirm(confirmation);
  }

  // Handle confirm code button press
  async function confirmCode() {
    try {
      const credential = PhoneAuthProvider.credential(confirm.verificationId, code);
      let userData = await getAuth().currentUser.linkWithCredential(credential);
      setUser(userData.user);
    } catch (error) {
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking error');
      }
    }
  }

  if (initializing) return null;

  if (!user) {
    return <Button title="Login" onPress={() => createAccount()} />;
  } else if (!user.phoneNumber) {
    if (!confirm) {
      return (
        <Button
          title="Verify Phone Number"
          onPress={() =>
            handlePhoneNumberVerification('ENTER A VALID TESTING OR REAL PHONE NUMBER HERE')
          }
        />
      );
    }
    return (
      <>
        <TextInput value={code} onChangeText={text => setCode(text)} />
        <Button title="Confirm Code" onPress={() => confirmCode()} />
      </>
    );
  } else {
    return (
      <Text>
        Welcome! {user.phoneNumber} linked with {user.email}
      </Text>
    );
  }
}
```

### Authentication State Listener

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { getAuth, onAuthStateChanged } from '@react-native-firebase/auth';

function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  function handleAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(getAuth(), handleAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );
}
```

## Firestore

### Installation

```bash
yarn add @react-native-firebase/firestore
```

### Basic Operations

```javascript
import firestore from '@react-native-firebase/firestore';

// Collection reference
const usersCollection = firestore().collection('Users');

// Document reference
const userDocument = firestore().collection('Users').doc('ABC');

// Add document with random ID
firestore()
  .collection('Users')
  .add({
    name: 'Ada Lovelace',
    age: 30,
  })
  .then(() => {
    console.log('User added!');
  });

// Add document with custom ID
firestore()
  .collection('Users')
  .doc('ABC')
  .set({
    name: 'Ada Lovelace',
    age: 30,
  })
  .then(() => {
    console.log('User added!');
  });

// Update document
firestore()
  .collection('Users')
  .doc('ABC')
  .update({
    age: 31,
  })
  .then(() => {
    console.log('User updated!');
  });
```

### Realtime Listeners

```javascript
import firestore from '@react-native-firebase/firestore';

function onResult(QuerySnapshot) {
  console.log('Got Users collection result.');
}

function onError(error) {
  console.error(error);
}

firestore().collection('Users').onSnapshot(onResult, onError);
```

### React Hook Integration

```jsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

function Users() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const subscriber = firestore()
      .collection('Users')
      .onSnapshot(querySnapshot => {
        const users = [];

        querySnapshot.forEach(documentSnapshot => {
          users.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });

        setUsers(users);
        setLoading(false);
      });

    // Unsubscribe from events when no longer in use
    return () => subscriber();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
  }

  // Render users...
}
```

### Pagination

```jsx
import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const userCollection = firestore().collection('Users');

const App = () => {
  const [lastDocument, setLastDocument] = useState();
  const [userData, setUserData] = useState([]);

  function LoadData() {
    let query = userCollection.orderBy('age');
    if (lastDocument !== undefined) {
      query = query.startAfter(lastDocument);
    }
    query.limit(3)
        .get()
        .then(querySnapshot => {
          setLastDocument(querySnapshot.docs[querySnapshot.docs.length - 1]);
          MakeUserData(querySnapshot.docs);
        });
  }

  function MakeUserData(docs) {
    let templist = [];
    docs.forEach((doc, i) => {
      let temp = (
        <View key={i} style={{ margin: 10 }}>
          <Text>{doc._data.name}</Text>
          <Text>{doc._data.age}</Text>
        </View>
      );
      templist.push(temp);
    });
    setUserData(templist);
  }

  return (
    <View>
      {userData}
      <Button
        onPress={() => {
          LoadData();
        }}
        title="Load Next"
      />
    </View>
  );
};
```

### Emulator Connection

```jsx
import '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Set these before any read/write operations occur
if (__DEV__) {
  firestore().useEmulator('localhost', 8080);
}

const db = firestore();
```

## Cloud Functions

### Installation

```bash
yarn add @react-native-firebase/functions
```

### Securing Functions

```javascript
exports.listProducts = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Endpoint requires authentication!');
  }

  return products;
});
```

## Cloud Messaging

### Save Device Token

```jsx
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

async function saveTokenToDatabase(token) {
  // Assume user is already signed in
  const userId = auth().currentUser.uid;

  // Add the token to the users datastore
  await firestore()
    .collection('users')
    .doc(userId)
    .update({
      tokens: firestore.FieldValue.arrayUnion(token),
    });
}

function App() {
  useEffect(() => {
    // Get the device token
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });

    // Listen to whether the token changes
    return messaging().onTokenRefresh(token => {
      saveTokenToDatabase(token);
    });
  }, []);
}
```

## Key Patterns

- Always handle authentication state changes with `onAuthStateChanged`
- Use Firestore real-time listeners for live data updates
- Implement proper error handling for all Firebase operations
- Use emulators during development
- Secure Cloud Functions with authentication checks
- Store FCM tokens in Firestore for push notifications
- Use transactions for critical data operations
- Implement pagination for large data sets