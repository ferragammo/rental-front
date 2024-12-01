import { createContext, useEffect, useRef, useState } from 'react';
import { getAccount } from '../api/accountApi';
import { ChatModelType } from '../static/enums/ChatModelType';
import Cookies from 'js-cookie';
import { getAllChatMessages, sendMessage } from '../api/messageApi';
import { getChatById, getChats } from '../api/chatApi';

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
            text: "Hi, I'm ChatGPT, a powerful language model created by OpenAI. My primary function is to assist users in generating human-like text based on the prompts and questions I receive. I have been trained on a diverse range of internet text up until September 2021, so I can provide information, answer questions, engage in conversations, offer suggestions, and more on a wide array of topics. Please feel free to ask me anything or let me know how I can assist you today!",
            isBot: true,
        },
    ]);
    const [selectedChat, setSelectedChat] = useState("674c5c9fed4768a959ab0f3e");
    const msgEnd = useRef(null);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView();
        }
    }, [message]);

    const loadChatMessages = async () => {
        const token = Cookies.get('accessToken');
        const chatId = '674c5c9fed4768a959ab0f3e';
        if (selectedChat) {
            const result = await getAllChatMessages(token, selectedChat);
            console.log(result);

            // Преобразуем сообщения в формат, который подходит для state

            const formattedMessages = result.data.map((msg) => ({
                text: msg.text,
                isBot: msg.author === 'assistant', // Используем значение авторов для определения isBot
            }));

            setMessage((prevMessages) => [
                ...prevMessages,
                ...formattedMessages,
            ]);
        }
    };

    // button Click function
    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        setMessage((prevMessages) => [...prevMessages, { text, isBot: false }]);
        const token = Cookies.get('accessToken');
        const chatId = '674c5c9fed4768a959ab0f3e';
        // Отправка сообщения и обновление UI с постепенной подгрузкой
        await sendMessage(token, selectedChat, text, setMessage);
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

    const selectChatById = async (chatId) => {
        try {
            const token = Cookies.get('accessToken');
            if (!token) {
                console.error('Token not found');
                return;
            }
            const chat = await getChatById(chatId, token);
            if (chat) {
                setMessage(chat.messages || []);
            }
        } catch (error) {
            console.error('Error fetching chat by ID:', error.message);
        }
    };

    useEffect(() => {
        const getAllChats = async () => {
            try {
                const token = Cookies.get('accessToken');
                if (!token) {
                    return { account: null, statusCode: 401 };
                }
                const response = await getChats(token, 0, 10);
                if (response.data) {
                    if (
                        JSON.stringify(response.data) !== JSON.stringify(chats)
                    ) {
                        setChats(response.data);
                    }
                } else {
                    console.log(response.error);
                }
            } catch (error) {
                console.log(error.message || 'Ошибка при загрузке чатов');
            }
        };
        getAllChats();
    }, [chats]);

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
                selectChatById,
            }}
        >
            {children}
        </ContextApp.Provider>
    );
};
export default AppContext;
