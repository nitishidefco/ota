import React, {createContext, useEffect, useState} from 'react';
export const PolicyInfoContext = createContext();

export const PolicyInfoProvider = ({children}) => {
  const [provider, setProvider] = useState(null);
  const [hotelId, setHotelId] = useState(null);
  const [GiataId, setGiataId] = useState(null);
  return (
    <PolicyInfoContext.Provider
      value={{provider, setProvider, hotelId, setHotelId, GiataId, setGiataId}}>
      {children}
    </PolicyInfoContext.Provider>
  );
};
