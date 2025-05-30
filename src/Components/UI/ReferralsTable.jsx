import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLOR, Matrics, typography} from '../../Config/AppStyling';

const ReferralsTable = ({data = [], title = 'Simple Table'}) => {
  const renderRow = ({item, index}) => (
    <View
      key={index}
      style={[styles.tableRow, index % 2 === 0 && styles.evenRow]}>
      <Text style={[styles.cellText, {flex: 0.5}]}>{index + 1}</Text>
      <Text style={[styles.cellText, {flex: 1.5}]}>
        {item?.title || 'No Title'}
      </Text>
      <Text style={[styles.cellText, {flex: 1.2}]}>
        {item?.value || 'No Value'}
      </Text>
      <Text style={[styles.cellText, {flex: 1}]}>
        {item?.status || 'No Status'}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, {flex: 0.5}]}>#</Text>
        <Text style={[styles.headerText, {flex: 1.5}]}>Title</Text>
        <Text style={[styles.headerText, {flex: 1.2}]}>Value</Text>
        <Text style={[styles.headerText, {flex: 1}]}>Status</Text>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>No data found</Text>
      <Text style={styles.emptySubtext}>No data available to display</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      {data.length > 0
        ? data.map((item, index) => renderRow({item, index}))
        : renderEmptyState()}
    </View>
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
});

export default ReferralsTable;
