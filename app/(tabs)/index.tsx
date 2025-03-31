import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

// Define the ThemedText component
const ThemedText = ({ children, type, style }) => {
  let textStyle = styles.normalText;
  
  if (type === 'title') textStyle = styles.titleText;
  if (type === 'subtitle') textStyle = styles.subtitleText;
  if (type === 'large') textStyle = styles.largeText;
  
  return <Text style={[textStyle, style]}>{children}</Text>;
};

// Define the ThemedView component
const ThemedView = ({ children, style }) => {
  return <View style={[styles.themedView, style]}>{children}</View>;
};

// Home Screen Component
const HomeScreen = () => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 2);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">BoxBuddy</ThemedText>
      </View>
      
      <View style={styles.counterContainer}>
        <ThemedText type="large">{counter}</ThemedText>
        <TouchableOpacity 
          style={styles.button} 
          onPress={incrementCounter}
        >
          <ThemedText style={styles.buttonText}>Increment</ThemedText>
        </TouchableOpacity>
      </View>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>Tap the purple "Increment" button above to increase the counter by 2.</ThemedText>

        <ThemedView style={styles.tipContainer}>
          <ThemedText style={styles.tipText}>
            💡 Tip: Notice how the counter always increases by 2 instead of 1. This is controlled by the
            <ThemedText style={styles.codeText}> incrementCounter </ThemedText>
            function in our component.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.challengeContainer}>
          <ThemedText style={styles.challengeTitle}>Challenge:</ThemedText>
          <ThemedText>Try modifying the code to make the counter increase by 5 instead of 2.</ThemedText>
        </ThemedView>
      </ThemedView>
    </View>
  );
};

// Nutrition Screen Component
const NutritionScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Nutrition</ThemedText>
      </View>
      
      <ThemedView style={styles.nutritionContainer}>
        <ThemedText type="subtitle">Nutrition Tracker</ThemedText>
        <ThemedText>Track your daily nutrition goals and progress here.</ThemedText>
        
        <ThemedView style={styles.nutritionCard}>
          <ThemedText style={styles.nutritionTitle}>Daily Goals</ThemedText>
          <View style={styles.nutritionRow}>
            <ThemedText>Calories:</ThemedText>
            <ThemedText>2000 kcal</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Protein:</ThemedText>
            <ThemedText>150g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Carbs:</ThemedText>
            <ThemedText>200g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Fat:</ThemedText>
            <ThemedText>65g</ThemedText>
          </View>
        </ThemedView>
        
        <TouchableOpacity style={styles.button}>
          <ThemedText style={styles.buttonText}>Add Meal</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </View>
  );
};

// Main App Component with Tabs
const BoxBuddy = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {activeTab === 'home' ? <HomeScreen /> : <NutritionScreen />}
      </View>
      
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'home' && styles.activeTab]} 
          onPress={() => setActiveTab('home')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'home' && styles.activeTabText]}>Home</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'nutrition' && styles.activeTab]} 
          onPress={() => setActiveTab('nutrition')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'nutrition' && styles.activeTabText]}>Nutrition</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#8A2BE2', // Purple color
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
  },
  tipContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#e6f7ff',
    borderRadius: 6,
  },
  tipText: {
    fontSize: 14,
  },
  codeText: {
    fontFamily: 'monospace',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 4,
  },
  challengeContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff9e6',
    borderRadius: 6,
  },
  challengeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  // Tab Bar Styles
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    height: 60,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  activeTab: {
    borderTopWidth: 2,
    borderTopColor: '#8A2BE2',
  },
  tabText: {
    fontSize: 14,
    color: '#757575',
  },
  activeTabText: {
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  // Nutrition Screen Styles
  nutritionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  nutritionCard: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
  },
  nutritionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  // Themed text styles
  normalText: {
    fontSize: 16,
    color: '#333333',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  largeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333333',
  },
  // Themed view style
  themedView: {
    backgroundColor: '#ffffff',
  },
});

export default BoxBuddy;
