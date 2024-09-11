import { View, Text,  TextInput, TouchableOpacity, Image, KeyboardAvoidingView, StyleSheet, Platform, FlatList } from 'react-native'
import { KeyboardAwareFlatList, KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons'
import { AuthenticatedUserContext } from '@/context/AuthenticationContext'
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore'
import { chatRef, db } from '@/firebase/config'
import MessageItem from './MessageItem'
import axios from 'axios';

const userAvatar = require('../assets/images/man.png')

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [message, setMessage] = useState('');
    const { friendName, friendEmail } = route.params;
    const { user } = useContext(AuthenticatedUserContext);
    const sender = user.email.split('@')[0];
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef(null);
    const [isListReady, setIsListReady] = useState(false);


    const queryResult = query(chatRef, where('chatters', '==', `${sender}xx${friendName}`));
    const queryResult2 = query(chatRef, where('chatters', '==', `${friendName}xx${sender}`));

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <ThemedView style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialIcons name="arrow-back-ios" size={30} color="orange" />
                    </TouchableOpacity>
                    <Image source={userAvatar} style={{ height: 35, width: 35, borderRadius: 50, }} />
                    <ThemedText style={{ fontWeight: 'bold' }}>  {friendName}</ThemedText>
                </ThemedView>
            )
        })

    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            const querySnapshot = await getDocs(queryResult);
            const querySnapshot2 = await getDocs(queryResult2);
            if (!querySnapshot.empty || !querySnapshot2.empty) {

                let allMessages = querySnapshot.docs.map((doc) => doc.data().conversation)

                allMessages = allMessages.concat(
                    querySnapshot2.docs.map((doc) => doc.data().conversation)
                )
                allMessages.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds)

                setMessages(allMessages);
            }
        }
        const unsub1 = onSnapshot(queryResult, (snapshot) => {
            const allMessages = snapshot.docs.map((doc) => doc.data().conversation)
            setMessages(allMessages);
        })
        const unsub2 = onSnapshot(queryResult2, (snapshot) => {
            const allMessages = snapshot.docs.map((doc) => doc.data().conversation)
            setMessages(allMessages);
        })

        fetchMessages();
        return () => {
            unsub1();
            unsub2();
        }
    }, [])


    const handleSubmit = async () => {
        const querySnapshot = await getDocs(queryResult);
        const querySnapshot2 = await getDocs(queryResult2);

        if (!querySnapshot.empty || !querySnapshot2.empty) {
            querySnapshot.forEach((document) => {
                updateDoc(doc(db, 'Chats', document.id), {
                    conversation: [
                        ...document.data().conversation,
                        {
                            message: message,
                            timestamp: Timestamp.now(),
                            sender: sender,
                        }
                    ]
                }).catch((error) => console.log(error))
            })
            querySnapshot2.forEach((document) => {
                updateDoc(doc(db, 'Chats', document.id), {
                    conversation: [
                        ...document.data().conversation,
                        {
                            message: message,
                            timestamp: Timestamp.now(),
                            sender: sender,
                        }
                    ]
                }).catch((error) => console.log(error))
            })

        } else {
            await addDoc(collection(db, 'Chats'), {
                chatters: `${sender}xx${friendName}`,
                conversation: [
                    {
                        message: message,
                        timestamp: Timestamp.now(),
                        sender: sender
                    },
                ],
            });
        }

        // async function RetryRequest(maxRetries = 3) {
        //     let retries = 0;
        //     while (retries < maxRetries) {

        //     }
        //     try {
        //         const response = await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
        //             subID: `${friendEmail}`,
        //             appId: 23174,
        //             appToken: 'j4h5Oj9tLmoBgdDOzo7U9r',
        //             title: `${sender} - VandaChat`,
        //             message: `${message}`
        //         });
        //         console.log('notification');
        //         return response

        //     } catch (error) {
        //         console.log('request failed, retrying ...')
        //         retries++
        //     }
        // }

        // RetryRequest();
        setMessage('');

    };

    useEffect(() => {
        setIsListReady(true);
    }, [messages])

    type ItemProps = { title: string };

    const Item = ({ title }: ItemProps) => (
        <View >
            <Text>{title}</Text>
        </View>
    );

    return (
        // <KeyboardAwareScrollView>

        <ThemedView style={{ flex: 1 }}>
            {/* {messages[0] !== undefined && ( */}
                <ThemedView style={{ flex: 1 }}>
                    <KeyboardAwareFlatList initialNumToRender={10} ref={flatListRef} onContentSizeChange={() => {
                        if (isListReady)
                            flatListRef?.current?.scrollToEnd({ animated: true })
                    }}
                        data={messages[0]}
                        keyExtractor={(item) => item.timestamp}
                        renderItem={({ item }) => <MessageItem item={item} sender={sender} />}
                    />
                    <ThemedView style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: 10, marginBottom: 20, }}>
                        <TextInput style={{ backgroundColor: 'gray', height: 40, borderRadius: 5, flex: 1, padding: 5, }}
                            placeholder='type your message here ...' multiline={true}
                            value={message} onChangeText={(text) => setMessage(text)} />
                        <TouchableOpacity onPress={handleSubmit}>
                            <MaterialCommunityIcons name="send-circle" size={40} color="orange" style={{ marginLeft: 4 }} />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
               
             {/* )} */}
        </ThemedView>

    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        //height: '10%', 
        //flexDirection: 'row' , 
    },
    input: {
        padding: 100,
        borderColor: 'gray',
        borderWidth: 1,

        backgroundColor: 'gray',
        //height:35, 
        borderRadius: 5,
        //flex: 1,
        width: 300,

    },
});