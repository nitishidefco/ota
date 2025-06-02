import React, {createContext, useContext, useState} from 'react';

const CardContext = createContext(undefined);

export const CardProvider = ({children}) => {
  const [cardDetails, setCardDetails] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);

  return (
    <CardContext.Provider
      value={{
        cardDetails,
        paymentMethodId,
        setCardDetails,
        setPaymentMethodId,
      }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCard = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('useCard must be used within a CardProvider');
  }
  return context;
};
