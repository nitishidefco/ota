import React, {useContext, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  Pressable,
  Dimensions,
} from 'react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {useDispatch, useSelector} from 'react-redux';
import {
  setCurrencyWithStorage,
  initializeCurrency,
} from '../../Redux/Reducers/CurrencyReducer';
import {HeaderOptionContext} from '../../Context/HeaderOptionContext';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

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
    // If the selected currency is the same as current currency, just close the modal
    if (selectedCurrencyByUser === selectedCurrency) {
      setShowCurrencyModal(false);
      return;
    }
    dispatch(setCurrencyWithStorage(selectedCurrencyByUser)); // Save and set currency
    setShowCurrencyModal(false); // Close modal
  };

  const toggleModal = () => {
    console.log('showCurrencyModal', showCurrencyModal);

    if (showCurrencyModal) {
      console.log('showCurrencyModal is true');

      return;
    }
    setShowCurrencyModal(true);
    setShowModal(false);
  };

  const closeModal = () => {
    setShowCurrencyModal(false);
  };

  // Reorder currencies to put the selected one first
  const reorderedCurrencies = selectedCurrency
    ? [
        selectedCurrency,
        ...currencies.filter(item => item !== selectedCurrency),
      ]
    : currencies;

  return (
    <>
      {/* Invisible overlay to detect outside touches */}
      {showCurrencyModal && (
        <Pressable
          style={styles.overlay}
          onPress={() => {
            closeModal();
          }}
        />
      )}

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => setShowCurrencyModal(true)}
          style={styles.secondaryOptions}
          disabled={showCurrencyModal}
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

        {/* Currency Options Modal */}
        {showCurrencyModal && (
          <View style={styles.modal}>
            {reorderedCurrencies?.map((item, index) => (
              <Pressable
                key={index}
                onPress={e => {
                  e.stopPropagation();
                  handleCurrencyChange(item);
                }}
                style={({pressed}) => [
                  styles.currencyItem,
                  item === selectedCurrency && styles.selectedCurrencyItem,
                  pressed && styles.pressedCurrencyItem,
                ]}>
                <Text
                  style={[
                    styles.modalText,
                    item === selectedCurrency && styles.selectedModalText,
                  ]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </>
  );
};

export default CurrencySelector;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000,
  },
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
    zIndex: 1001,
  },
  currencyItem: {
    paddingVertical: Matrics.vs(12),
    paddingHorizontal: Matrics.s(15),
    minHeight: Matrics.vs(44),
    justifyContent: 'center',
  },
  selectedCurrencyItem: {
    backgroundColor: COLOR.PRIMARY,
  },
  pressedCurrencyItem: {
    backgroundColor: COLOR.PRIMARY + '20',
  },
  modalText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs16,
    color: COLOR.BLACK,
    textAlign: 'left',
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
