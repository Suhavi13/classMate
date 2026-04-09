import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  StyleSheet, 
  StatusBar 
} from 'react-native';
import { 
  ChevronLeft, 
  Home, 
  BarChart2, 
  Calendar, 
  ChevronRight,
  LayoutGrid 
} from 'lucide-react-native';

import Pill from '../components/Pill'; 
import { useTheme } from '../theme/ThemeProvider'; 
import { useRouter } from 'expo-router'; 

type EntryType = 'Task' | 'Habit';

const AddItemScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EntryType>('Task');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Navigation */}
      <View style={styles.header}>
        <TouchableOpacity accessibilityLabel="Go back">
          <ChevronLeft color="#702D91" size={28} />
        </TouchableOpacity>
        
        <View style={styles.tabSwitch}>
          {(['Task', 'Habit'] as EntryType[]).map((type) => (
            <TouchableOpacity 
              key={type}
              style={[styles.tabButton, activeTab === type && styles.activeTab]}
              onPress={() => setActiveTab(type)}
            >
              <Text style={[styles.tabText, activeTab === type && styles.activeTabText]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ width: 28 }} /> 
      </View>

      {/* Main Form Card */}
      <View style={[styles.card, activeTab === 'Task' ? styles.taskBorder : styles.habitBorder]}>
        <Text style={styles.cardTitle}>{activeTab}</Text>

        {/* Input Group */}
        <View style={styles.inputGroup}>
          <TextInput 
            placeholder={`${activeTab} Name`} 
            placeholderTextColor="#C4A6D1" 
            style={styles.textInputTop} 
          />
          <View style={styles.divider} />
          <TextInput 
            placeholder={activeTab === 'Task' ? "Type your task here..." : "Description"} 
            placeholderTextColor="#C4A6D1" 
            multiline
            style={styles.textInputBottom} 
          />
        </View>

        {/* Dynamic Date/Duration Selector */}
        <TouchableOpacity style={styles.selectorRow}>
          <View style={styles.selectorLeft}>
            {activeTab === 'Habit' && <LayoutGrid color="#702D91" size={20} style={{marginRight: 10}} />}
            <View>
              {activeTab === 'Habit' && <Text style={styles.smallLabel}>Duration</Text>}
              <Text style={styles.selectorText}>
                {activeTab === 'Task' ? 'April 24, 2026' : '13/04/2026 - 24/04/2026'}
              </Text>
            </View>
          </View>
          <ChevronRight color="#702D91" size={20} />
        </TouchableOpacity>

        {/* Reminder & Priority Box */}
        <View style={styles.priorityBox}>
          <TouchableOpacity style={styles.reminderRow}>
            <Text style={styles.label}>Reminder</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.valueText}>9:00am</Text>
              <ChevronRight color="#702D91" size={18} />
            </View>
          </TouchableOpacity>

          <View style={styles.priorityRow}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityButtons}>
              {['High', 'Medium', 'Low'].map((p) => (
                <TouchableOpacity key={p} style={styles.pButton}>
                  <Text style={styles.pButtonText}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save {activeTab}</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Home color="#4B0082" size={26} />
        <BarChart2 color="#4B0082" size={26} />
        <LayoutGrid color="#4B0082" size={26} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FBF2' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tabSwitch: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#702D91',
    width: '65%',
    overflow: 'hidden',
  },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center' },
  activeTab: { backgroundColor: '#B886CD' },
  tabText: { color: '#702D91', fontWeight: '700', fontSize: 14 },
  activeTabText: { color: '#FFF' },
  
  card: {
    flex: 1,
    backgroundColor: '#F3E8FF',
    marginTop: 10,
    marginHorizontal: 15,
    borderTopLeftRadius: 45,
    borderTopRightRadius: 45,
    padding: 25,
    borderWidth: 2,
  },
  taskBorder: { borderColor: '#3B82F6' }, // Blue border for Task
  habitBorder: { borderColor: '#702D91' }, // Purple border for Habit
  
  cardTitle: { fontSize: 32, fontWeight: 'bold', color: '#702D91', marginBottom: 25 },
  
  inputGroup: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    marginBottom: 20,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  textInputTop: { paddingVertical: 14, fontSize: 16, color: '#702D91' },
  textInputBottom: { paddingVertical: 14, fontSize: 15, height: 60, textAlignVertical: 'top' },
  divider: { height: 1, backgroundColor: '#E0E0E0' },
  
  selectorRow: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    marginBottom: 20,
    elevation: 2,
  },
  selectorLeft: { flexDirection: 'row', alignItems: 'center' },
  smallLabel: { fontSize: 10, color: '#702D91', fontWeight: '600', textTransform: 'uppercase' },
  selectorText: { color: '#702D91', fontSize: 16, fontWeight: '500' },
  
  priorityBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A0A0A0',
    padding: 18,
    elevation: 2,
  },
  reminderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#EEE',
    marginBottom: 15
  },
  label: { color: '#702D91', fontWeight: '700', fontSize: 15 },
  valueText: { color: '#702D91', marginRight: 8, fontSize: 15 },
  
  priorityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priorityButtons: { flexDirection: 'row', gap: 6 },
  pButton: { 
    borderWidth: 1.5, 
    borderColor: '#702D91', 
    borderRadius: 6, 
    paddingHorizontal: 12, 
    paddingVertical: 4 
  },
  pButtonText: { color: '#702D91', fontSize: 13, fontWeight: '600' },

  saveButton: {
    backgroundColor: '#C4A6D1',
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#702D91',
  },
  saveButtonText: { fontSize: 22, fontWeight: '900', color: '#4B0082' },

  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 25,
    backgroundColor: '#C4A6D1',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }
});

export default AddItemScreen;