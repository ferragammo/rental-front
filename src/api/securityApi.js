import api from './index';

export const registerUser = async (email, password) => {
    try {
        const response = await api.post('/api/security/register', {email, password});
        if (response.data.successful) {
            return {successful: true, data: response.data};
        } else {
            return {
                successful: false,
                error: {message: response.data.error.message},
            };
        }
    } catch (error) {
        const message = error.response
            ? error.response.data.error.message
            : error.message;
        return {successful: false, error: {message}};
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/api/security/login', {email, password});
        if (response.data.successful) {
            return {successful: true, data: response.data.data};
        } else {
            return {
                successful: false,
                error: {message: response.data.error.message},
            };
        }
    } catch (error) {
        const errorMessage = error.response
            ? error.response.data.error.message
            : error.message;
        const status = error.response ? error.response.status : null;
        
        return {
            successful: false,
            error: {
                status: status,
                message: errorMessage
            }
        };
    }
}
    