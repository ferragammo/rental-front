import api from './index';

export const sendMessage = async (token, chatId, chatValue, updateMessages, fileData={},) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const body = {
            text: chatValue,  // Сначала добавляем текст
        };
        
        // Проверка наличия файла
        if (fileData && fileData.name && fileData.base64String) {
            body.file = {
                name: fileData.name,
                base64String: fileData.base64String,
            };
        }

        // Добавляем первое сообщение с пробелом
        updateMessages((prevMessages) => [
            ...prevMessages,
            { text: ' ', isBot: true }, // Изначально отправляем пробел
        ]);

        const response = await fetch(
            `${process.env.REACT_APP_DEV_API_URL}api/message/${chatId}`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let currentText = '';
        let chunkQueue = [];

        

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            const chunk = decoder.decode(value, { stream: true });

            if (chunk.trim()) {
                const chunkParts = chunk.split(/(?=data:)/).filter(Boolean);

                chunkParts.forEach((part) => {
                    chunkQueue.push(part.trim());
                });

                while (chunkQueue.length > 0) {
                    const currentChunk = chunkQueue.shift();

                    try {
                        const cleanChunk = currentChunk
                            .replace(/^data:\s*/, '')
                            .trim();
                        const parsedChunk = JSON.parse(cleanChunk);

                        currentText += parsedChunk.data.text;

                        updateMessages((prevMessages) => {
                            const lastMessage =
                                prevMessages[prevMessages.length - 1];
                            return [
                                ...prevMessages.slice(0, -1),
                                {
                                    ...lastMessage,
                                    text: currentText,
                                    isBot: true,
                                },
                            ];
                        });
                    } catch (e) {
                        console.error('Error parsing chunk:', e);
                    }
                }
            }
        }
    } catch (error) {
        const errorMessage =
            error.response?.data?.error?.message ||
            error.message ||
            'Request failed';
        console.error('Message sending failed:', errorMessage);
        updateMessages((prevMessages) => [
            ...prevMessages,
            { text: 'Error: ' + errorMessage, isBot: true },
        ]);
    }
};

export const getAllChatMessages = async (token, chatId) => {
    try {
        const response = await api.get(`/api/message/${chatId}/all`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data.successful) {
            const result = response.data.data;
            return result;
        } else {
            throw new Error(response.data.error);
        }
    } catch (error) {
        console.error('Error fetching account type:', error);
        return error;
    }
};
