import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
//import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useContext, useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Image, StyleSheet,Text, Platform, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RegisterScreen } from '@/components/RegisterScreen';
import { LoginScreen } from '@/components/LoginScreen';
import HomeScreen from './(tabs)';
import AuthenticatedUserProvider, { AuthenticatedUserContext } from '@/context/AuthenticationContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase/config';
import ProfileScreen from '@/components/ProfileScreen';
import SearchScreen from '@/components/SearchScreen';
import ChatScreen from '@/components/ChatScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const loadingGif = require('./../assets/images/loading.gif');

function RootNavigator() {
  const {user, setUser} = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setIsLoading(false);
      if (user) {
        setUser(user);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }); 
  },[]);

  return(
    <NavigationContainer independent={true}>
       {!user && isLoading ? 
         (<Image source={loadingGif} style={{height: '100%' , width: 'auto'}} />) : !user && !isLoading ? (<AuthStack />) : (<MainStack />)}
    </NavigationContainer>
  )
}

function AuthStack() {
  return (
    <Stack.Navigator initialRouteName="Login" >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function MainStack() {
  return(
      <Stack.Navigator>
        <Stack.Screen name="VandaChat" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Search" component={SearchScreen} options={{title: 'With whom '}}/>
        <Stack.Screen name="Chat" component={ChatScreen} options={{title: ''}}/>


      </Stack.Navigator>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="+not-found" />
    //   </Stack> 
    // </ThemeProvider>
    <AuthenticatedUserProvider>
      <RootNavigator />
    </AuthenticatedUserProvider>
  );
}
