import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-gesture-handler';
import NormalHeader from '../../Components/UI/NormalHeader';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getReferralListThunk,
  resetReferralList,
} from '../../Redux/Reducers/ReferralReducer/ReferralListSlice';
import {Images} from '../../Config';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';
import Clipboard from '@react-native-clipboard/clipboard';
import {success} from '../../Helpers/ToastMessage';
const Referrals = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {referralList, isLoading, error} = useSelector(
    state => state.referralList,
  );

  // Local state for filtering and UI
  const [currentFilter, setCurrentFilter] = useState('All');
  const [currentStatusType, setCurrentStatusType] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const hasInitialized = useRef(false);
  const limit = 10;

  const filterOptions = [
    {label: 'All', value: 'All'},
    {label: 'Pending', value: 'Pending'},
    {label: 'Completed', value: 'Completed'},
  ];

  const getStatusStyle = status => {
    const baseStyle = {
      paddingHorizontal: Matrics.s(5),
      paddingVertical: Matrics.vs(4),
      borderRadius: Matrics.s(12),
      alignSelf: 'flex-start',
    };

    if (status === 0) {
      return {
        ...baseStyle,
        backgroundColor: '#FFF4E6',
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: '#E8F5E8',
      };
    }
  };

  const getStatusTextStyle = status => {
    const baseStyle = {
      fontSize: Matrics.s(10),
      fontFamily: typography.fontFamily.Montserrat.Medium,
    };

    if (status === 0) {
      return {
        ...baseStyle,
        color: '#F59E0B',
      };
    } else {
      return {
        ...baseStyle,
        color: '#10B981',
      };
    }
  };

  const getDisplayStatus = status => {
    if (status === 0) {
      return 'Pending';
    }
    if (status === 1) {
      return 'Completed';
    }
    return status || 'Unknown';
  };

  const formatDate = dateString => {
    if (!dateString) {
      return 'N/A';
    }

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const loadReferrals = useCallback(
    async (
      page = 1,
      statusType = null,
      filterName = 'All',
      isNewFilter = false,
    ) => {
      try {
        const thunkParams = {
          pageCount: page,
          limit: limit,
          statusType: statusType,
          isNewFilter: isNewFilter,
        };

        await dispatch(getReferralListThunk(thunkParams)).unwrap();

        if (isNewFilter) {
          setCurrentFilter(filterName);
          setCurrentStatusType(statusType);
        }
      } catch (err) {
        console.error('Error loading referrals:', err);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [dispatch],
  );

  // Initial load with cleanup
  useFocusEffect(
    useCallback(() => {
      let isCancelled = false;

      const loadInitialData = async () => {
        if (!isCancelled && !hasInitialized.current) {
          hasInitialized.current = true;
          dispatch(resetReferralList());

          try {
            const thunkParams = {
              pageCount: 1,
              limit: limit,
              statusType: null,
              isNewFilter: true,
            };

            await dispatch(getReferralListThunk(thunkParams)).unwrap();
            setCurrentFilter('All');
            setCurrentStatusType(null);
          } catch (err) {
            console.error('Error loading initial referrals:', err);
          }
        }
      };

      loadInitialData();

      return () => {
        isCancelled = true;
        hasInitialized.current = false;
      };
    }, [dispatch]),
  );

  const handleFilterSelect = selectedFilter => {
    setShowDropdown(false);
    if (selectedFilter !== currentFilter) {
      // Map filter to API status values
      let statusType = null;

      if (selectedFilter === 'Pending') {
        statusType = 0;
      } else if (selectedFilter === 'Completed') {
        statusType = 1;
      } else if (selectedFilter === 'All') {
        statusType = null;
      }

      dispatch(resetReferralList());
      loadReferrals(1, statusType, selectedFilter, true);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (
      !isLoading &&
      !isLoadingMore &&
      referralList.hasMore &&
      referralList.data.length > 0
    ) {
      const nextPage = referralList.currentPage + 1;
      setIsLoadingMore(true);
      loadReferrals(nextPage, currentStatusType, currentFilter, false);
    }
  }, [
    isLoading,
    isLoadingMore,
    referralList.hasMore,
    referralList.currentPage,
    referralList.data.length,
    currentStatusType,
    currentFilter,
    loadReferrals,
  ]);

  const renderDropdown = () => (
    <Modal
      transparent={true}
      visible={showDropdown}
      animationType="fade"
      onRequestClose={() => setShowDropdown(false)}>
      <TouchableOpacity
        style={styles.dropdownOverlay}
        activeOpacity={1}
        onPress={() => setShowDropdown(false)}>
        <View style={styles.dropdownContainer}>
          {filterOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.dropdownItem,
                index === 0 && styles.dropdownItemFirst,
                index === filterOptions.length - 1 && styles.dropdownItemLast,
                currentFilter === option.value && styles.selectedDropdownItem,
              ]}
              onPress={() => handleFilterSelect(option.value)}>
              <Text
                style={[
                  styles.dropdownItemText,
                  currentFilter === option.value &&
                    styles.selectedDropdownItemText,
                ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderTableHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Referrals List</Text>
        <TouchableOpacity
          style={styles.filterDropdownButton}
          onPress={() => setShowDropdown(true)}>
          <Text style={styles.filterDropdownText}>{currentFilter}</Text>
          <Image
            source={Images.DOWN_ARROW_GRAY}
            style={{
              width: Matrics.s(14),
              height: Matrics.s(14),
            }}
            resizeMethod="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, {flex: 0.5}]}>#</Text>
        <Text style={[styles.headerText, {flex: 1.5}]}>Date of Refer</Text>
        <Text style={[styles.headerText, {flex: 1.2}]}>Amount</Text>
        <Text style={[styles.headerText, {flex: 1}]}>Status</Text>
      </View>
    </View>
  );

  const renderRow = ({item, index}) => (
    <View style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
      <Text style={[styles.cellText, {flex: 0.5}]}>{index + 1}</Text>
      <Text style={[styles.cellText, {flex: 1.5}]}>
        {formatDate(item.referral_date)}
      </Text>
      <Text style={[styles.cellText, styles.amountText, {flex: 1.2}]}>
        ${item?.amount || '0.00'}
      </Text>
      <View style={{flex: 1}}>
        <View style={getStatusStyle(item.status)}>
          <Text style={getStatusTextStyle(item.status)}>
            {getDisplayStatus(item.status)}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color={COLOR.PRIMARY} />
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No referrals found</Text>
      <Text style={styles.emptySubtext}>
        {currentFilter !== 'All'
          ? `No ${currentFilter.toLowerCase()} referrals available`
          : "You haven't made any referrals yet"}
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  const handleCopyToClipboard = () => {
    Clipboard.setString(
      'https://ota.visionvivante.in/signup?referralcode=MK2165',
    );
    success('Copied to clipboard');
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message:
          'Join OTA and get amazing travel deals! Use my referral link: https://ota.visionvivante.in/signup?referralcode=MK2165',
        url: 'https://ota.visionvivante.in/signup?referralcode=MK2165',
        title: 'Join OTA - Your Travel Companion',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
          // success('Link shared successfully!');
        } else {
          // Shared
          // success('Link shared successfully!');
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // You could add an error toast here if needed
    }
  };

  const renderContent = () => (
    <>
      <ScrollView>
        <NormalHeader
          title="My Referrals"
          leftIconName="round"
          showRightButton={false}
          onCrossPress={() => navigation.goBack()}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: Matrics.s(6),
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
              paddingHorizontal: Matrics.s(12),
              paddingVertical: Matrics.vs(16),
              borderRadius: Matrics.s(12),
              marginRight: Matrics.s(8),
              marginVertical: Matrics.vs(16),
              backgroundColor: COLOR.WHITE,
              boxShadow: '0 4px 8px 0 rgba(139, 92, 246, 0.15)',
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: Matrics.s(12),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: COLOR.PRIMARY,
                }}>
                My Referrals
              </Text>
              <Text
                style={{
                  fontSize: Matrics.s(26),
                  fontFamily: typography.fontFamily.Montserrat.Bold,
                  color: COLOR.PRIMARY,
                }}>
                {referralList?.data?.total_amount}
              </Text>
            </View>
            <View
              style={{
                alignSelf: 'flex-end',
              }}>
              <Image
                source={Images.MONEY_MONEY}
                style={{width: 30, height: 30}}
                resizeMethod="contain"
              />
            </View>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: COLOR.PRIMARY,
              paddingHorizontal: Matrics.s(12),
              paddingVertical: Matrics.vs(16),
              borderRadius: Matrics.s(12),
              marginLeft: Matrics.s(8),
              marginVertical: Matrics.vs(16),
              backgroundColor: COLOR.WHITE,
              boxShadow: '0 4px 8px 0 rgba(139, 92, 246, 0.15)',
            }}>
            <View style={{flex: 1, paddingRight: Matrics.s(8)}}>
              <Text
                style={{
                  fontSize: Matrics.s(12),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: COLOR.PRIMARY,
                  flexWrap: 'wrap',
                  // lineHeight: Matrics.s(16),
                }}>
                Share Link with Your Friends
              </Text>
              {/* <Text
                style={{
                  fontSize: Matrics.s(12),
                  fontFamily: typography.fontFamily.Montserrat.Regular,
                  color: COLOR.DARK_TEXT_COLOR,
                }}>
                https://www.arabal..../referral/MK2165
              </Text> */}
              <View
                style={{
                  flexDirection: 'row',
                  gap: Matrics.s(8),
                  marginTop: Matrics.vs(8),
                }}>
                <TouchableOpacity
                  onPress={() => {
                    handleCopyToClipboard();
                  }}>
                  <Image
                    source={Images.COPY_ICON}
                    style={{width: 20, height: 20}}
                    resizeMethod="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handleShare();
                  }}>
                  <Image
                    source={Images.SHARE_ICON}
                    style={{width: 20, height: 20}}
                    resizeMethod="contain"
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Referrals Table */}
        <View style={styles.container}>
          {error ? (
            <>
              {renderTableHeader()}
              {renderErrorState()}
            </>
          ) : (
            <FlatList
              data={referralList.data.data}
              renderItem={renderRow}
              keyExtractor={(item, index) => `${item?.id || index}-${index}`}
              ListHeaderComponent={renderTableHeader}
              ListFooterComponent={renderFooter}
              ListEmptyComponent={!isLoading ? renderEmptyState : null}
              showsVerticalScrollIndicator={false}
              style={styles.table}
              onEndReached={referralList.hasMore ? handleLoadMore : null}
              onEndReachedThreshold={0.1}
            />
          )}
        </View>
        {renderDropdown()}
      </ScrollView>
    </>
  );

  return Platform.OS === 'android' ? (
    <SafeAreaView style={{flex: 1}}>{renderContent()}</SafeAreaView>
  ) : (
    <View style={{flex: 1}}>{renderContent()}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: Matrics.s(12),
    marginVertical: Matrics.vs(16),
  },
  headerContainer: {
    borderTopLeftRadius: Matrics.s(12),
    borderTopRightRadius: Matrics.s(12),
  },
  headerTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(16),
    paddingVertical: Matrics.vs(7),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
  },
  headerTitle: {
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.Bold,
    color: COLOR.TITLE_COLOR,
  },
  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Matrics.s(12),
    paddingVertical: Matrics.vs(8),
  },
  filterDropdownText: {
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.TITLE_COLOR,
    marginRight: Matrics.s(8),
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: Matrics.vs(120),
    paddingHorizontal: Matrics.s(16),
  },
  dropdownContainer: {
    backgroundColor: COLOR.WHITE,
    borderRadius: Matrics.s(8),
    marginLeft: 'auto',
    marginRight: Matrics.s(16),
    minWidth: Matrics.s(120),
    shadowColor: COLOR.BLACK,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingHorizontal: Matrics.s(16),
    paddingVertical: Matrics.vs(12),
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
  },
  dropdownItemFirst: {
    borderTopLeftRadius: Matrics.s(8),
    borderTopRightRadius: Matrics.s(8),
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: Matrics.s(8),
    borderBottomRightRadius: Matrics.s(8),
  },
  selectedDropdownItem: {
    backgroundColor: COLOR.PRIMARY,
  },
  dropdownItemText: {
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.TITLE_COLOR,
  },
  selectedDropdownItemText: {
    color: COLOR.WHITE,
    fontFamily: typography.fontFamily.Montserrat.Medium,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: Matrics.s(16),
    paddingVertical: Matrics.vs(12),
    backgroundColor: COLOR.SMALL_CARD_BACKGROUND,
  },
  headerText: {
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.TITLE_COLOR,
  },
  table: {
    borderRadius: Matrics.s(12),
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: Matrics.s(16),
    paddingVertical: Matrics.vs(16),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR.BORDER_COLOR,
  },
  evenRow: {
    backgroundColor: '#FAFAFA',
  },
  cellText: {
    fontSize: Matrics.s(14),
    fontFamily: typography.fontFamily.Montserrat.Regular,
    color: COLOR.TITLE_COLOR,
  },
  amountText: {
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.SUCCESS,
  },
  loadingFooter: {
    paddingVertical: Matrics.vs(20),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: Matrics.s(8),
    color: COLOR.DIM_TEXT_COLOR,
    fontSize: Matrics.s(14),
  },
  emptyState: {
    paddingVertical: Matrics.vs(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Matrics.s(16),
    fontFamily: typography.fontFamily.Montserrat.Medium,
    color: COLOR.TITLE_COLOR,
    marginBottom: Matrics.vs(8),
  },
  emptySubtext: {
    fontSize: Matrics.s(14),
    color: COLOR.DIM_TEXT_COLOR,
    textAlign: 'center',
  },
  errorState: {
    paddingVertical: Matrics.vs(40),
    alignItems: 'center',
  },
  errorText: {
    fontSize: Matrics.s(14),
    color: COLOR.DANGER,
    textAlign: 'center',
  },
});

export default Referrals;
