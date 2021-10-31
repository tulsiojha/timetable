/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

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
  Button,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DaySelector from './components/DaySelector';

const times = {
  type: 'time',
  data: [
    {hrs: 6, mins: 0},
    {hrs: 6, mins: 30},
    {hrs: 7, mins: 0},
    {hrs: 7, mins: 30},
    {hrs: 8, mins: 0},
    {hrs: 8, mins: 30},
    {hrs: 9, mins: 0},
    {hrs: 9, mins: 30},
    {hrs: 10, mins: 0},
    {hrs: 10, mins: 30},
    {hrs: 11, mins: 0},
    {hrs: 11, mins: 30},
    {hrs: 12, mins: 0},
    {hrs: 12, mins: 30},
    {hrs: 13, mins: 0},
    {hrs: 13, mins: 30},
    {hrs: 14, mins: 0},
    {hrs: 14, mins: 30},
    {hrs: 15, mins: 0},
    {hrs: 15, mins: 30},
    {hrs: 16, mins: 0},
    {hrs: 16, mins: 30},
    {hrs: 17, mins: 0},
    {hrs: 17, mins: 30},
    {hrs: 18, mins: 0},
    {hrs: 18, mins: 30},
    {hrs: 19, mins: 0},
    {hrs: 19, mins: 30},
    {hrs: 20, mins: 0},
    {hrs: 20, mins: 30},
    {hrs: 21, mins: 0},
    {hrs: 21, mins: 30},
    {hrs: 22, mins: 0},
    {hrs: 22, mins: 30},
    {hrs: 23, mins: 0},
    {hrs: 23, mins: 30},
  ],
};

const duration = {
  type: 'duration',
  data: ['30 mins', '1 hrs', '2 hrs', '3 hrs', '4 hrs', '5 hrs'],
};

const App = () => {
  const start = 6,
    end = 18;

  const [subjects, setSubjects] = useState([]);
  const [currentTime, setCurrentTime] = useState(() => {
    var now = new Date();
    var hrs = now.getHours();
    var mins = now.getMinutes();
    return {hrs, mins};
  });

  const [error, setError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [choosedDays, setChoosedDays] = useState([]);

  const [selectedStartTime, setSelectedStartTime] = useState({
    key: '9 AM',
    value: 9,
  });
  const [selectedEndTime, setSelectedEndTime] = useState({
    key: '10 AM',
    value: 10,
  });
  const [timeType, setTimeType] = useState('start');

  const [subjectTeacher, setSubjectTeacher] = useState('');
  const [subjectName, setSubjectName] = useState('');

  const [selectedDay, setSelectedDay] = useState(0);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    const trackerTime = setInterval(() => {
      var now = new Date();
      var hrs = now.getHours();
      var mins = now.getMinutes();
      setCurrentTime({now, hrs, mins});
    }, 1000);

    return () => {
      clearInterval(trackerTime);
    };
  }, [currentTime]);

  const generatePickerTime = () => {
    let time = [];
    for (var i = start; i < end; i++) {
      time.push({
        key: i > 12 ? `${i - 12} PM` : `${i} AM`,
        value: {hrs: i, mins: 0},
      });
    }
    return time;
  };
  const generateTimeline = () => {
    let data = [];
    for (var i = start; i < end; i++) {
      data.push(
        <View style={styles.timeblock} key={i}>
          {i > 12 ? (
            <Text style={styles.timeText}>{i - 12} PM</Text>
          ) : (
            <Text style={styles.timeText}>{i} AM</Text>
          )}
          <View style={styles.timeborder}></View>
        </View>,
      );
    }
    return data;
  };

  const handleDayClicked = day => {
    setSelectedDay(day);
  };

  const handleDaysSelect = day => {
    setChoosedDays(prevState => {
      var newState = [...prevState];
      if (newState.includes(day)) {
        newState.splice(newState.indexOf(day), 1);
      } else newState.push(day);
      return newState;
    });
  };

  const handleTimeSelectCallback = data => {
    console.log(data);
    if (timeType === 'start') {
      setSelectedStartTime(data);
    } else {
      setSelectedEndTime(data);
    }
    setShowListModal(false);
  };

  const onAddClicked = () => {
    var shouldAdd = true;
    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      for (let j = 0; j < choosedDays.length; j++) {
        console.log('choosedDays', choosedDays);
        console.log('subDays', subject.days);
        if (subject.days.includes(choosedDays[i])) {
          console.log('includes');
          console.log(
            'selectedStartTime.value',
            selectedStartTime.value,
            'subject.startTime',
            subject.startTime,
            'subject.endTime',
            subject.endTime,
          );
          console.log(
            'selectedEndTime.value',
            selectedEndTime.value,
            'subject.startTime',
            subject.startTime,
            'subject.endTime',
            subject.endTime,
          );
          if (
            (selectedStartTime.value >= subject.startTime &&
              selectedStartTime.value <= subject.endTime) ||
            (selectedEndTime.value >= subject.startTime &&
              selectedEndTime.value <= subject.endTime)
          ) {
            console.log('error', true);
            shouldAdd = false;
          }
        }
      }
    }
    if (
      subjectName === '' ||
      subjectTeacher === '' ||
      choosedDays.length < 1 ||
      !shouldAdd
    ) {
      setError(true);
    } else {
      setSubjects(prevState => {
        var tempSub = [...prevState];
        tempSub.push({
          name: subjectName,
          startTime: selectedStartTime.value,
          endTime: selectedEndTime.value,
          days: choosedDays,
        });
        return tempSub;
      });
      setError(false);
      setShowAddModal(false);
    }
  };

  return (
    <>
      <ScrollView style={styles.root}>
        {generateTimeline()}
        {subjects
          .filter(subject => subject.days.includes(selectedDay) == true)
          .map((subject, index) => {
            console.log(subject.startTime - start);
            return (
              <View
                style={[
                  styles.subject,
                  {
                    top: (subject.startTime - start) * 120,
                    height:
                      subject.endTime - subject.startTime > 1
                        ? (subject.endTime - subject.startTime) * 119
                        : (subject.endTime - subject.startTime) * 118,
                  },
                ]}
                key={index}>
                <Text>{subject.name}</Text>
              </View>
            );
          })}
        <View
          style={[
            styles.timelineHolder,
            {top: (currentTime.hrs - start) * 120 + currentTime.mins * 2},
          ]}>
          <Text style={styles.timelineText}>
            {currentTime.hrs}:{currentTime.mins}
          </Text>
          <View style={styles.timelineTrackHolder}>
            <View style={styles.timelineTrack}></View>
            <View style={styles.timelineTrackDot}></View>
          </View>
        </View>
      </ScrollView>
      <View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            paddingVertical: 10,
            backgroundColor: 'white',
            elevation: 5,
            paddingHorizontal: 10,
          },
        ]}>
        <View
          style={[
            {
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 5,
              paddingBottom: 15,
            },
          ]}>
          <Text>Timetable</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setShowAddModal(true)}>
            <Text
              style={[
                {
                  height: 20,
                  // width: 20,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: 15,
                  color: '#570df8',
                },
              ]}>
              + ADD
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={[
            {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            },
          ]}>
          {weekDays.map((day, index) => {
            return (
              <Text
                style={[
                  {
                    height: 30,
                    width: 50,
                    borderRadius: 10,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: 'black',
                  },
                  index === selectedDay && {
                    backgroundColor: '#570df8',
                    color: 'white',
                  },
                ]}
                key={index}
                onPress={() => handleDayClicked(index)}>
                {day}
              </Text>
            );
          })}
        </View>
      </View>
      <Modal visible={showAddModal} transparent={true} animationType="slide">
        <View
          style={[
            {
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.4)',
            },
          ]}>
          <View
            style={[
              {
                padding: 20,
                backgroundColor: 'white',
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              },
            ]}>
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0,0,0,0.2)',
                marginBottom: 20,
                paddingBottom: 5,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                }}>
                New Subject
              </Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text
                  style={{
                    height: 25,
                    width: 25,
                    borderRadius: 25,
                    backgroundColor: 'black',
                    textAlignVertical: 'center',
                    textAlign: 'center',
                    lineHeight: 15,
                    color: 'white',
                  }}>
                  x
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Subject name</Text>
              {subjectName === '' && error && (
                <Text style={{color: 'red'}}>required !</Text>
              )}
            </View>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 5,
                  marginStart: 10,
                  marginBottom: 20,
                  marginTop: 10,
                },
              ]}
              value={subjectName}
              onChangeText={e => setSubjectName(e)}
            />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <View style={{marginRight: 10}}>
                <Text style={{color: 'black'}}>Start Time</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setTimeType('start');
                    setShowListModal(true);
                  }}>
                  <Text
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: 'rgba(0,0,0,0.1)',
                      maxWidth: 150,
                      minWidth: 100,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      marginStart: 10,
                      marginBottom: 20,
                      marginTop: 10,
                    }}>
                    {selectedStartTime.hrs > 9
                      ? selectedStartTime.hrs
                      : '0' + selectedStartTime.hrs}
                    :
                    {selectedStartTime.mins > 9
                      ? selectedStartTime.mins
                      : '0' + selectedStartTime.mins}{' '}
                    {selectedStartTime.hrs >= 12 ? 'PM' : 'AM'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <Text style={{color: 'black'}}>Duration</Text>
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => {
                    setTimeType('end');
                    setShowListModal(true);
                  }}>
                  <Text
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      borderColor: 'rgba(0,0,0,0.1)',
                      maxWidth: 150,
                      minWidth: 100,
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      marginStart: 10,
                      marginBottom: 20,
                      marginTop: 10,
                    }}>
                    {selectedEndTime.key}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Choose Days</Text>
              {choosedDays.length < 1 && error && (
                <Text style={{color: 'red'}}>required !</Text>
              )}
            </View>
            <View
              style={[
                {
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                },
              ]}>
              {weekDays.map((day, index) => {
                return (
                  <Text
                    style={[
                      {
                        marginHorizontal: 5,
                        marginVertical: 8,
                        marginBottom: 20,
                        backgroundColor: 'rgba(87, 13, 248, .21)',
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                        borderRadius: 5,
                        color: '#570df8',
                      },
                      choosedDays.includes(index) && {
                        backgroundColor: '#570df8',
                        color: 'white',
                      },
                    ]}
                    key={index}
                    onPress={() => handleDaysSelect(index)}>
                    {day}
                  </Text>
                );
              })}
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={{color: 'black'}}>Subject teacher</Text>
              {subjectTeacher === '' && error && (
                <Text style={{color: 'red'}}>required !</Text>
              )}
            </View>
            <TextInput
              style={[
                {
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.1)',
                  borderRadius: 5,
                  marginStart: 10,
                  marginBottom: 20,
                  marginTop: 10,
                },
              ]}
              value={subjectTeacher}
              onChangeText={e => setSubjectTeacher(e)}
            />
            <TouchableOpacity activeOpacity={0.8} onPress={onAddClicked}>
              <Text
                style={{
                  backgroundColor: '#570df8',
                  color: 'white',
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderRadius: 5,
                  textAlign: 'center',
                  marginStart: 10,
                }}>
                Add Subject
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={showListModal} transparent={true}>
        <View
          style={[
            {
              display: 'flex',
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
          ]}>
          <DaySelector
            timeSelectCallback={handleTimeSelectCallback}
            data={times}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flex: 1,
    backgroundColor: 'white',
    marginTop: 50,
  },

  timeblock: {
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  timeborder: {
    height: 1,
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  timeText: {
    flex: 0,
    paddingEnd: 5,
    height: 16,
    width: 52,
    textAlign: 'right',
  },

  subject: {
    position: 'absolute',
    backgroundColor: 'red',
    width: '100%',
    marginLeft: 57,
    marginTop: 61,
    borderRadius: 5,
  },

  timelineHolder: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'absolute',
    marginTop: 60 - 7,
    height: 14,
    width: '100%',
  },

  timelineText: {fontSize: 10, color: 'red', paddingRight: 5},

  timelineTrackHolder: {
    position: 'relative',
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },

  timelineTrack: {height: 1, backgroundColor: 'red', width: '100%'},

  timelineTrackDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
    position: 'absolute',
    backgroundColor: 'red',
    borderColor: 'white',
    borderWidth: 1,
    marginStart: 5,
  },
});

export default App;
