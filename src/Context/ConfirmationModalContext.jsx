import React, {createContext, useState} from 'react';
export const ConfirmationModalContext = createContext();

export const ConfirmationModalProvider = ({children}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);

  return (
    <ConfirmationModalContext.Provider
      value={{showCancelModal, setShowCancelModal}}>
      {children}
    </ConfirmationModalContext.Provider>
  );
};
