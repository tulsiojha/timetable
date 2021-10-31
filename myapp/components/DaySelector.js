import React, {useEffect, useState} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

const DaySelector = params => {
  const {timeSelectCallback, data} = params;

  const onDoneClicked = item => {
    timeSelectCallback(item);
  };
  return (
    <>
      <View
        style={[
          {
            maxHeight: '70%',
            backgroundColor: 'white',
            margin: 30,
            borderRadius: 5,
            padding: 10,
          },
        ]}>
        <Text
          style={{
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.2)',
          }}>
          Select Start Time
        </Text>
        <FlatList
          data={data.data}
          renderItem={({item, index}) => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => onDoneClicked(item)}>
              <Text
                style={{
                  paddingVertical: 15,
                  paddingStart: 10,
                  color: 'black',
                  fontSize: 20,
                }}>
                {data.type === 'time'}?
                {item.hrs > 9 ? item.hrs : '0' + item.hrs}:
                {item.mins > 9 ? item.mins : '0' + item.mins}{' '}
                {item.hrs >= 12 ? 'PM' : 'AM'}:{item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </>
  );
};

export default DaySelector;
