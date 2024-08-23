import { View, Text, ViewProps } from 'react-native'
import React from 'react'
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export type MessageItemProps = ViewProps & {
    item?: any;
    sender?: string;
  };
  
const MessageItem = ({item, sender}:  MessageItemProps) => {
  return (
    <ThemedView style={{flexDirection: 'row', justifyContent: item.sender === sender ? 'flex-end' : 'flex-start' , padding: 10}}>
      <ThemedView style={{ backgroundColor: item.sender === sender ? '#dcf8c6' : '#fff8c4', padding:10, borderRadius: 10, maxWidth: '80%', marginLeft: 10, marginRight: 10}}>
        <ThemedText style={{color: 'gray', fontSize: 14}}>{item.sender}</ThemedText>
        <ThemedText style={{}}>{item.message}</ThemedText>
      </ThemedView>
    </ThemedView>
  )
}

export default MessageItem