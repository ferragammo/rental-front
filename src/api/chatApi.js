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

export const getChatById = async (chatId, token) => {
  try {
    if (!token) {
      return { account: null, statusCode: 401 };
    }
    const response = await api.get(`/api/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const deleteChat = async (chatId, token) => {
  if (!token) {
    return { account: null, statusCode: 401 };
  }
  try {
    const response = await api.delete(`/api/chat/${chatId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export const createChat = async (model, token) => {
  try {
    const response = await api.post(
      '/api/chat',
      { model },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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

export const updateTitle = async (chatId, token, title) => {
  try {
    const response = await api.patch(
      `api/chat/${chatId}/title`,
      { title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
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
