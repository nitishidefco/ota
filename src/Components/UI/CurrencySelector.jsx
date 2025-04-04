import React, {useContext, useEffect} from 'react';
import {StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCurrencyWithStorage,
  initializeCurrency,
} from '../../Redux/Reducers/CurrencyReducer';
import {HeaderOptionContext} from '../../Context/HeaderOptionContext';

const CurrencySelector = () => {
  const dispatch = useDispatch();
  const currencies = useSelector(state => state.currency.currencies);
  const selectedCurrency = useSelector(
    state => state.currency.selectedCurrency,
  );

  const {showCurrencyModal, setShowCurrencyModal, setShowModal} =
    useContext(HeaderOptionContext);

  // Initialize currency on component mount
  useEffect(() => {
    dispatch(initializeCurrency());
  }, [dispatch]);

  const handleCurrencyChange = selectedCurrencyByUser => {
    dispatch(setCurrencyWithStorage(selectedCurrencyByUser)); // Save and set currency
    setShowCurrencyModal(false); // Close modal
  };

  // Reorder currencies to put the selected one first
  const reorderedCurrencies = selectedCurrency
    ? [
        selectedCurrency,
        ...currencies.filter(item => item !== selectedCurrency),
      ]
    : currencies;

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', zIndex: 1000}}>
      <TouchableOpacity
        onPress={() => {
          setShowCurrencyModal(!showCurrencyModal);
          setShowModal(false);
        }}
        style={styles.secondaryOptions}
        activeOpacity={0.7}>
        {selectedCurrency ? (
          <Text style={styles.selectedCurrencyText}>{selectedCurrency}</Text>
        ) : (
          <Image
            style={styles.secondaryOptionsImages}
            source={Images.CASH_ICON}
          />
        )}
      </TouchableOpacity>
      {showCurrencyModal && (
        <View style={styles.modal}>
          {reorderedCurrencies?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleCurrencyChange(item)}
              style={[
                styles.currencyItem,
                item === selectedCurrency && styles.selectedCurrencyItem,
              ]}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.modalText,
                  item === selectedCurrency && styles.selectedModalText,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default CurrencySelector;

// Styles remain unchanged
const styles = StyleSheet.create({
  secondaryOptionsImages: {
    width: Matrics.s(16),
    height: Matrics.vs(16),
    resizeMode: 'contain',
  },
  secondaryOptions: {
    backgroundColor: '#51176F',
    paddingHorizontal: Matrics.s(14),
    paddingVertical: Matrics.vs(12),
    borderRadius: Matrics.s(10),
    borderColor: '#6D338A',
    borderWidth: 1,
  },
  modal: {
    position: 'absolute',
    top: Matrics.vs(50),
    right: 0,
    backgroundColor: COLOR.WHITE,
    width: Matrics.s(100),
    borderRadius: Matrics.s(12),
    paddingVertical: Matrics.vs(8),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  currencyItem: {
    paddingVertical: Matrics.vs(3),
    paddingHorizontal: Matrics.s(10),
  },
  selectedCurrencyItem: {
    backgroundColor: COLOR.PRIMARY,
  },
  modalText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
  },
  selectedModalText: {
    color: COLOR.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  selectedCurrencyText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs12,
    color: COLOR.WHITE,
  },
});
