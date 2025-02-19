export const sendMessage = async (
    chatValue,
    updateMessages,
) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }

        const body = {
            text: chatValue,
        };

        const response = await fetch(
            'https://app.bundyonsol.xyz/api/agent/1/search',
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body),
            }
        );

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        updateMessages((prevMessages) => [
            ...prevMessages,
            { text: data.data.text, isBot: true },
        ]);

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
