import React, {createContext, useState} from 'react';
export const HeaderOptionContext = createContext();

export const HeaderOptionProvider = ({children}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showThreeDotsModal, setShowThreeDotsModal] = useState(false);
  return (
    <HeaderOptionContext.Provider
      value={{
        showModal,
        setShowModal,
        showCurrencyModal,
        setShowCurrencyModal,
        showThreeDotsModal,
        setShowThreeDotsModal,
      }}>
      {children}
    </HeaderOptionContext.Provider>
  );
};
