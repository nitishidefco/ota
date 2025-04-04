import React, {createContext, useEffect, useState} from 'react';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import duration from 'dayjs/plugin/duration';
import {useSelector} from 'react-redux';
dayjs.extend(isSameOrBefore);
dayjs.extend(duration);
export const RoomContext = createContext();

export const RoomProvider = ({children}) => {
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [showCheckoutToast, setShowCheckoutToast] = useState(false);
  const [ratePlanId, setRatePlanId] = useState('');
  const [hotelStayStartDate, setHotelStayStartDate] = useState(null);
  const [hotelStayEndDate, setHotelStayEndDate] = useState(null);
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
  const roomState = useSelector(state => state?.rooms);
  console.log('Room state', roomState);
  useEffect(() => {
    if (roomState?.rooms?.length > 0 && !selectedRoomId) {
      console.log('inside');
      const firstRoom = roomState?.rooms[0];
      setSelectedRoomId(firstRoom.RatePlanID);
      setRatePlanId(firstRoom.RatePlanID);
      setShowCheckoutToast(true);
    }
  }, [roomState?.rooms, selectedRoomId]);
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
