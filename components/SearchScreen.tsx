import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { ThemedView } from './ThemedView';
import { SimpleLineIcons } from '@expo/vector-icons';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { ThemedText } from './ThemedText';
import { db, userRef } from '@/firebase/config';
import { useNavigation } from '@react-navigation/native';

const userAvatar = require('../assets/images/man.png');

const SearchScreen = () => {
  const [searchFriend, setSearchFriend] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [found, setFound] = useState(false);
  const [searchFriendsName, setSearchFriendsName] = useState([]);
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (searchFriend !== '') {
      setSearchFriendsName([]);
      setIsLoading(true);

      const queryResult = query(userRef,
        where('username', '>=', searchFriend.trim()),
        where('username', '<=', searchFriend.trim() + '\uf8ff'));

      const querySnapshot = await getDocs(queryResult);
      if (!querySnapshot.empty) {
        let friends: any = [];
        querySnapshot.forEach((document) => {
          const { username } = document.data();
          friends.push({ username });

        })
        setSearchFriendsName(friends);
        setFound(true);
      } else {
        setFound(false);
      }
      setIsLoading(false);

    }
  }

  return (
    <ThemedView style={{}}>
      <ThemedView style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <TextInput style={{ backgroundColor: 'gray', padding: 2, margin: 5, width: 200, height: 35, borderRadius: 12, alignContent: 'center' }}
          placeholder='Search' autoCapitalize='none' keyboardType='default' autoFocus={true} value={searchFriend} onChangeText={(text) => setSearchFriend(text)} />
        <TouchableOpacity onPress={handleSearch} style={{ width: 35, height: 35, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: 'orange' }}>
          <SimpleLineIcons name="magnifier" size={24} color="black" />
        </TouchableOpacity>
      </ThemedView>
      {isLoading && <ActivityIndicator size={'large'} color='gray' />}
      {found ? (
        <ThemedView>
          <FlatList data={searchFriendsName} style={{ margin: 10 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.username}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => navigation.replace('Chat', { friendName: item.username })}>
                <ThemedView style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50 }}>
                  <Image source={userAvatar} style={{ height: 35, width: 35, borderRadius: 50 }} />
                  <ThemedText style={{ padding: 10 }}>{item.username}</ThemedText>
                </ThemedView>
              </TouchableOpacity>
            )}
          />
        </ThemedView>
      ) : (
        <ThemedView>
          <ThemedText>Not Found</ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  )
}

export default SearchScreen