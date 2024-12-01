import api from './index';
import Cookies from 'js-cookie';

export const getAccount = async () => {
  try {
    const token = Cookies.get('accessToken');
    if (!token) {
      return { account: null, statusCode: 401 };
    }

    const response = await api.get('/api/account', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 403) {
      return { account: null, statusCode: 403 };
    }

    if (response.data.successful) {
      const account = response.data;
      return { account: account, statusCode: response.status };
    } else {
      throw new Error(response.data.error.message);
    }
  } catch (error) {
    console.error('Error fetching account type:', error);
    return { account: null, statusCode: null };
  }
};

