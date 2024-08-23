import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'

const userAvatar = require('../assets/images/man.png')

const ChatItem = ({navigation, friend}) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', {
        friendName: friend.name,
        friendEmail: friend.email,
    })} 
    style={{marginRight: 5}}>
        <ThemedView style={{flexDirection: 'row', alignItems: 'center', marginLeft: 5, paddingRight: 5, borderRadius: 12}}>
            <Image source = {userAvatar} style={{height: 35, width: 35, borderRadius: 50}} />
            <ThemedView>
                <ThemedText style={{fontWeight:'medium'}}>  {friend.name}</ThemedText>
                <ThemedText style={{color:'gray', fontSize:14, maxHeight: 30}}>  {friend.lastMessage[0]?.message}</ThemedText>

            </ThemedView>
        </ThemedView>
    </TouchableOpacity>
  )
}

export default ChatItem