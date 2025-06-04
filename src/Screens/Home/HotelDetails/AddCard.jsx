import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import KeyboardAwareScrollViewBoilerplate from '../../../Components/UI/KeyboardAwareScrollViewBoilerplate';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {
  CardField,
  createPaymentMethod,
  useStripe,
} from '@stripe/stripe-react-native';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {useDispatch} from 'react-redux';
import {saveCardThunk} from '../../../Redux/Reducers/BookingOverviewReducer/BookingListSlice';
import {errorToast, success} from '../../../Helpers/ToastMessage';

const AddCard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {createToken} = useStripe();

  const [cardDetails, setCardDetails] = useState(null);
  const [paymentMethodId, setPaymentMethodId] = useState(null);
  const [formComplete, setFormComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const createPaymentToken = async () => {
    try {
      const {error, token} = await createToken({
        type: 'Card',
        currency: 'usd',
      });

      if (error) {
        errorToast(error.message);
        return null;
      }

      return token;
    } catch (err) {
      errorToast('Failed to create payment token');
      return null;
    }
  };

  const handleNextPress = async () => {
    if (!formComplete || !paymentMethodId) {
      errorToast('Please enter valid card details');
      return;
    }

    setIsLoading(true);
    try {
      const token = await createPaymentToken();
      if (!token) {
        errorToast('Something went wrong');
        return;
      }
      const details = {
        cardToken: token.id,
      };
      console.log('details', details);

      console.log('About to dispatch saveCardThunk...');
      const result = await dispatch(saveCardThunk({details}));
      console.log('dispatch result:', result);
      console.log('result.payload:', result.payload);
      console.log('result.meta:', result.meta);

      // Check if the action was fulfilled
      if (saveCardThunk.fulfilled.match(result)) {
        const response = result.payload;
        console.log('response after unwrap:', response);
        console.log('response type:', typeof response);
        console.log('response status:', response?.status);

        if (response && response.status) {
          success('Card saved successfully!');
          navigation.navigate('HotelPaymentsPage');
        } else {
          console.log('Response or status is falsy:', {
            response,
            status: response?.status,
          });
          errorToast('Failed to save card. Please try again.');
        }
      } else {
        console.log('Action was rejected:', result.error);
        errorToast('Failed to save card. Please try again.');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      errorToast('Failed to save card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardChange = useCallback(async cardDetails => {
    if (!cardDetails) {
      setFormComplete(false);
      setCardDetails(null);
      setPaymentMethodId(null);
      return;
    }

    setCardDetails(cardDetails);
    const isValid =
      cardDetails.validNumber === 'Valid' &&
      cardDetails.validCVC === 'Valid' &&
      cardDetails.validExpiryDate === 'Valid' &&
      cardDetails.complete;

    if (isValid) {
      try {
        const {paymentMethod, error} = await createPaymentMethod({
          paymentMethodType: 'Card',
        });

        if (error) {
          console.error('Payment method creation error:', error);
          setFormComplete(false);
          return;
        }

        setPaymentMethodId(paymentMethod.id);
      } catch (err) {
        console.error('Error creating payment method:', err);
        setFormComplete(false);
        return;
      }
    }

    setFormComplete(isValid);
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollViewBoilerplate
        headerComponent={
          <NormalHeader
            title="Add Card"
            leftIconName="round"
            rightIconName="Next"
            onCrossPress={handleBackPress}
            onCheckPress={handleNextPress}
            disabled={!formComplete || isLoading}
          />
        }>
        <View style={styles.content}>
          <Text style={styles.title}>Enter Card Details</Text>
          <Text style={styles.subtitle}>
            Your card details are secure and encrypted
          </Text>
          <CardField
            postalCodeEnabled={false}
            autofocus={true}
            placeholders={{
              number: '4242 4242 4242 4242',
              expiration: 'MM/YY',
              cvc: 'CVC',
            }}
            cardStyle={styles.cardField}
            style={styles.cardForm}
            onCardChange={handleCardChange}
          />
        </View>
      </KeyboardAwareScrollViewBoilerplate>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: '7%',
  },
  content: {
    padding: Matrics.s(16),
  },
  title: {
    fontSize: typography.fontSizes.fs20,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: COLOR.BLACK,
    marginBottom: Matrics.vs(8),
  },
  subtitle: {
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.GRAY,
    marginBottom: Matrics.vs(24),
  },
  cardForm: {
    width: '100%',
    height: Matrics.vs(50),
  },
  cardField: {
    backgroundColor: '#FFFFFF',
    textColor: '#212121',
    borderColor: COLOR.PRIMARY,
    borderWidth: 1.5,
    borderRadius: 8,
    placeholderColor: '#B0BEC5',
    textErrorColor: '#C62828',
    fontSize: 16,
    cursorColor: '#1976D2',
  },
});

export default AddCard;
