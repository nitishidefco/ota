import React, {useCallback, useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Platform, Button, Alert} from 'react-native';
import {CardForm, useStripe} from '@stripe/stripe-react-native';
import {COLOR, Matrics} from '../Config/AppStyling';
import {useCard} from '../Context/CardDetailContext';
import {RoomContext} from '../Context/RoomContext';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {bookHotelThunk} from '../Redux/Reducers/HotelReducer/BookHotelSlice';
import dayjs from 'dayjs';

// import {useCard} from './CardContext';

const PaymentForm = () => {
  const {setCardDetails, setPaymentMethodId, paymentMethodId} = useCard();
  const priceConfirmAllState = useSelector(state => state?.confirmPrice);
  const hotelDataS = useSelector(state => state.hotelSlice);
  const dispatch = useDispatch();

  const {guests, hotelStayStartDate, hotelStayEndDate} =
    useContext(RoomContext);
  const {createPaymentMethod} = useStripe();
  const [formComplete, setFormComplete] = useState(false);
  const GUEST_DETAILS_KEY = 'guestDetails';
  const [guestDetails, setGuestDetails] = useState(
    Array(guests)
      .fill(null)
      .map(() => ({})),
  );
  useEffect(() => {
    const loadGuestDetails = async () => {
      try {
        const storedData = await AsyncStorage.getItem(GUEST_DETAILS_KEY);
        let newDetails = Array(guests)
          .fill(null)
          .map(() => ({}));
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          if (Array.isArray(parsedData)) {
            newDetails = Array(guests)
              .fill(null)
              .map((_, index) => parsedData[index] || {});
            console.log('Loaded and merged from AsyncStorage:', newDetails);
          } else {
            console.log('Invalid stored data, using default:', parsedData);
          }
        }
        setGuestDetails(newDetails);
      } catch (error) {
        console.error('Error loading guest details:', error);
      }
    };
    loadGuestDetails();
  }, []);
  console.log('guestDetails', guestDetails);

  const handleFormComplete = useCallback(
    async cardDetails => {
      console.log('onFormComplete triggered');
      if (!cardDetails || !cardDetails.complete) {
        console.error('Card Details incomplete or undefined:', cardDetails);
        setFormComplete(false);
        return;
      }

      setCardDetails({
        brand: cardDetails.brand,
        last4: cardDetails.last4,
        expiryMonth: cardDetails.expiryMonth,
        expiryYear: cardDetails.expiryYear,
        complete: cardDetails.complete,
        validNumber: cardDetails.validNumber,
        validExpiryDate: cardDetails.validExpiryDate,
        validCVC: cardDetails.validCVC,
      });
      setFormComplete(true);

      try {
        const {paymentMethod, error} = await createPaymentMethod({
          paymentMethodType: 'Card',
        });
        if (error) {
          Alert.alert(
            'Error',
            `Failed to create payment method: ${error.message}`,
          );
          console.error('Payment method error:', error);
          return;
        }
        console.log('Payment Method ID:', paymentMethod.id, paymentMethod);
        setPaymentMethodId(paymentMethod.id);
      } catch (err) {
        Alert.alert('Error', 'Payment method creation failed');
        console.error('Payment method creation failed:', err);
      }
    },
    [setCardDetails, setPaymentMethodId],
  );

  const sendToBackend = useCallback(async () => {
    const holder = guestDetails[0] || {};
    console.log('hodler', holder);

    const payload = {
      ReferenceNo: priceConfirmAllState.priceConfirmDetails.ReferenceNo,
      Holder_details: {
        Name: holder.firstName || '',
        Surname: holder.lastName || '',
        Gender: holder.gender || 'Unknown',
        Age: holder.age || '',
        Email: holder.email || '',
        phone_number: holder.phone || '',
        DocumentType: holder.documentType || '',
        DocumentNo: holder.documentNumber || '',
        Address: holder.address || '',
        City: holder.city || '',
        PostalCode: holder.postalCode || '',
        Country: holder.country || '',
        Nationality: holder.country || '',
        country_code: holder.countryCode || '',
        country_code_name: holder.country_code_name || 'IN',
      },
      NumOfRooms: guests,
      CheckInDate: dayjs(hotelStayStartDate).format('YYYY-MM-DD'),
      CheckOutDate: dayjs(hotelStayEndDate).format('YYYY-MM-DD'),
      GuestList: guestDetails.map((guest, index) => ({
        RoomNum: index + 1,
        GuestInfo: [
          {
            Name: {
              First: guest.firstName || '',
              Last: guest.lastName || '',
            },
            IsAdult: guest.age >= 18,
            Age: guest.age || 0,
          },
        ],
      })),
      card_details: {
        payment_method: paymentMethodId,
        amount: priceConfirmAllState.priceConfirmDetails.TotalPrice,
      },
      RatePlanID: priceConfirmAllState.priceConfirmDetails.RatePlanID,
      provider: 'DIDA',
      HotelID: priceConfirmAllState.priceConfirmDetails.HotelID,
      Currency: priceConfirmAllState.priceConfirmDetails.Currency,
    };
    console.log(payload);
    
    try {
      const response = await dispatch(bookHotelThunk({details: payload}));
      console.log('rsponse', response);
    } catch (error) {
      console.log('Eror booking hotel');
    }
  }, [paymentMethodId]);

  return (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        <CardForm
          postalCodeEnabled={false}
          autofocus={true}
          placeholders={{
            number: '4242 4242 4242 4242',
            expiration: 'MM/YY',
            cvc: 'CVC',
          }}
          cardStyle={{
            backgroundColor: '#FFFFFF',
            textColor: '#212121',
            borderColor: COLOR.PRIMARY,
            borderWidth: 1.5,
            borderRadius: 8,
            placeholderColor: '#B0BEC5',
            textErrorColor: '#C62828',
            fontSize: 16,
            cursorColor: '#1976D2',
          }}
          style={styles.cardForm}
          onFormComplete={handleFormComplete}
        />
        <Button
          title="Submit Payment"
          onPress={sendToBackend}
          color={COLOR.PRIMARY}
          disabled={!formComplete || !paymentMethodId}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    marginTop: Matrics.vs(30),
  },
  formWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardForm: {
    height: 180,
    width: '100%',
    marginBottom: 12,
  },
});

export default PaymentForm;
