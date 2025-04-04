import {
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from 'react-native';
import React, {useContext} from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {setLanguageWithStorage} from '../../Redux/Reducers/LanguageSlice';
import {useDispatch} from 'react-redux';
import RNRestart from 'react-native-restart';
import {HeaderOptionContext} from '../../Context/HeaderOptionContext';
import {useTranslation} from 'react-i18next';

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const {showModal, setShowModal, setShowCurrencyModal} =
    useContext(HeaderOptionContext);
  const {i18n} = useTranslation();

  const languages = ['ar', 'en'];
  const selectedLanguage = i18n.language;

  const handleLanguageChange = language => {
    Alert.alert(
      'Language Change',
      'The app needs to restart to apply the new language settings.',
      [
        {
          text: 'Cancel',
          onPress: () => setShowModal(false),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            dispatch(setLanguageWithStorage(language));
            setShowModal(false);
            RNRestart.restart();
          },
        },
      ],
    );
  };

  const reorderedLanguages = selectedLanguage
    ? [selectedLanguage, ...languages.filter(lang => lang !== selectedLanguage)]
    : languages;

  const languageDisplayNames = {
    ar: 'Arabic',
    en: 'English',
  };

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', zIndex: 1000}}>
      <TouchableOpacity
        onPress={() => {
          setShowModal(!showModal);
          setShowCurrencyModal(false);
        }}
        style={styles.secondaryOptions}
        activeOpacity={0.7}>
        <Image
          style={styles.secondaryOptionsImages}
          source={Images.TRANSLATE_ICON}
        />
      </TouchableOpacity>
      {showModal && (
        <View style={styles.modal}>
          {reorderedLanguages?.map((lang, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleLanguageChange(lang)}
              style={[
                styles.languageItem,
                lang === selectedLanguage && styles.selectedLanguageItem,
              ]}
              activeOpacity={0.7}>
              <Text
                style={[
                  styles.modalText,
                  lang === selectedLanguage && styles.selectedModalText,
                ]}>
                {languageDisplayNames[lang] || lang}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default LanguageSelector;

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
    width: Matrics.s(120),
    borderRadius: Matrics.s(12),
    paddingVertical: Matrics.vs(8),
    // paddingHorizontal: Matrics.s(10),
    shadowColor: '#000', //
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1001,
  },
  languageItem: {
    paddingVertical: Matrics.vs(3),
    paddingHorizontal: Matrics.s(10),
  },
  selectedLanguageItem: {
    backgroundColor: COLOR.PRIMARY,
    // borderRadius: Matrics.s(8),
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
});
