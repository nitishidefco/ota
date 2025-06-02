import baseApiClient from '../baseApiClient';

export const getCashbackList = async (
  pageCount = 1,
  limit = 10,
  type = null,
) => {
  try {
    const params = {page: pageCount, limit: limit};
    if (type) {
      params.type = type;
    }

    const response = await baseApiClient.get('/profile/transaction-history', {
      params: params,
    });
    return response.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
