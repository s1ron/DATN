import { gql } from '@apollo/client';

export const CollapseConversationAndUserInFoGQL = gql`
    query CONVERANDINFO($userId:UUID!){
        GetCollapseConversations(userId: $userId){
            isGroup
            conversationId
            conversationName
            isMessageRequest
            conversationImagePath
            isBlock
            blockBy
            conversationId
            quickMessage
            lastMessage {
                id
                conversationId
                senderId
                content
                messageType
                sendAt
            }
            createAt
            isFavoriteConversation
            authorId
            participantUser{
                lastReadMessageId
                nickName
                userId
                firstName
                lastName
                email
                profileImagePath
                profileDescription
                userName
                gender
            }
        }
        GetUserById(userId: $userId) {
            userId
            gender
            userName
            firstName
            lastName
            profileImagePath
            profileDescription
            phoneNumber
            dob
            email
        }
        GetOnlineFriends(userId: $userId){
            friendId
            addAt
            firstName
            lastName
            dob
            profileDescription
            profileImagePath
            gender
        }
    }
`
export const FristMessageGQL = gql`
    query FirstMessage($conversationId: Long!){
        GetFirstMessages(conversationId: $conversationId) {
            isGroup
            conversationName
            conversationId
            authorId
            isMessageRequest
            conversationImagePath
            isBlock
            blockBy
            conversationId
            quickMessage
            conversationTheme {
                id
                themeName
                bgType
                bgColor
                ownMessageColor
                friendMessageColor
            }
            participantUser{
                lastReadMessageId
                nickName
                userId
                userName
                firstName
                lastName
                email
                profileImagePath
                profileDescription
            }
            messages{
                id
                conversationId
                senderId
                content
                messageType
                sendAt
                filePath
                fileSize
                messageReaction{
                    userId
                    firstName
                    lastName
                    userName
                    profileImagePath
                    reactionType
                    messageId
                }
            }
        }
    }

`
export const GetOnlineFriends = gql`
    query($userId:UUID!){
        GetOnlineFriends(userId: $userId){
            friendId
            addAt
            firstName
            lastName
            dob
            profileDescription
            profileImagePath
            gender
        }
    }
`
export const GetFriendsGQl = gql`
    query Friends($userId:UUID!){
        GetFriends(userId: $userId){
            friendId
            addAt
            firstName
            lastName
            dob
            profileDescription
            profileImagePath
            gender
        }
    }
`
export const FindUsersByKeywordGQL = gql`
    query($keyWord:String!){
        FindUsersByKeyword(keyWord: $keyWord){
            id
            lastName
            firstName
            profileImagePath
        }
    }
`
export const GetFriendsRequestGQL = gql`
    query($userId:UUID!){
        GetFriendRequest(userId:$userId){
            friendRequestId
            sendAt
            senderId
            firstName
            lastName
            dob
            gender
            profileImagePath
            profileDescription
        }
    }
`
export const GetUserAndFriendStatusGQL = gql`
    query($userId:UUID!, $friendId: UUID!){
        GetUserAndFriendStatus(userId:$userId, friendId: $friendId){
            gender
            lastName
            firstName
            profileImagePath
            profileImagePath
            profileDescription
            dob
            email
            phoneNumber
            userId
            friendStatus {
                isFriend
                isSendingRequest
                isReceiverRequest
                friendRequestId
            }
        }
    }
`
export const GetCollapseConversationByConversationIdGQL = gql`
    query($userId:UUID!, $conversationId:Long!){
        GetCollapseConversationByConversationId(userId: $userId, conversationId: $conversationId) {
            isGroup
            conversationId
            conversationName
            isMessageRequest
            conversationImagePath
            isBlock
            blockBy
            conversationId
            quickMessage
            lastMessage {
                id
                conversationId
                senderId
                content
                messageType
                sendAt
            }
            createAt
            isFavoriteConversation
            authorId
            participantUser{
                lastReadMessageId
                nickName
                userId
                firstName
                lastName
                email
                profileImagePath
                profileDescription
                userName
                gender
            }
        }
    }
`
export const GetSystemImagesGQL = gql`
    query($type: String!){
        GetSystemImages(type: $type){
            id
            filePath
            type
            description
        }
    }
`
export const CheckFriendStatusGQL = gql`
    query($userId:UUID!, $friendId: UUID!){
        CheckFriendStatus (userId:$userId, friendId: $friendId){
            isFriend
            isSendingRequest
            isReceiverRequest
            friendRequestId
        }
    }
`
export const GetListConversationThemeGQL = gql`
    query{
        GetListConversationTheme{
            id
            bgType
            bgColor
            friendMessageColor
            ownMessageColor
            themeName
        }
    }
`
export const GetConversationAttachmentGQL = gql`
    query($conversationId:Long!){
        GetConversationAttachment(conversationId: $conversationId){
            id
            messageId
            filePath
            fileSize
        }
    }
`
export const GetContinueMessageGQL = gql`
    query($conversationId:Long!, $lastMessageId:Long!){
        GetContinueMessage(conversationId: $conversationId, lastMessageId: $lastMessageId){
            id,
            conversationId
            senderId
            content
            messageType
            sendAt
            filePath
            fileSize
            messageReaction{
                userId
                firstName
                lastName
                userName
                profileImagePath
                reactionType
                messageId
            }
        }
    }
`
