import {View, Text, Image} from 'react-native';
import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import NormalHeader from '../../../Components/UI/NormalHeader';
import {useNavigation} from '@react-navigation/native';
import {Images} from '../../../Config';
import {COLOR, Matrics, typography} from '../../../Config/AppStyling';

const HotelPaymentsPage = () => {
  const navigation = useNavigation();
  return (
    <>
      <NormalHeader
        title={'Payment'}
        showRightButton={false}
        leftIconName="BACK"
        onCrossPress={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView style={{paddingHorizontal: Matrics.s(10)}}>
        <View
          style={{
            flexDirection: 'row',
            marginTop: Matrics.s(20),
            justifyContent: 'space-between',
          }}>
          <View>
            <Text
              style={{
                width: Matrics.s(170),
                fontFamily: typography.fontFamily.Montserrat.Bold,
                fontSize: typography.fontSizes.fs18,
              }}>
              Hotel Name will go here this is hotel
            </Text>
            <View
              style={{
                flexDirection: 'row',
                gap: 5,
                marginVertical: Matrics.vs(10),
              }}>
              <Text
                style={{fontFamily: typography.fontFamily.Montserrat.Regular}}>
                4.3
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Text>⭐</Text>
                <Text>⭐</Text>
                <Text>⭐</Text>
                <Text>⭐</Text>
              </View>
              <Text>{`(146 Reviews)`}</Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: Matrics.vs(10)}}>
              <Image
                source={Images.LOCATION}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text>Lorem epsum lorem epsum</Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: Matrics.vs(10)}}>
              <Image
                source={Images.LOCATION}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text>Lorem epsum lorem epsum</Text>
            </View>
            <View style={{flexDirection: 'row', marginBottom: Matrics.vs(10)}}>
              <Image
                source={Images.LOCATION}
                style={{
                  width: Matrics.s(20),
                  resizeMode: 'contain',
                  height: Matrics.s(20),
                }}
              />
              <Text>Lorem epsum lorem epsum</Text>
            </View>
          </View>
          <Image
            source={Images.BANNER}
            style={{
              width: Matrics.s(100),
              height: Matrics.s(70),
              resizeMode: 'cover',
              borderRadius: Matrics.s(10),
            }}
          />
        </View>
        <View style={{marginTop: Matrics.vs(10)}}>
          <Text
            style={{
              width: Matrics.s(170),
              fontFamily: typography.fontFamily.Montserrat.Bold,
              fontSize: typography.fontSizes.fs18,
            }}>
            Price
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderStyle: 'dashed',
              borderBottomWidth: 2,
              borderColor: COLOR.BORDER_COLOR,
              paddingBottom: Matrics.vs(10),
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                }}>
                Regular Room - Queen Bed
              </Text>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                1 Room
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5}}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                $45
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs15,
                }}>
                $30
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderStyle: 'dashed',
              borderBottomWidth: 2,
              borderColor: COLOR.BORDER_COLOR,
              marginTop: Matrics.vs(10),
              paddingBottom: Matrics.vs(10),
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                }}>
                Regular Room - Queen Bed
              </Text>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                1 Room
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5}}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                $45
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs15,
                }}>
                $30
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderBottomWidth: 2,
              borderColor: COLOR.BORDER_COLOR,
              marginTop: Matrics.vs(10),
              paddingBottom: Matrics.vs(10),
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                }}>
                Regular Room - Queen Bed
              </Text>
              <Text
                style={{
                  color: COLOR.DARK_TEXT_COLOR,
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                1 Room
              </Text>
            </View>
            <View style={{flexDirection: 'row', gap: 5}}>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  fontSize: typography.fontSizes.fs11,
                }}>
                $45
              </Text>
              <Text
                style={{
                  fontFamily: typography.fontFamily.Montserrat.Medium,
                  fontSize: typography.fontSizes.fs15,
                }}>
                $30
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                color: COLOR.PRIMARY,
                fontSize: typography.fontSizes.fs18,
              }}>
              Total (incl.VAT)
            </Text>
            <Text
              style={{
                fontFamily: typography.fontFamily.Montserrat.SemiBold,
                color: COLOR.PRIMARY,
                fontSize: typography.fontSizes.fs18,
              }}>
              $137
            </Text>
          </View>
        </View>
        <View>
          
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default HotelPaymentsPage;
