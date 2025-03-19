import React, {createContext, useState} from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
export const RoomContext = createContext();

export const RoomProvider = ({children}) => {
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [ratePlanId, setRatePlanId] = useState('');
  const [hotelStayStartDate, setHotelStayStartDate] = useState(
    dayjs().add(1, 'day'),
  );
  const [hotelStayEndDate, setHotelStayEndDate] = useState(
    dayjs().add(2, 'day'),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [guests, setGuests] = useState(1);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(1);
  const [pluaralChild, setChildren] = useState(0);
  const [pets, setPets] = useState(0);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [destination, setDestination] = useState('');
  const [selectedCityIndex, setSelectedCityIndex] = useState();
  const [showFlatList, setShowFlatList] = useState(false);
  return (
    <RoomContext.Provider
      value={{
        selectedRoomId,
        setSelectedRoomId,
        showCheckoutToast,
        setShowCheckoutToast,
        ratePlanId,
        setRatePlanId,
        hotelStayStartDate,
        setHotelStayStartDate,
        hotelStayEndDate,
        setHotelStayEndDate,
        showDatePicker,
        setShowDatePicker,
        guests,
        setGuests,
        rooms,
        setRooms,
        adults,
        setAdults,
        pluaralChild,
        setChildren,
        pets,
        setPets,
        showGuestsModal,
        setShowGuestsModal,
        destination,
        setDestination,
        selectedCityIndex,
        setSelectedCityIndex,
        showFlatList,
        setShowFlatList,
      }}>
      {children}
    </RoomContext.Provider>
  );
};
