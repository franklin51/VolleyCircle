# React Navigation Documentation

This documentation is loaded from Context7 and provides key examples and patterns for React Navigation in React Native.

## Basic Setup

### Static Navigation (Recommended)

```javascript
import * as React from 'react';
import { View, Text } from 'react-native';
import {
  createStaticNavigation,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from '@react-navigation/elements';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('Details')}>
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    Details: DetailsScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

### Dynamic Navigation (Alternative)

```javascript
import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}
```

## Navigation Methods

### Passing Parameters

```javascript
function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        onPress={() => {
          // Navigate to the Details route with params
          navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      >
        Go to Details
      </Button>
    </View>
  );
}

function DetailsScreen({ route }) {
  const navigation = useNavigation();
  
  // Get the params
  const { itemId, otherParam } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text>
      <Button
        onPress={() =>
          navigation.push('Details', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      >
        Go to Details... again
      </Button>
      <Button onPress={() => navigation.navigate('Home')}>Go to Home</Button>
      <Button onPress={() => navigation.goBack()}>Go back</Button>
    </View>
  );
}
```

### Navigation Actions

```javascript
// Navigate to a route
navigation.navigate('Details')

// Push a new screen (even if already on same route)
navigation.push('Details')

// Go back to previous screen
navigation.goBack()

// Replace current screen
navigation.replace('Profile', { owner: 'Michaś' })
```

## Nested Navigation

### Stack + Tab Navigator

```javascript
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate('More')}>Go to More</Button>
      <Button
        onPress={() => navigation.navigate('More', { screen: 'Messages' })}
      >
        Go to Messages
      </Button>
    </View>
  );
}

const MoreTabs = createBottomTabNavigator({
  screens: {
    Feed: FeedScreen,
    Messages: MessagesScreen,
  },
});

const RootStack = createNativeStackNavigator({
  screens: {
    Home: HomeScreen,
    More: {
      screen: MoreTabs,
      options: {
        headerShown: false,
      },
    },
  },
});
```

### Navigating to Nested Screens

```javascript
// Navigate to a nested screen
navigation.navigate('More', { screen: 'Messages' });

// Navigate with parameters
navigation.navigate('More', {
  screen: 'Messages',
  params: { user: 'jane' },
});

// Navigate to deeply nested screen
navigation.navigate('Home', {
  screen: 'Settings',
  params: {
    screen: 'Sound',
    params: {
      screen: 'Media',
    },
  },
});
```

## Screen Options

### Static Options

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{
    title: 'My Profile',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
  }}
/>
```

### Dynamic Options with Function

```jsx
<Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={({ route, navigation }) => ({
    title: route.params.userId,
  })}
/>
```

## Screen Groups

```jsx
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
  <Stack.Group
    screenOptions={({ navigation }) => ({
      presentation: 'modal',
      headerLeft: () => <CancelButton onPress={navigation.goBack} />,
    })}
  >
    <Stack.Screen name="Settings" component={Settings} />
    <Stack.Screen name="Share" component={Share} />
  </Stack.Group>
</Stack.Navigator>
```

## Deep Linking Configuration

### Static Configuration

```javascript
const RootStack = createNativeStackNavigator({
  screens: {
    Profile: {
      screen: ProfileScreen,
      linking: {
        path: 'u/:userId',
        parse: {
          userId: (id) => id.replace(/^@/, ''),
        },
        stringify: {
          userId: (id) => `@${id}`,
        },
      },
    },
    Chat: {
      screen: ChatScreen,
      linking: 'chat/:chatId',
    },
  },
});
```

### Dynamic Configuration

```javascript
const config = {
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Profile: 'users/:id',
        Settings: 'settings',
      },
    },
  },
};
```

### Catch-All Routes (404 Handling)

```javascript
// Static config
const RootStack = createStackNavigator({
  screens: {
    Home: {
      screen: HomeTabs,
    },
    NotFound: {
      screen: NotFoundScreen,
      linking: {
        path: '*',
      },
    },
  },
});

// Dynamic config
const config = {
  screens: {
    Home: {
      initialRouteName: 'Feed',
      screens: {
        Profile: 'users/:id',
        Settings: 'settings',
      },
    },
    NotFound: {
      path: '*',
    },
  },
};
```

## Custom 404 Screen

```javascript
function NotFoundScreen({ route }) {
  if (route.path) {
    return <WebView source={{ uri: `https://mywebsite.com/${route.path}` }} />;
  }

  return <Text>This screen doesn't exist!</Text>;
}
```

## Screen Tracking

```javascript
import analytics from '@react-native-firebase/analytics';

// gets the current screen from navigation state
function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

const AppContainer = createAppContainer(AppNavigator);

export default () => (
  <AppContainer
    onNavigationStateChange={(prevState, currentState, action) => {
      const currentRouteName = getActiveRouteName(currentState);
      const previousRouteName = getActiveRouteName(prevState);

      if (previousRouteName !== currentRouteName) {
        analytics().setCurrentScreen(currentRouteName, currentRouteName);
      }
    }}
  />
);
```

## Navigation Elements

### Button Component

```javascript
import { Button } from '@react-navigation/elements';

<Button screen="Profile" params={{ userId: 'jane' }}>
  Go to Profile
</Button>
```

## Advanced Patterns

### Custom Layout with Error Boundary

```jsx
<Stack.Screen
  name="MyScreen"
  component={MyScreenComponent}
  layout={({ children }) => (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <View style={styles.fallback}>
            <Text style={styles.text}>Loading…</Text>
          </View>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  )}
/>
```

### Route Object Structure

```javascript
{
  key: 'B',
  name: 'Profile',
  params: { id: '123' }
}
```

## Key Patterns

- Use static navigation configuration for better type safety
- Always handle route parameters safely with optional chaining
- Use `navigate()` for jumping to screens, `push()` for stacking
- Implement proper error boundaries and 404 handling
- Configure deep linking for better UX
- Use screen groups for modal presentations
- Track screen views for analytics
- Prefer nested navigators over complex single navigators
- Use `useNavigation` hook in functional components
- Handle initial routes properly in nested navigators