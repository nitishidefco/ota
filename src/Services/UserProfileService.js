import baseApiClient from './baseApiClient';
export const getUserProfile = () => baseApiClient.get('/profile');
export const changePassword = ({details}) => {
  console.log('details in change password service', details);

  return baseApiClient.put('/profile/change-password', details);
};

export const editUserProfile = ({details}) => {
  return baseApiClient.put('/profile/edit', details, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
