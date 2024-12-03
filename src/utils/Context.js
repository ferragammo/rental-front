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

            text: "Hi, I'm ChatGPT, a powerful language model created by OpenAI. My primary function is to assist users in generating human-like text based on the prompts and questions I receive. I have been trained on a diverse range of internet text up until September 2021, so I can provide information, answer questions, engage in conversations, offer suggestions, and more on a wide array of topics. Please feel free to ask me anything or let me know how I can assist you today!",
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

                // Преобразуем сообщения в формат, который подходит для state
                if (result) {
                    const formattedMessages = result.data.map((msg) => ({
                        text: msg.text,
                        isBot: msg.author === 'assistant', // Используем значение авторов для определения isBot
                    }));

                    setMessage(formattedMessages);
                }
            } else {
                setMessage([  {
                    file: {
                        name: '',
                        base64String: '',
                    },
        
                    text: "Hi, I'm ChatGPT, a powerful language model created by OpenAI. My primary function is to assist users in generating human-like text based on the prompts and questions I receive. I have been trained on a diverse range of internet text up until September 2021, so I can provide information, answer questions, engage in conversations, offer suggestions, and more on a wide array of topics. Please feel free to ask me anything or let me know how I can assist you today!",
                    isBot: true,
                }])
            }
    
    };

    // button Click function
    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        setMessage((prevMessages) => [...prevMessages, { text, isBot: false }]);
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
                    }
                } else {
                    console.error('Failed to create a new chat');
                }
            } catch (error) {
                console.error('Error creating new chat:', error);
            }
            getAllChats()
        } else {
            if (!fileData) {
                await sendMessage(token, selectedChat, text, setMessage);
            } else {
                console.log(fileData);
                await sendMessage(
                    token,
                    selectedChat,
                    text,
                    setMessage,
                    fileData
                );
            }
        }
    };
    // Enter Click function
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    // Query Click function
    const handleQuery = async (e) => {
        const text = e.target.innerText;
        setMessage([...message, { text, isBot: false }]);
        // const res = await sendMsgToAI(text);
        // setMessage([
        //   ...message,
        //   { text, isBot: false },
        //   { text: res, isBot: true },
        // ]);
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
                setSelectedChat(chatId); // Обновляем selectedChat
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
            console.log(error.message || 'Ошибка при загрузке чатов');
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
                chats,
                msgEnd,
                handleKeyPress,
                handleQuery,
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
                setChats
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
