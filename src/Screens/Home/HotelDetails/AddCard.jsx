import {View, Text, StyleSheet, Alert, TextInput} from 'react-native';
import React, {useCallback, useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import KeyboardAwareScrollViewBoilerplate from '../../../Components/UI/KeyboardAwareScrollViewBoilerplate';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {CardField, createPaymentMethod} from '@stripe/stripe-react-native';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';
import {useDispatch} from 'react-redux';
import {saveCardThunk} from '../../../Redux/Reducers/BookingOverviewReducer/BookingListSlice';
import {errorToast, success} from '../../../Helpers/ToastMessage';
import InteractiveCard from '../../../Components/UI/InteractiveCard';

const AddCard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [cardDetails, setCardDetails] = useState(null);
  const [formComplete, setFormComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleCardChange = useCallback(
    async details => {
      console.log('CardField raw details:', details);

      if (!details) {
        setFormComplete(false);
        setCardDetails(null);
        return;
      }

      // Format the card details for display
      const formattedCardDetails = {
        number: details.last4 ? `**** **** **** ${details.last4}` : '',
        expiryDate:
          details.expiryMonth && details.expiryYear
            ? `${details.expiryMonth
                .toString()
                .padStart(2, '0')}/${details.expiryYear.toString().slice(-2)}`
            : '',
        holderName: cardDetails?.holderName || '',
        validNumber: details.validNumber,
        validCVC: details.validCVC,
        validExpiryDate: details.validExpiryDate,
        complete: details.complete,
        brand: details.brand || 'CARD',
      };

      setCardDetails(formattedCardDetails);

      // Only set form complete if ALL validations pass AND the card is complete
      const isValid =
        details.complete &&
        details.validNumber === 'Valid' &&
        details.validCVC === 'Valid' &&
        details.validExpiryDate === 'Valid';

      console.log('Card validation:', {
        complete: details.complete,
        validNumber: details.validNumber,
        validCVC: details.validCVC,
        validExpiryDate: details.validExpiryDate,
        isValid,
      });

      setFormComplete(isValid);
    },
    [cardDetails?.holderName],
  );

  const handleNextPress = async () => {
    if (!formComplete) {
      errorToast('Please enter valid card details');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Creating payment method...');

      const billingDetails = {
        name: cardDetails?.holderName || 'Card Holder',
        email: 'user@example.com',
        address: {
          country: 'US',
        },
      };

      console.log('Billing details:', billingDetails);

      const {error, paymentMethod} = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails,
        },
      });

      console.log('createPaymentMethod response:', {error, paymentMethod});

      if (error) {
        console.error('Payment method creation error:', error);
        errorToast(error.message);
        return;
      }

      if (!paymentMethod) {
        console.error('No payment method returned');
        errorToast('Failed to create payment method');
        return;
      }

      console.log('Payment method created successfully:', paymentMethod);

      const details = {
        cardToken: paymentMethod.id,
      };

      console.log('Sending to backend:', details);

      const result = await dispatch(saveCardThunk({details}));

      if (saveCardThunk.fulfilled.match(result)) {
        const response = result.payload;
        if (response && response.status) {
          success('Card saved successfully!');
          navigation.navigate('HotelPaymentsPage');
        } else {
          errorToast('Failed to save card. Please try again.');
        }
      } else {
        errorToast('Failed to save card. Please try again.');
      }
    } catch (error) {
      console.error('Error saving card:', error);
      errorToast('Failed to save card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardHolderChange = text => {
    setCardDetails(prev => ({
      ...prev,
      holderName: text,
    }));
  };

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

          <View style={styles.cardDisplayContainer}>
            <InteractiveCard cardDetails={cardDetails} />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter card holder name"
              placeholderTextColor={COLOR.GRAY}
              value={cardDetails?.holderName || ''}
              onChangeText={handleCardHolderChange}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.cardFieldContainer}>
            <Text style={styles.inputLabel}>Card Details</Text>
            <CardField
              postalCodeEnabled={false}
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
    marginBottom: Matrics.vs(40),
  },
  cardDisplayContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Matrics.vs(20),
  },
  inputContainer: {
    marginBottom: Matrics.vs(20),
  },
  inputLabel: {
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    color: COLOR.BLACK,
    marginBottom: Matrics.vs(8),
  },
  input: {
    height: Matrics.vs(50),
    borderWidth: 1.5,
    borderColor: COLOR.PRIMARY,
    borderRadius: 8,
    paddingHorizontal: Matrics.s(16),
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.BLACK,
  },
  cardFieldContainer: {
    marginTop: Matrics.vs(20),
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
