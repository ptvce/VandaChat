import { StyleSheet,View ,Alert ,TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db, userRef } from '@/firebase/config'
import { AuthenticatedUserContext } from '@/context/AuthenticationContext'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
    const navigation = useNavigation();
    const {user, setUser} = useContext(AuthenticatedUserContext);
    const [username, setUsername] = useState('');
    const [userEmail, setUserEmail] = useState('');
    
    async function DocFinder(queryResult : any) {
        const querySnapshot = await getDocs(queryResult);
        querySnapshot.forEach((doc) => {
          if (username === '') {
            const {username, emailId} = doc.data();
            setUsername(username);
            setUserEmail(emailId);
          }
        })
    }
    useEffect(() => {
      if (!user) return;
      
        const queryResult = query(userRef, where('emailId', '==', user.email));
        DocFinder(queryResult);
    },[]);

    const handleSignOut = () => {
      signOut(auth).then(() => {
        setUser(null);
        navigation.navigate('Login' as never);
      }).catch((error) => {
         Alert.alert(error.message)
      })
    }

  return (
    <ThemedView>
       <ThemedView style={styles.titleContainer}>
         <ThemedText type="title">Welcome, <ThemedText style={styles.usernameTitle}>{username}</ThemedText></ThemedText>
       </ThemedView>
       <TouchableOpacity style={{ borderRadius: 12, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', margin:50 }}>
         <Ionicons name="camera" size={50} color="white" />
       </TouchableOpacity>
       <ThemedView style={{ borderRadius: 15, padding: 20}}>
           <ThemedText>{username}</ThemedText>
           <ThemedText>{userEmail}</ThemedText>
       </ThemedView>
       <ThemedView>
         <TouchableOpacity onPress={handleSignOut} style={{borderRadius: 7, height: 30,  backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center', margin:50, }}>
            <ThemedText>Sign out</ThemedText>
         </TouchableOpacity>
       </ThemedView>
    </ThemedView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      padding: 10,
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
    usernameTitle: {
      color: 'red',
      fontSize:30
    },
  });