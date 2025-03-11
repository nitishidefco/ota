import {StyleSheet, Image, TouchableOpacity, View, Text} from 'react-native';
import React, {useState} from 'react';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import {Images} from '../../Config';
import {setLanguageWithStorage} from '../../Redux/Reducers/LanguageSlice';
import {useDispatch} from 'react-redux';

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const handleLanguageChange = language => {
    dispatch(setLanguageWithStorage(language));
    setShowModal(!showModal);
  };
  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowModal(!showModal)}
        style={styles.secondaryOptions}>
        <Image
          style={styles.secondaryOptionsImages}
          source={Images.TRANSLATE_ICON}
        />
      </TouchableOpacity>
      {showModal && (
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => handleLanguageChange('ar')}>
            <Text style={styles.modalText}>Arabic</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleLanguageChange('en')}>
            <Text style={styles.modalText}>English</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default LanguageSelector;
const styles = StyleSheet.create({
  secondaryOptionsImages: {
    width: Matrics.s(20),
    height: Matrics.vs(20),
    resizeMode: 'contain',
  },
  secondaryOptions: {
    backgroundColor: COLOR.PRIMARY,
    paddingHorizontal: Matrics.s(12),
    paddingVertical: Matrics.vs(7),
    borderRadius: Matrics.s(10),
    borderColor: COLOR.DIM_TEXT_COLOR,
    borderWidth: 1,
  },
  modal: {
    position: 'absolute',
    top: 50,
    backgroundColor: 'white',
    paddingHorizontal: Matrics.s(10),
    paddingVertical: Matrics.s(5),
    width: Matrics.s(98),
    borderRadius: Matrics.s(8),
    height: Matrics.vs(50),
    justifyContent: 'space-around',
  },
  modalText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    fontSize: typography.fontSizes.fs16,
  },
});
