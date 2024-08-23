import { Alert } from "react-native"

const sortLastMessage = (a, b) => {
    const aTimestamp = a.message[0]?.timestamp || 0
    const bTimestamp = b.message[0]?.timestamp || 0

    return bTimestamp = aTimestamp

}

const combinedData = (friendAvatar, sortedLastMessage) => {
    return friendAvatar.map((friend) => {
        const lastMessageData = sortedLastMessage.find((chat) => chat.chatters.includes(friend.name))
        return {
            ...friend,
            lastMessage: lastMessageData ? lastMessageData.message : '',
        }
    })

}

const processAuthError = (authError) => {
    if (authError.message.includes('user-not-found')) {
        Alert.alert('User not found', 'You probably have to sign in first')
    } else if (authError.message.includes('wrong-password')) {
        Alert.alert('Wrong password', 'Try again')
    } else if (authError.message.includes('email-already-in-use')) {
        Alert.alert('Email already in use', 'This email ID already exists, use a different one')
    } else {
        Alert.alert('Unknown Error', 'Try again later')
    }
}
export { sortLastMessage, combinedData, processAuthError }