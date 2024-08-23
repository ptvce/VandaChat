import { Image, StyleSheet, Text, Platform, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { LoginScreen } from '@/components/LoginScreen';
import { RegisterScreen } from '@/components/RegisterScreen';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { signOut } from 'firebase/auth';
import { auth, chatRef, userRef } from '@/firebase/config';
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Entypo } from '@expo/vector-icons';
import { AuthenticatedUserContext } from '@/context/AuthenticationContext';
import { doc, onSnapshot, query, QuerySnapshot, where } from 'firebase/firestore';
import { combinedData, sortLastMessage } from '@/utils/utils';
import ChatItem from '@/components/ChatItem';

const userAvatar = require('./../../assets/images/man.png')

export default function HomeScreen() {

  const navigation = useNavigation();
  const { user } = useContext(AuthenticatedUserContext);
  const username = user.email.split('@')[0];
  const [friends, setFriends] = useState([]);
  const [friendsAvatar, setFriendsAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastMessage, setLastMessage] = useState([]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <Image source={userAvatar} />
        </TouchableOpacity>
      )
    });
  }, []);

  useEffect(() => {
    if (!user) return

    const fetchLoggedUserChats = async () => {
      setIsLoading(true);
      const queryResult = query(chatRef, where('chatters', '>=', `${username}`), where('chatters', '<=', `${username}` + '\uf8ff'));
      const queryResult2 = query(chatRef, where('chatters', '<=', `xx${username}`));


      let friendsArray: any[] = [];
      const unsubscribe = onSnapshot(queryResult, (querySnapshot) => {
        setIsLoading(false);

        querySnapshot.forEach((doc) => {
          if (doc.data().chatters.includes(username)) {
            const chats = doc.data().chatters;
            const friends = chats.replace(username, '').replace('xx', '');
            friendsArray.push(
              friends,
            );
            friendsArray = [... new Set(friendsArray)];
            setFriends(friendsArray as never);
          }
        })
      })
      const unsubscribe2 = onSnapshot(queryResult2, (querySnapshot) => {
        setIsLoading(false);
        querySnapshot.forEach((doc) => {
          if (doc.data().chatters.includes(username)) {
            const chats = doc.data().chatters;
            const friends = chats.replace(username, '').replace('xx', '');
            friendsArray.push(
              friends
            );
            friendsArray = [... new Set(friendsArray)];
            setFriends(friendsArray as never);
          }
        })
      })

      return () => {
        unsubscribe();
        unsubscribe2();

      }
    };
    fetchLoggedUserChats();
  }, [])

  useEffect(() => {
    if (!user) return
    let avatarsArray = [];
    let latestMessage: any[] = [];

    const unsubscribe = friends.map((friend) => {
      const queryResult = query(userRef, where('username', '==', friend));
      const unsubFriend = onSnapshot(queryResult, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const { emailId } = doc.data();
          avatarsArray.push({ name: friend, email: emailId });
          setFriendsAvatar([...avatarsArray]);
        })
      })
      const queryResult2 = query(chatRef, where('chatters', '==', `${username}xx${friend}`))
      const queryResult3 = query(chatRef, where('chatters', '==', `${friend}xx${username}`))

      const unsubChat = onSnapshot(queryResult2, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const conversation = doc.data().conversation;
          let lastMessage: any[] = [];
          if (conversation && conversation.length > 0)
            lastMessage = [conversation[conversation.length - 1]]

          latestMessage.push({
            chatters: doc.data().chatters,
            message: lastMessage,
          });
          setLastMessage([...latestMessage]);
        });
      });
      const unsubCha2 = onSnapshot(queryResult3, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const conversation = doc.data().conversation;
          let lastMessage: any[] = [];
          if (conversation && conversation.length > 0)
            lastMessage = [conversation[conversation.length - 1]]

          latestMessage.push({
            chatters: doc.data().chatters,
            message: lastMessage,
          });
          setLastMessage([...latestMessage]);
        });
      });

      return () => {
        unsubFriend();
        unsubChat();
        unsubCha2();
      }

    });

    return () => unsubscribe.forEach((unsub) => unsub());

  }, [friends])

  //console.log('lastMessage', JSON.stringify(lastMessage))

  const sortedLastMessage = lastMessage.sort();
  const combData = combinedData(friendsAvatar, sortedLastMessage);

  return (
    <>
      {isLoading ? (
        <ThemedView style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
          <ActivityIndicator size='large' color='orange' />
        </ThemedView>
      ) : (
        <FlatList data={combData} renderItem={({ item }) => (
          <ChatItem navigation={navigation} friend={item} />
        )} />
      )}
      <ThemedView style={{ flex: 1 }}>
        <ThemedView style={{ flexDirection: 'row-reverse', bottom: -100, right: 20 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Search' as never)} style={{ backgroundColor: 'orange', height: 50, width: 50, borderRadius: 50, alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}>
            <Entypo name='chat' size={30} color='black' />
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </>
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
});
