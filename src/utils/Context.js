import { createContext, useEffect, useRef, useState } from 'react';
import { getAccount } from '../api/accountApi';
import { ChatModelType } from '../static/enums/ChatModelType';
import Cookies from 'js-cookie';
import {
    base64StringToUrl,
    getAllChatMessages,
    sendMessage,
} from '../api/messageApi';
import { createChat, getChatById, getChats } from '../api/chatApi';

export const ContextApp = createContext();

const defaultMessage = {
    file: '',

    text: "こんにちは! I'm Hector, your expert assistant for precision measurement solutions and Mitutoyo products. I specialize in helping you find the perfect tools and accessories for your needs. What can I assist you with today?",
    isBot: true,
};

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
    const [message, setMessage] = useState([defaultMessage]);
    const [fileData, setFileData] = useState(null);
    const [isLoading, setIsLoading] =useState(false);

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
                    file: msg?.fileUrl,
                }));

                setMessage(formattedMessages);
            } else {
                setMessage([defaultMessage]);
            }
        } else {
            setMessage([defaultMessage]);
        }
    };

    // button Click function
    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        let fileUrl = null;
        console.log(fileData)
        setIsLoading(true);
        if (fileData && fileData.base64String) {
            fileUrl = await base64StringToUrl(fileData);
            setFileData(null);
 
            setMessage((prevMessages) => [
                ...prevMessages,
                {
                    text,
                    isBot: false,
                    file: fileUrl,
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
                    await sendMessage(
                        token,
                        newChat.data.id,
                        text,
                        setMessage,
                        fileUrl || null
                    );

                   
                } else {
                    console.error('Failed to create a new chat');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
            }
            getAllChats();
        } else {
            await sendMessage(
                token,
                selectedChat,
                text,
                setMessage,
                fileUrl || null
            );
        }
        setIsLoading(false)
    };

    // Enter Click function
    const handleKeyPress = (e) => {
        if(!isLoading) {
        if (e.key === 'Enter') {
            if (chatValue.trim() !== '' || fileData) {
                handleSend();
            }
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
                isLoading
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
