import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewProps, Alert } from 'react-native'
import React, { useState } from 'react'
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useNavigation } from '@react-navigation/native';
import { addDoc, collection } from 'firebase/firestore';
import { processAuthError } from '@/utils/utils';


export type RegisterScreenProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function RegisterScreen({ style, lightColor, darkColor, ...otherProps }: RegisterScreenProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onHandleRegister = () => {
    if (email !== '' && password !== '' && confirmPassword !== '') {
      if (password !== confirmPassword) {
        Alert.alert("Password does not match.")
      } else {
        createUserWithEmailAndPassword(auth, email, password).then(async (res) => {
          console.log("User created successfully");
          await addDoc(collection(db, 'Users'), {
            userId: res.user.uid,
            emailId: res.user.email,
            username: res.user.email?.split('@')[0],
          })
        }).catch((error) => processAuthError(error));
      }
    }
  }

  return (
    <ThemedView style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Sign up</ThemedText>
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <TextInput style={styles.background} placeholder='Email'
          keyboardType='email-address' textContentType='emailAddress'
          autoCapitalize='none'
          value={email}
          onChangeText={(text) => setEmail(text)} />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <TextInput style={styles.background} placeholder='Password'
          secureTextEntry={true} textContentType='password'
          autoCorrect={false} autoCapitalize='none'
          value={password}
          onChangeText={(text) => setPassword(text)} />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <TextInput style={styles.background} placeholder='Confirm password'
          secureTextEntry={true} textContentType='password'
          autoCorrect={false} autoCapitalize='none'
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)} />
      </ThemedView>
      <TouchableOpacity style={styles.button} onPress={onHandleRegister}>
        <Text>Register</Text>
      </TouchableOpacity>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="default">Already have an account?</ThemedText>
        <TouchableOpacity onPress={() => navigation.navigate("Login" as never)}><ThemedText type="link">Sign in</ThemedText></TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    width: 100,
    height: 30,
    alignContent: 'center',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
