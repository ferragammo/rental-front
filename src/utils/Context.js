import { createContext, useEffect, useRef, useState } from 'react';
import { getAccount } from '../api/accountApi';
import { ChatModelType } from '../static/enums/ChatModelType';
import Cookies from 'js-cookie';
import { getAllChatMessages, sendMessage } from '../api/messageApi';
import { createChat, getChatById, getChats } from '../api/chatApi';

export const ContextApp = createContext();

const AppContext = ({ children }) => {
    const [showSlide, setShowSlide] = useState(false);
    const [Mobile, setMobile] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatValue, setChatValue] = useState('');
    const [account, setAccount] = useState('');
    const [status, setStatus] = useState('');
    const [selectedModel, setSelectedModel] = useState(
        ChatModelType.gpt_4o_mini
    );
    const [message, setMessage] = useState([
        {
            file: {
                name: '',
                base64String: '',
            },

            text: "Hello! I'm Hector, your search assistant specializing in CNC technology and industrial products here at the Hectool marketplace. We offer a wide range of products and expert recommendations to simplify your search. What are you looking for?",
            isBot: true,
        },
    ]);
    const [fileData, setFileData] = useState(null);

    useEffect(() => {
        console.log(fileData);
    }, [fileData]);

    const [selectedChat, setSelectedChat] = useState(null);
    //'674d7f4eed4768a959ab111c'
    const msgEnd = useRef(null);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    const loadChatMessages = async (chatId) => {
        const token = Cookies.get('accessToken');

        if (chatId) {
            const result = await getAllChatMessages(token, chatId);
            console.log(result);

            if (result.data.length > 0) {
                const formattedMessages = result.data.map((msg) => ({
                    text: msg.text,
                    isBot: msg.author === 'assistant',
                    file: msg.file ? {
                        name: msg.file.name,
                        base64String: msg.file.base64String,
                    } : null,
                }));

                setMessage(formattedMessages);
            } else {
                setMessage([
                    {
                        file: {
                            name: '',
                            base64String: '',
                        },

                        text: "Hello! I'm Hector, your search assistant specializing in CNC technology and industrial products here at the Hectool marketplace. We offer a wide range of products and expert recommendations to simplify your search. What are you looking for?",
                        isBot: true,
                    },
                ]);
            }
        } else {
            setMessage([
                {
                    file: {
                        name: '',
                        base64String: '',
                    },

                    text: "Hello! I'm Hector, your search assistant specializing in CNC technology and industrial products here at the Hectool marketplace. We offer a wide range of products and expert recommendations to simplify your search. What are you looking for?",
                    isBot: true,
                },
            ]);
        }
    };

    // button Click function
    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        if (fileData && fileData.base64String) {
            setMessage((prevMessages) => [
                ...prevMessages,
                {
                    text,
                    isBot: false,
                    file: fileData,
                },
            ]);
        } else {
            setMessage((prevMessages) => [
                ...prevMessages,
                { text, isBot: false },
            ]);
        }
        const token = Cookies.get('accessToken');
        if (!selectedChat) {
            try {
                const newChat = await createChat(selectedModel, token || null);
                if (newChat) {
                    setSelectedChat(newChat.data.id);
                    if (!fileData) {
                        await sendMessage(
                            token,
                            newChat.data.id,
                            text,

                            setMessage
                        );
                    } else {
                        console.log(fileData);
                        await sendMessage(
                            token,
                            newChat.data.id,
                            text,
                            setMessage,

                            fileData
                        );
                        setFileData(null);
                    }
                } else {
                    console.error('Failed to create a new chat');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
            }
            getAllChats();
        } else {
            if (!fileData) {
                await sendMessage(token, selectedChat, text, setMessage);
            } else {
                console.log(fileData);
                const sendFileData = fileData;
                setFileData(null);
                await sendMessage(
                    token,
                    selectedChat,
                    text,
                    setMessage,

                    sendFileData
                );
            }
        }
    };

    // Enter Click function
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (chatValue.trim() !== '' || fileData) {
                handleSend();
            }
        }
    };

    const selectedChatById = async (chatId) => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const chat = await getChatById(chatId, token);
            if (chat) {
                setSelectedChat(chatId);
                loadChatMessages(chatId);
            }
        } catch (error) {
            console.error('Error fetching chat by ID:', error.message);
        }
    };

    const getAllChats = async () => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                return { account: null, statusCode: 401 };
            }
            const response = await getChats(token, 0, 10);
            if (response.data) {
                setChats(response.data);
            } else {
                console.log(response.error);
            }
        } catch (error) {
            console.log(error.message || 'Error creating chat');
        }
    };

    useEffect(() => {
        getAllChats();
    }, []);

    useEffect(() => {
        const fetchAccountType = async () => {
            try {
                const { account, statusCode } = await getAccount();
                if (account) {
                    setAccount(account);
                }
                setStatus(statusCode);
            } catch (error) {
                setAccount(null);
                setStatus(null);
            }
        };

        fetchAccountType();
    }, []);

    return (
        <ContextApp.Provider
            value={{
                showSlide,
                setShowSlide,
                Mobile,
                setMobile,
                chatValue,
                setChatValue,
                handleSend,
                message,
                setMessage,
                chats,
                msgEnd,
                handleKeyPress,
                account,
                status,
                loadChatMessages,
                selectedModel,
                setSelectedModel,
                setSelectedChat,
                selectedChat,
                selectedChatById,
                setFileData,
                getAllChats,
                setChats,
                fileData,
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
