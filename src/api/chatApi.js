import api from './index';

export const getChats = async (token, pageIndex, pageSize) => {
  try {
    if (!token) {
      return { account: null, statusCode: 401 };
    }
    const response = await api.get('/api/chat/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        pageIndex,
        pageSize,
      },
    });

    if (response.data.successful) {
      return response.data.data;
    } else {
      return { data: null, error: response.data.error.message };
    }
  } catch (error) {
    return { data: null, error: error.message || 'Request failed' };
  }
};

export const createChat = async (model, token) => {
  try {
    const response = await api.post(
      '/api/chat',
      { model },
    );
    
    if (response?.data?.successful) {
      return response.data;
    } else {
      return {
        successful: false,
        message: response?.data?.error?.message || 'Unknown error occurred',
      };
    }
  } catch (error) {
    console.error(
      'Failed to create chat:',
      error.response?.data || error.message
    );

    return {
      successful: false,
      message: error.response?.data?.error?.message || 'Failed to create chat',
      status: error.response?.status || null,
    };
  }
};