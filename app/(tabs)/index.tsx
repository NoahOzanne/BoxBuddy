import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, FlatList, Image, ScrollView } from 'react-native';

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
    setCounter(counter + 5);
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

// Food Scanner Component
const FoodScanner = ({ visible, onClose, onFoodScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock food database
  const foodDatabase = [
    { id: '1', name: 'Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3, image: 'https://example.com/apple.jpg' },
    { id: '2', name: 'Banana', calories: 105, protein: 1.3, carbs: 27, fat: 0.4, image: 'https://example.com/banana.jpg' },
    { id: '3', name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, image: 'https://example.com/chicken.jpg' },
    { id: '4', name: 'Broccoli', calories: 55, protein: 3.7, carbs: 11.2, fat: 0.6, image: 'https://example.com/broccoli.jpg' },
    { id: '5', name: 'Salmon', calories: 206, protein: 22, carbs: 0, fat: 13, image: 'https://example.com/salmon.jpg' },
  ];
  
  // Filter foods based on search query
  const filteredFoods = foodDatabase.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Simulate scanning process
  const startScanning = () => {
    setScanning(true);
    
    // Simulate a scan completion after 2 seconds
    setTimeout(() => {
      setScanning(false);
      // Randomly select a food from the database to simulate a scan result
      const randomFood = foodDatabase[Math.floor(Math.random() * foodDatabase.length)];
      onFoodScanned(randomFood);
      onClose();
    }, 2000);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.scannerContainer}>
        <View style={styles.scannerHeader}>
          <ThemedText type="subtitle">Add Food</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText>✕</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a food..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <View style={styles.scanButtonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.scanButton]} 
            onPress={startScanning}
            disabled={scanning}
          >
            <ThemedText style={styles.buttonText}>
              {scanning ? 'Scanning...' : 'Scan Food'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {scanning ? (
          <View style={styles.scanningView}>
            <View style={styles.scanner}>
              <View style={styles.scannerLine} />
            </View>
            <ThemedText style={styles.scanningText}>Scanning food...</ThemedText>
          </View>
        ) : (
          <FlatList
            data={filteredFoods}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.foodItem}
                onPress={() => {
                  onFoodScanned(item);
                  onClose();
                }}
              >
                <View style={styles.foodImagePlaceholder}>
                  {/* In a real app, you would use: <Image source={{uri: item.image}} style={styles.foodImage} /> */}
                  <ThemedText>🍎</ThemedText>
                </View>
                <View style={styles.foodInfo}>
                  <ThemedText style={styles.foodName}>{item.name}</ThemedText>
                  <ThemedText style={styles.foodCalories}>{item.calories} kcal</ThemedText>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <ThemedText style={styles.addButtonText}>+</ThemedText>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </Modal>
  );
};

// Nutrition Screen Component
const NutritionScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [trackedFoods, setTrackedFoods] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  
  // Update daily totals whenever tracked foods change
  useEffect(() => {
    const totals = trackedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    
    setDailyTotals(totals);
  }, [trackedFoods]);
  
  // Handle adding a scanned food to the tracked foods list
  const handleFoodScanned = (food) => {
    setTrackedFoods([...trackedFoods, food]);
  };
  
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Nutrition</ThemedText>
      </View>
      
      <ThemedView style={styles.nutritionContainer}>
        <ThemedText type="subtitle">Nutrition Tracker</ThemedText>
        
        <ThemedView style={styles.nutritionCard}>
          <ThemedText style={styles.nutritionTitle}>Daily Progress</ThemedText>
          <View style={styles.nutritionRow}>
            <ThemedText>Calories:</ThemedText>
            <ThemedText>{dailyTotals.calories} / 2000 kcal</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Protein:</ThemedText>
            <ThemedText>{dailyTotals.protein.toFixed(1)} / 150g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Carbs:</ThemedText>
            <ThemedText>{dailyTotals.carbs.toFixed(1)} / 200g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Fat:</ThemedText>
            <ThemedText>{dailyTotals.fat.toFixed(1)} / 65g</ThemedText>
          </View>
        </ThemedView>
        
        {trackedFoods.length > 0 && (
          <ThemedView style={styles.trackedFoodsContainer}>
            <ThemedText style={styles.nutritionTitle}>Today's Foods</ThemedText>
            <FlatList
              data={trackedFoods}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <View style={styles.trackedFoodItem}>
                  <ThemedText style={styles.trackedFoodName}>{item.name}</ThemedText>
                  <ThemedText style={styles.trackedFoodCalories}>{item.calories} kcal</ThemedText>
                </View>
              )}
            />
          </ThemedView>
        )}
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowScanner(true)}
        >
          <ThemedText style={styles.buttonText}>Add Meal</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <FoodScanner 
        visible={showScanner} 
        onClose={() => setShowScanner(false)}
        onFoodScanned={handleFoodScanned}
      />
    </View>
  );
};

// WOD (Workout of the Day) Screen Component
const WodScreen = () => {
  const [currentWod, setCurrentWod] = useState({
    title: "Today's WOD",
    date: new Date().toLocaleDateString(),
    type: "AMRAP",
    timeLimit: "20 minutes",
    exercises: [
      { name: "Box Jumps", reps: 15, weight: "Body weight" },
      { name: "Kettlebell Swings", reps: 20, weight: "53/35 lbs" },
      { name: "Wall Balls", reps: 15, weight: "20/14 lbs" },
      { name: "Burpees", reps: 10, weight: "Body weight" }
    ],
    notes: "Complete as many rounds as possible in 20 minutes. Rest as needed between exercises."
  });
  
  const [pastWods, setPastWods] = useState([
    {
      id: '1',
      title: "Monday's Strength",
      date: "3 days ago",
      type: "Strength",
      description: "5x5 Back Squat, 3x8 Bench Press"
    },
    {
      id: '2',
      title: "Tuesday's EMOM",
      date: "2 days ago",
      type: "EMOM",
      description: "Every minute on the minute: 10 push-ups, 10 sit-ups"
    },
    {
      id: '3',
      title: "Wednesday's Chipper",
      date: "Yesterday",
      type: "Chipper",
      description: "100 Double-unders, 80 Air squats, 60 Sit-ups, 40 Push-ups, 20 Pull-ups"
    }
  ]);
  
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Workout of the Day</ThemedText>
      </View>
      
      <ThemedView style={styles.wodCard}>
        <ThemedText type="subtitle">{currentWod.title}</ThemedText>
        <ThemedText style={styles.wodDate}>{currentWod.date}</ThemedText>
        
        <View style={styles.wodTypeContainer}>
          <ThemedText style={styles.wodType}>{currentWod.type}</ThemedText>
          <ThemedText style={styles.wodTimeLimit}>{currentWod.timeLimit}</ThemedText>
        </View>
        
        <View style={styles.exercisesContainer}>
          <ThemedText style={styles.exercisesTitle}>Exercises:</ThemedText>
          {currentWod.exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseRow}>
              <ThemedText style={styles.exerciseName}>{exercise.name}</ThemedText>
              <ThemedText style={styles.exerciseDetails}>
                {exercise.reps} reps • {exercise.weight}
              </ThemedText>
            </View>
          ))}
        </View>
        
        <ThemedText style={styles.wodNotes}>{currentWod.notes}</ThemedText>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.startButton]}>
            <ThemedText style={styles.buttonText}>Start Workout</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.saveButton]}>
            <ThemedText style={styles.buttonText}>Save for Later</ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
      
      <ThemedView style={styles.pastWodsContainer}>
        <ThemedText type="subtitle">Previous Workouts</ThemedText>
        
        <FlatList
          data={pastWods}
          keyExtractor={item => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.pastWodItem}>
              <View style={styles.pastWodHeader}>
                <ThemedText style={styles.pastWodTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.pastWodDate}>{item.date}</ThemedText>
              </View>
              <ThemedText style={styles.pastWodType}>{item.type}</ThemedText>
              <ThemedText style={styles.pastWodDescription}>{item.description}</ThemedText>
            </TouchableOpacity>
          )}
        />
      </ThemedView>
    </ScrollView>
  );
};

// Main App Component with Tabs
const BoxBuddy = () => {
  const [activeTab, setActiveTab] = useState('home');
  
  // Render the active screen based on tab selection
  const renderScreen = () => {
    switch(activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'nutrition':
        return <NutritionScreen />;
      case 'wod':
        return <WodScreen />;
      default:
        return <HomeScreen />;
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Content Area */}
      <View style={styles.content}>
        {renderScreen()}
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
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'wod' && styles.activeTab]} 
          onPress={() => setActiveTab('wod')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'wod' && styles.activeTabText]}>WOD</ThemedText>
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
  // Food Scanner Styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  scannerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  scanButtonContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scanButton: {
    width: '80%',
  },
  scanningView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanner: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  scannerLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#8A2BE2',
    position: 'absolute',
    top: '50%',
    // Add animation in a real app
  },
  scanningText: {
    marginTop: 10,
    fontSize: 16,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  foodImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  foodImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodCalories: {
    fontSize: 14,
    color: '#757575',
  },
  addButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Tracked Foods Styles
  trackedFoodsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    maxHeight: 200,
  },
  trackedFoodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  trackedFoodName: {
    fontSize: 16,
  },
  trackedFoodCalories: {
    fontSize: 16,
    color: '#757575',
  },
  // WOD Screen Styles
  wodCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  wodDate: {
    color: '#757575',
    marginBottom: 12,
  },
  wodTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: '#e6f7ff',
    padding: 10,
    borderRadius: 6,
  },
  wodType: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
  wodTimeLimit: {
    color: '#0066cc',
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  exercisesTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  exerciseName: {
    flex: 1,
  },
  exerciseDetails: {
    color: '#757575',
  },
  wodNotes: {
    fontStyle: 'italic',
    marginBottom: 16,
    color: '#555555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  startButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#8A2BE2',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#757575',
  },
  pastWodsContainer: {
    padding: 16,
    marginBottom: 20,
  },
  pastWodItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  pastWodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  pastWodTitle: {
    fontWeight: 'bold',
  },
  pastWodDate: {
    color: '#757575',
    fontSize: 14,
  },
  pastWodType: {
    color: '#0066cc',
    marginBottom: 4,
  },
  pastWodDescription: {
    color: '#555555',
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