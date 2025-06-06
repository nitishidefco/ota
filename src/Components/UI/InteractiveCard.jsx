import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const InteractiveCard = ({cardDetails}) => {
  const [gradientColors, setGradientColors] = useState([
    '#1a2a6c',
    '#b21f1f',
    '#fdbb2d',
  ]);
  const [gradientAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (cardDetails?.number) {
      // Animate gradient colors smoothly
      Animated.timing(gradientAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }).start();

      // Update gradient colors based on card brand
      const colors = getGradientColors(cardDetails.brand);
      setGradientColors(colors);
    }
  }, [cardDetails?.brand, gradientAnimation]);

  const getGradientColors = brand => {
    // Different gradient combinations based on card brand
    switch (brand?.toLowerCase()) {
      case 'visa':
        return ['#1a2a6c', '#b21f1f', '#fdbb2d'];
      case 'mastercard':
        return ['#4b6cb7', '#182848', '#4b6cb7'];
      case 'amex':
        return ['#11998e', '#38ef7d', '#11998e'];
      default:
        return ['#8E2DE2', '#4A00E0', '#8E2DE2'];
    }
  };

  const formatCardNumber = number => {
    if (!number) return '**** **** **** ****';
    return number;
  };

  const formatExpiryDate = expiryDate => {
    if (!expiryDate) return 'MM/YY';
    return expiryDate;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={styles.cardContainer}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}>
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardType}>
                {cardDetails?.brand === 'Unknown' ? 'CARD' : cardDetails?.brand}
              </Text>
              <View style={styles.chipContainer}>
                <View style={styles.chip} />
              </View>
            </View>

            <View style={styles.cardNumberContainer}>
              <Text style={styles.cardNumber}>
                {formatCardNumber(cardDetails?.number)}
              </Text>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.cardHolderContainer}>
                <Text style={styles.cardLabel}>CARD HOLDER</Text>
                <Text style={styles.cardHolder}>
                  {cardDetails?.holderName || 'YOUR NAME'}
                </Text>
              </View>
              <View style={styles.expiryContainer}>
                <Text style={styles.cardLabel}>EXPIRY</Text>
                <Text style={styles.expiryDate}>
                  {formatExpiryDate(cardDetails?.expiryDate)}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Matrics.s(20),
  },
  cardContainer: {
    width: Matrics.screenWidth * 0.9,
    height: Matrics.screenWidth * 0.55,
    borderRadius: Matrics.s(15),
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradient: {
    flex: 1,
    padding: Matrics.s(20),
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs16,
    fontFamily: typography.fontFamily.Montserrat.Bold,
  },
  chipContainer: {
    width: Matrics.s(50),
    height: Matrics.s(40),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Matrics.s(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    width: Matrics.s(30),
    height: Matrics.s(20),
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: Matrics.s(3),
  },
  cardNumberContainer: {
    marginVertical: Matrics.vs(20),
  },
  cardNumber: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs24,
    fontFamily: typography.fontFamily.Montserrat.Bold,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHolderContainer: {
    flex: 2,
  },
  expiryContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  cardLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: typography.fontSizes.fs12,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  cardHolder: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    marginTop: Matrics.vs(5),
  },
  expiryDate: {
    color: COLOR.WHITE,
    fontSize: typography.fontSizes.fs14,
    fontFamily: typography.fontFamily.Montserrat.SemiBold,
    marginTop: Matrics.vs(5),
  },
});

export default InteractiveCard;
