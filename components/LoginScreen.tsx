import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewProps } from 'react-native'
import React, { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { registerIndieID, unregisterIndieDevice } from 'native-notify';


export type LoginScreenProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function LoginScreen({ style, lightColor, darkColor, ...otherProps }: LoginScreenProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onHandleLogin = () => {
     if (email !== '' && password !== '') {
       signInWithEmailAndPassword(auth, email, password).then(() => {
        registerIndieID(`${email}`, 23174, 'j4h5Oj9tLmoBgdDOzo7U9r');
       })
     }
  }


  return (
    <>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Sign in</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <TextInput style={styles.background} placeholder='Enter email' 
                   keyboardType='email-address' textContentType='emailAddress'
                   autoCapitalize='none'
                   value={email}
                   onChangeText={(text) => setEmail(text)}/>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <TextInput style={styles.background} placeholder='Enter password'
                   secureTextEntry={true} textContentType='password'
                   autoCorrect={false} autoCapitalize='none'
                   value={password}
                   onChangeText={(text) => setPassword(text)}/>
      </ThemedView>
      <TouchableOpacity style={styles.button} onPress={onHandleLogin}>
        <Text>Login</Text>
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default">Don't have an account?</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate("Register" as never)}><ThemedText type="link">Sign up</ThemedText></TouchableOpacity>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 200,
    width: 500,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  background: {
    color: 'gray',
    width: 160,
    height: 30,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 2,
  },
 button: {
   
   backgroundColor: 'gray',
   width: 200,
   height: 30,
   alignItems: 'center',
   justifyContent: 'center',
   marginTop: 20,
   marginLeft: 90,
 },
});
