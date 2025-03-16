import api from './index';

export const getChats = async ( pageIndex, pageSize) => {
  try {
    const response = await api.get('/api/chat/all', {
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

export const getChatById = async (chatId) => {
  try {

    const response = await api.get(`/api/chat/${chatId}`, {

    });
    if (response.data.successful) {
      return response.data.data;
    } else {
      throw new Error(response.data.error.message || 'Unknown error occurred');
    }
  } catch (error) {
    console.error(
      'Failed to fetch chats:',
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteChat = async (chatId) => {
  try {
    const response = await api.delete(`/api/chat/${chatId}`, {
    });

    if (response?.data?.successful) {
      return response.data;
    } else {
      return {
        successful: false,
        message: response?.data?.error?.message || 'Unknown error occurred',
      };
    }
  } catch (error) {
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      'Failed to delete agent data';
    console.error('Failed to delete agent data:', errorMessage);

    return {
      successful: false,
      message: errorMessage,
    };
  }
};

export const createChat = async () => {
  try {    
    const response = await api.post(
      '/api/chat',
      { },
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

export const updateTitle = async (chatId, title) => {
  try {
    const response = await api.patch(
      `api/chat/${chatId}/title`,
      { title },
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
      'Failed to update title:',
      error.response?.data || error.message
    );

    return {
      successful: false,
      message: error.response?.data?.error?.message || 'Failed to update title',
      status: error.response?.status || null,
    };
  }
};
