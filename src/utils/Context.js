import {createContext, useEffect, useRef, useState} from 'react';
import {ChatModelType} from '../static/enums/ChatModelType';
import Cookies from 'js-cookie';
import {sendMessage,} from '../api/messageApi';

export const ContextApp = createContext();


const AppContext = ({ children }) => {
    const [showSlide, setShowSlide] = useState(false);
    const [Mobile, setMobile] = useState(false);
    const [chats, setChats] = useState([]);
    const [chatValue, setChatValue] = useState('');
    const [selectedModel, setSelectedModel] = useState(
        ChatModelType.gpt_4o_mini
    );
    const [message, setMessage] = useState([]);
    const [fileData, setFileData] = useState(null);
    const [isLoading, setIsLoading] =useState(false);

    const [selectedChat, setSelectedChat] = useState(null);
    //'674d7f4eed4768a959ab111c'
    const msgEnd = useRef(null);

    useEffect(() => {
        if (msgEnd.current) {
            msgEnd.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [message]);

    const handleSend = async () => {
        const text = chatValue;
        setChatValue('');
        setIsLoading(true);
        setMessage((prevMessages) => [
            ...prevMessages,
            {text, isBot: false},
        ]);
        if (!selectedChat) {
            try {
                    await sendMessage(
                        text,
                        setMessage,
                    );

            } catch (error) {
                console.error('Error creating new chat:', error);
            }
        } else {
            await sendMessage(
                text,
                setMessage,
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
                selectedModel,
                setSelectedModel,
                setSelectedChat,
                selectedChat,
                setFileData,
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
