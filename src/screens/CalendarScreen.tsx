import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Home, BarChart2, LayoutGrid } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Screen from '../components/Screen';
import {Calendar} from 'react-native-calendars';

export default function CalendarScreen() {
  const router = useRouter();
  
  const [selected, setSelected] = useState('2026-04-08');

  const tasks = [
    { id: '1', title: 'Do maths assignment' },
    { id: '2', title: 'Buy gift for next week' },
    { id: '3', title: 'Meal prep + groceries' },
    { id: '4', title: 'OOP lab submission' },
  ];

  return (
    <Screen style={styles.container}>
      {/* --- HEADER --- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft color="#702D91" size={28} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* --- CALENDAR CARD --- */}
        <View style={styles.calendarCard}>
          <Calendar
            // Initial view
            current={'2026-04-08'}
            
            // This handles the tap (replaces click/hover)
            onDayPress={(day: any) => {
              setSelected(day.dateString);
              console.log('Selected:', day.dateString);
            }}

            // This visualizes the selection
            markedDates={{
              [selected]: { 
                selected: true, 
                disableTouchEvent: true, 
                selectedColor: '#702D91', 
                selectedTextColor: 'white' 
              },
              '2026-04-15': { marked: true, dotColor: '#B886CD' },
            }}
            
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: 'transparent',
              textSectionTitleColor: '#702D91',
              selectedDayBackgroundColor: '#702D91',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#B886CD',
              dayTextColor: '#4B0082',
              monthTextColor: '#4B0082',
              textMonthFontWeight: 'bold',
              textMonthFontSize: 20,
              arrowColor: '#702D91',
              textDayFontWeight: '500',
              textDayHeaderFontWeight: 'bold',
            }}
          />
        </View>

        {/* --- TASKS SECTION --- */}
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>Todays Tasks</Text>
          {tasks.map((item, index) => (
            <View 
              key={item.id} 
              style={[
                styles.taskItem, 
                index === tasks.length - 1 && { borderBottomWidth: 0 }
              ]}
            >
              <Text style={styles.taskText}>{item.title}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* --- BOTTOM NAVIGATION --- */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Home color="#4B0082" size={26} />
        </TouchableOpacity>
        <BarChart2 color="#4B0082" size={26} />
        <LayoutGrid color="#4B0082" size={26} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#702D91' },
  calendarCard: {
    backgroundColor: '#D6B4E5', 
    marginHorizontal: 15,
    borderRadius: 35,
    padding: 10,
    borderWidth: 2,
    borderColor: '#702D91',
    overflow: 'hidden',
  },
  taskCard: {
    backgroundColor: '#E5D1F0',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 25,
    padding: 20,
    marginBottom: 100, 
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#702D91',
    marginBottom: 10,
  },
  taskItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C4A6D1',
  },
  taskText: { color: '#4B0082', fontSize: 15, fontWeight: '500' },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: '#C4A6D1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});