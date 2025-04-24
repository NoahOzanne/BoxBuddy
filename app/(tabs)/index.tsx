import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';

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

// Mock NUTTAB Database Service
const NuttabDatabase = {
  // Sample of the NUTTAB database with Australian foods
  foods: [
    {
      id: 'N01',
      name: 'Vegemite',
      brand: 'Kraft',
      category: 'Spreads',
      servingSize: '5g',
      nutrients: {
        energy: 443, // kJ per 100g
        protein: 25.3, // g per 100g
        fat: 0.9, // g per 100g
        saturatedFat: 0.2, // g per 100g
        carbs: 35.6, // g per 100g
        sugars: 1.5, // g per 100g
        sodium: 3450, // mg per 100g
        calcium: 25, // mg per 100g
        iron: 36.4 // mg per 100g
      }
    },
    {
      id: 'N02',
      name: 'Weet-Bix',
      brand: 'Sanitarium',
      category: 'Breakfast Cereals',
      servingSize: '30g (2 biscuits)',
      nutrients: {
        energy: 1510, // kJ per 100g
        protein: 12.0, // g per 100g
        fat: 1.4, // g per 100g
        saturatedFat: 0.3, // g per 100g
        carbs: 67.0, // g per 100g
        sugars: 3.3, // g per 100g
        sodium: 270, // mg per 100g
        calcium: 110, // mg per 100g
        iron: 12.0 // mg per 100g
      }
    },
    {
      id: 'N03',
      name: 'Kangaroo Steak',
      brand: 'Australian Game Meats',
      category: 'Meat',
      servingSize: '100g',
      nutrients: {
        energy: 480, // kJ per 100g
        protein: 22.0, // g per 100g
        fat: 1.5, // g per 100g
        saturatedFat: 0.4, // g per 100g
        carbs: 0, // g per 100g
        sugars: 0, // g per 100g
        sodium: 55, // mg per 100g
        calcium: 5, // mg per 100g
        iron: 3.2 // mg per 100g
      }
    },
    {
      id: 'N04',
      name: 'Tim Tam',
      brand: 'Arnott\'s',
      category: 'Biscuits',
      servingSize: '18g (1 biscuit)',
      nutrients: {
        energy: 2170, // kJ per 100g
        protein: 5.6, // g per 100g
        fat: 28.9, // g per 100g
        saturatedFat: 18.7, // g per 100g
        carbs: 61.2, // g per 100g
        sugars: 38.9, // g per 100g
        sodium: 170, // mg per 100g
        calcium: 84, // mg per 100g
        iron: 1.8 // mg per 100g
      }
    },
    {
      id: 'N05',
      name: 'Avocado',
      brand: 'Fresh',
      category: 'Fruits',
      servingSize: '50g (1/4 medium)',
      nutrients: {
        energy: 670, // kJ per 100g
        protein: 2.0, // g per 100g
        fat: 14.7, // g per 100g
        saturatedFat: 3.0, // g per 100g
        carbs: 1.8, // g per 100g
        sugars: 0.3, // g per 100g
        sodium: 8, // mg per 100g
        calcium: 12, // mg per 100g
        iron: 0.6 // mg per 100g
      }
    },
    {
      id: 'N06',
      name: 'Lamington',
      brand: 'Bakery',
      category: 'Cakes',
      servingSize: '60g (1 piece)',
      nutrients: {
        energy: 1420, // kJ per 100g
        protein: 5.5, // g per 100g
        fat: 12.8, // g per 100g
        saturatedFat: 8.2, // g per 100g
        carbs: 56.3, // g per 100g
        sugars: 32.1, // g per 100g
        sodium: 230, // mg per 100g
        calcium: 45, // mg per 100g
        iron: 1.2 // mg per 100g
      }
    },
    {
      id: 'N07',
      name: 'Barramundi Fillet',
      brand: 'Fresh',
      category: 'Seafood',
      servingSize: '100g',
      nutrients: {
        energy: 410, // kJ per 100g
        protein: 19.2, // g per 100g
        fat: 1.9, // g per 100g
        saturatedFat: 0.5, // g per 100g
        carbs: 0, // g per 100g
        sugars: 0, // g per 100g
        sodium: 68, // mg per 100g
        calcium: 20, // mg per 100g
        iron: 0.3 // mg per 100g
      }
    },
    {
      id: 'N08',
      name: 'ANZAC Biscuit',
      brand: 'Bakery',
      category: 'Biscuits',
      servingSize: '15g (1 biscuit)',
      nutrients: {
        energy: 1950, // kJ per 100g
        protein: 5.0, // g per 100g
        fat: 22.0, // g per 100g
        saturatedFat: 14.0, // g per 100g
        carbs: 65.0, // g per 100g
        sugars: 32.0, // g per 100g
        sodium: 290, // mg per 100g
        calcium: 30, // mg per 100g
        iron: 1.5 // mg per 100g
      }
    }
  ],
  
  // Search function to find foods in the database
  search: function(query) {
    if (!query || query.trim() === '') {
      return this.foods;
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    return this.foods.filter(food => 
      food.name.toLowerCase().includes(normalizedQuery) ||
      food.brand.toLowerCase().includes(normalizedQuery) ||
      food.category.toLowerCase().includes(normalizedQuery)
    );
  },
  
  // Get a food by ID
  getById: function(id) {
    return this.foods.find(food => food.id === id);
  },
  
  // Calculate calories from kJ
  kJToCalories: function(kJ) {
    return Math.round(kJ / 4.184); // Standard conversion factor
  },
  
  // Calculate nutritional values for a specific serving size
  calculateNutrition: function(food, servingGrams) {
    const factor = servingGrams / 100; // NUTTAB values are per 100g
    const nutrients = food.nutrients;
    
    return {
      calories: this.kJToCalories(nutrients.energy) * factor,
      protein: nutrients.protein * factor,
      fat: nutrients.fat * factor,
      saturatedFat: nutrients.saturatedFat * factor,
      carbs: nutrients.carbs * factor,
      sugars: nutrients.sugars * factor,
      sodium: nutrients.sodium * factor,
      calcium: nutrients.calcium * factor,
      iron: nutrients.iron * factor
    };
  }
};

// Home Screen Component
const HomeScreen = () => {
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">BoxBuddy</ThemedText>
      </View>
      
      <ThemedView style={styles.welcomeContainer}>
        <ThemedText type="subtitle">Welcome to BoxBuddy!</ThemedText>
        <ThemedText>Your all-in-one fitness companion for workouts, nutrition tracking, and community.</ThemedText>
      </ThemedView>

      <ThemedView style={styles.quickAccessContainer}>
        <ThemedText type="subtitle">Quick Access</ThemedText>
        
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={styles.quickAccessIcon}>
            <ThemedText style={styles.iconText}>🏋️</ThemedText>
          </View>
          <ThemedText>Today's WOD</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={styles.quickAccessIcon}>
            <ThemedText style={styles.iconText}>🍎</ThemedText>
          </View>
          <ThemedText>Log Meal</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={styles.quickAccessIcon}>
            <ThemedText style={styles.iconText}>👥</ThemedText>
          </View>
          <ThemedText>Community Feed</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.statsContainer}>
        <ThemedText type="subtitle">Your Stats</ThemedText>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>5</ThemedText>
            <ThemedText style={styles.statLabel}>Workouts</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>1,250</ThemedText>
            <ThemedText style={styles.statLabel}>Calories</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statValue}>3</ThemedText>
            <ThemedText style={styles.statLabel}>Friends</ThemedText>
          </View>
        </View>
      </ThemedView>
    </View>
  );
};

// Enhanced Food Scanner Component with NUTTAB integration
const FoodScanner = ({ visible, onClose, onFoodScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingSize, setServingSize] = useState('');
  
  // Search NUTTAB database when query changes
  useEffect(() => {
    // Simulate API call delay
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const results = NuttabDatabase.search(searchQuery);
      setSearchResults(results);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Handle food selection
  const handleFoodSelect = (food) => {
    setSelectedFood(food);
    // Extract numeric value from serving size (e.g., "30g (2 biscuits)" -> "30")
    const match = food.servingSize.match(/(\d+)g/);
    if (match && match[1]) {
      setServingSize(match[1]);
    } else {
      setServingSize('100'); // Default to 100g if no serving size is specified
    }
  };
  
  // Handle adding the selected food to the tracked foods
  const handleAddFood = () => {
    if (selectedFood && servingSize) {
      const servingSizeNum = parseInt(servingSize, 10);
      if (isNaN(servingSizeNum) || servingSizeNum <= 0) {
        // Handle invalid serving size
        return;
      }
      
      const nutritionInfo = NuttabDatabase.calculateNutrition(selectedFood, servingSizeNum);
      
      const foodToAdd = {
        id: selectedFood.id,
        name: selectedFood.name,
        brand: selectedFood.brand,
        servingSize: `${servingSize}g`,
        calories: Math.round(nutritionInfo.calories),
        protein: nutritionInfo.protein.toFixed(1),
        carbs: nutritionInfo.carbs.toFixed(1),
        fat: nutritionInfo.fat.toFixed(1),
        details: nutritionInfo
      };
      
      onFoodScanned(foodToAdd);
      setSelectedFood(null);
      setServingSize('');
      onClose();
    }
  };
  
  // Simulate scanning process
  const startScanning = () => {
    setScanning(true);
    
    // Simulate a scan completion after 2 seconds
    setTimeout(() => {
      setScanning(false);
      // Randomly select a food from the database to simulate a scan result
      const randomFood = NuttabDatabase.foods[Math.floor(Math.random() * NuttabDatabase.foods.length)];
      handleFoodSelect(randomFood);
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
          <ThemedText type="subtitle">NUTTAB Food Database</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText>✕</ThemedText>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Australian foods..."
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
              {scanning ? 'Scanning...' : 'Scan Barcode'}
            </ThemedText>
          </TouchableOpacity>
        </View>
        
        {scanning ? (
          <View style={styles.scanningView}>
            <View style={styles.scanner}>
              <View style={styles.scannerLine} />
            </View>
            <ThemedText style={styles.scanningText}>Scanning food barcode...</ThemedText>
          </View>
        ) : selectedFood ? (
          <View style={styles.foodDetailContainer}>
            <ThemedText type="subtitle">{selectedFood.name}</ThemedText>
            <ThemedText style={styles.foodDetailBrand}>{selectedFood.brand}</ThemedText>
            <ThemedText style={styles.foodDetailCategory}>Category: {selectedFood.category}</ThemedText>
            
            <View style={styles.nutritionTable}>
              <View style={styles.nutritionTableHeader}>
                <ThemedText style={styles.nutritionTableTitle}>Nutrition Information</ThemedText>
                <ThemedText style={styles.nutritionTableSubtitle}>Per 100g</ThemedText>
              </View>
              
              <View style={styles.nutritionRow}>
                <ThemedText>Energy</ThemedText>
                <ThemedText>{selectedFood.nutrients.energy} kJ ({NuttabDatabase.kJToCalories(selectedFood.nutrients.energy)} Cal)</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>Protein</ThemedText>
                <ThemedText>{selectedFood.nutrients.protein.toFixed(1)}g</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>Fat, total</ThemedText>
                <ThemedText>{selectedFood.nutrients.fat.toFixed(1)}g</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>— saturated</ThemedText>
                <ThemedText>{selectedFood.nutrients.saturatedFat.toFixed(1)}g</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>Carbohydrate</ThemedText>
                <ThemedText>{selectedFood.nutrients.carbs.toFixed(1)}g</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>— sugars</ThemedText>
                <ThemedText>{selectedFood.nutrients.sugars.toFixed(1)}g</ThemedText>
              </View>
              <View style={styles.nutritionRow}>
                <ThemedText>Sodium</ThemedText>
                <ThemedText>{selectedFood.nutrients.sodium}mg</ThemedText>
              </View>
            </View>
            
            <View style={styles.servingSizeContainer}>
              <ThemedText style={styles.servingSizeLabel}>Serving Size (g):</ThemedText>
              <TextInput
                style={styles.servingSizeInput}
                keyboardType="numeric"
                value={servingSize}
                onChangeText={setServingSize}
                placeholder="Enter grams"
              />
            </View>
            
            <TouchableOpacity 
              style={styles.button}
              onPress={handleAddFood}
            >
              <ThemedText style={styles.buttonText}>Add to Diary</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#8A2BE2" />
                <ThemedText style={styles.loadingText}>Searching NUTTAB database...</ThemedText>
              </View>
            ) : (
              <FlatList
                data={searchResults}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.foodItem}
                    onPress={() => handleFoodSelect(item)}
                  >
                    <View style={styles.foodInfo}>
                      <ThemedText style={styles.foodName}>{item.name}</ThemedText>
                      <ThemedText style={styles.foodBrand}>{item.brand}</ThemedText>
                      <ThemedText style={styles.foodCalories}>
                        {NuttabDatabase.kJToCalories(item.nutrients.energy)} Cal per 100g
                      </ThemedText>
                    </View>
                    <TouchableOpacity 
                      style={styles.viewButton}
                      onPress={() => handleFoodSelect(item)}
                    >
                      <ThemedText style={styles.viewButtonText}>View</ThemedText>
                    </TouchableOpacity>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyResultsContainer}>
                    <ThemedText style={styles.emptyResultsText}>
                      No foods found. Try a different search term.
                    </ThemedText>
                  </View>
                }
              />
            )}
          </>
        )}
      </View>
    </Modal>
  );
};

// Nutrition Screen Component with NUTTAB integration
const NutritionScreen = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [trackedFoods, setTrackedFoods] = useState([]);
  const [dailyTotals, setDailyTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    saturatedFat: 0,
    sugars: 0,
    sodium: 0
  });
  
  // Update daily totals whenever tracked foods change
  useEffect(() => {
    const totals = trackedFoods.reduce((acc, food) => {
      return {
        calories: acc.calories + food.calories,
        protein: acc.protein + parseFloat(food.protein || 0),
        carbs: acc.carbs + parseFloat(food.carbs || 0),
        fat: acc.fat + parseFloat(food.fat || 0),
        saturatedFat: acc.saturatedFat + parseFloat(food.details?.saturatedFat || 0),
        sugars: acc.sugars + parseFloat(food.details?.sugars || 0),
        sodium: acc.sodium + parseFloat(food.details?.sodium || 0)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, saturatedFat: 0, sugars: 0, sodium: 0 });
    
    setDailyTotals(totals);
  }, [trackedFoods]);
  
  // Handle adding a scanned food to the tracked foods list
  const handleFoodScanned = (food) => {
    setTrackedFoods([...trackedFoods, food]);
  };
  
  // Remove a food from the tracked foods list
  const handleRemoveFood = (index) => {
    const updatedFoods = [...trackedFoods];
    updatedFoods.splice(index, 1);
    setTrackedFoods(updatedFoods);
  };
  
  return (
    <View style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Nutrition</ThemedText>
      </View>
      
      <ThemedView style={styles.nutritionContainer}>
        <ThemedText type="subtitle">NUTTAB Nutrition Tracker</ThemedText>
        
        <ThemedView style={styles.nutritionCard}>
          <ThemedText style={styles.nutritionTitle}>Daily Progress</ThemedText>
          <View style={styles.nutritionRow}>
            <ThemedText>Calories:</ThemedText>
            <ThemedText>{Math.round(dailyTotals.calories)} / 2000 Cal</ThemedText>
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
          <View style={styles.nutritionRow}>
            <ThemedText>Saturated Fat:</ThemedText>
            <ThemedText>{dailyTotals.saturatedFat.toFixed(1)} / 20g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Sugars:</ThemedText>
            <ThemedText>{dailyTotals.sugars.toFixed(1)} / 50g</ThemedText>
          </View>
          <View style={styles.nutritionRow}>
            <ThemedText>Sodium:</ThemedText>
            <ThemedText>{Math.round(dailyTotals.sodium)} / 2300mg</ThemedText>
          </View>
        </ThemedView>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setShowScanner(true)}
        >
          <ThemedText style={styles.buttonText}>Add Food from NUTTAB</ThemedText>
        </TouchableOpacity>
        
        {trackedFoods.length > 0 && (
          <ThemedView style={styles.trackedFoodsContainer}>
            <ThemedText style={styles.nutritionTitle}>Today's Foods</ThemedText>
            <FlatList
              data={trackedFoods}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item, index }) => (
                <View style={styles.trackedFoodItem}>
                  <View style={styles.trackedFoodInfo}>
                    <ThemedText style={styles.trackedFoodName}>{item.name}</ThemedText>
                    <ThemedText style={styles.trackedFoodBrand}>{item.brand}</ThemedText>
                    <ThemedText style={styles.trackedFoodServing}>{item.servingSize}</ThemedText>
                  </View>
                  <View style={styles.trackedFoodNutrition}>
                    <ThemedText style={styles.trackedFoodCalories}>{item.calories} Cal</ThemedText>
                    <ThemedText style={styles.trackedFoodMacros}>
                      P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                    </ThemedText>
                  </View>
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemoveFood(index)}
                  >
                    <ThemedText style={styles.removeButtonText}>✕</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            />
          </ThemedView>
        )}
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

// Social Screen Component
const SocialScreen = () => {
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState('');
  const [activePostId, setActivePostId] = useState(null);
  
  // Mock social feed data
  const socialFeed = [
    {
      id: '1',
      user: {
        name: 'Sarah Johnson',
        avatar: 'https://example.com/avatar1.jpg',
        gym: 'CrossFit Elite'
      },
      time: '2 hours ago',
      content: 'Just crushed today\'s WOD! 5 rounds in 18:45 💪',
      workout: {
        type: 'AMRAP',
        description: '20 min AMRAP: 15 Box Jumps, 20 KB Swings, 15 Wall Balls, 10 Burpees'
      },
      likes: 24,
      commentCount: 5
    },
    {
      id: '2',
      user: {
        name: 'Mike Chen',
        avatar: 'https://example.com/avatar2.jpg',
        gym: 'Iron Fitness'
      },
      time: '5 hours ago',
      content: 'New PR on back squat today! 315lbs x 3 reps 🏋️‍♂️',
      workout: {
        type: 'Strength',
        description: '5x3 Back Squat, building to heavy set of 3'
      },
      likes: 42,
      commentCount: 8
    },
    {
      id: '3',
      user: {
        name: 'Emma Wilson',
        avatar: 'https://example.com/avatar3.jpg',
        gym: 'CrossFit Elite'
      },
      time: 'Yesterday',
      content: 'Meal prep Sunday! Prepped all my lunches for the week. Staying on track with nutrition goals 🥗',
      nutrition: {
        meals: [
          { name: 'Chicken & Veggie Stir Fry', calories: 420 },
          { name: 'Greek Yogurt with Berries', calories: 180 },
          { name: 'Protein Smoothie', calories: 310 }
        ]
      },
      likes: 18,
      commentCount: 3
    }
  ];
  
  // Initialize comments for each post
  useEffect(() => {
    const initialComments = {};
    socialFeed.forEach(post => {
      initialComments[post.id] = [
        { id: `${post.id}-1`, user: 'Alex', text: 'Great job! Keep it up! 👏', time: '1h ago' },
        { id: `${post.id}-2`, user: 'Taylor', text: 'Impressive work!', time: '30m ago' }
      ];
    });
    setComments(initialComments);
  }, []);
  
  // Handle adding a new comment
  const handleAddComment = () => {
    if (commentText.trim() && activePostId) {
      const newComment = {
        id: `${activePostId}-${comments[activePostId].length + 1}`,
        user: 'You',
        text: commentText,
        time: 'Just now'
      };
      
      setComments({
        ...comments,
        [activePostId]: [...comments[activePostId], newComment]
      });
      
      setCommentText('');
    }
  };
  
  // Toggle comment section for a post
  const toggleComments = (postId) => {
    setActivePostId(activePostId === postId ? null : postId);
    setCommentText('');
  };
  
  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.header}>
        <ThemedText type="title">Community</ThemedText>
      </View>
      
      <View style={styles.socialFilters}>
        <TouchableOpacity style={[styles.filterButton, styles.activeFilter]}>
          <ThemedText style={styles.activeFilterText}>All</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <ThemedText>Friends</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <ThemedText>My Gym</ThemedText>
        </TouchableOpacity>
      </View>
      
      {socialFeed.map(post => (
        <ThemedView key={post.id} style={styles.socialPost}>
          <View style={styles.postHeader}>
            <View style={styles.userAvatarPlaceholder}>
              <ThemedText>👤</ThemedText>
            </View>
            <View style={styles.postHeaderInfo}>
              <ThemedText style={styles.userName}>{post.user.name}</ThemedText>
              <View style={styles.postSubHeader}>
                <ThemedText style={styles.userGym}>{post.user.gym}</ThemedText>
                <ThemedText style={styles.postTime}> • {post.time}</ThemedText>
              </View>
            </View>
          </View>
          
          <ThemedText style={styles.postContent}>{post.content}</ThemedText>
          
          {post.workout && (
            <View style={styles.workoutCard}>
              <View style={styles.workoutTypeTag}>
                <ThemedText style={styles.workoutTypeText}>{post.workout.type}</ThemedText>
              </View>
              <ThemedText style={styles.workoutDescription}>{post.workout.description}</ThemedText>
            </View>
          )}
          
          {post.nutrition && (
            <View style={styles.nutritionCard}>
              <View style={styles.nutritionTypeTag}>
                <ThemedText style={styles.nutritionTypeText}>Nutrition</ThemedText>
              </View>
              {post.nutrition.meals.map((meal, index) => (
                <View key={index} style={styles.mealRow}>
                  <ThemedText style={styles.mealName}>{meal.name}</ThemedText>
                  <ThemedText style={styles.mealCalories}>{meal.calories} Cal</ThemedText>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionText}>👍 {post.likes}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleComments(post.id)}
            >
              <ThemedText style={styles.actionText}>
                💬 {comments[post.id]?.length || 0}
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <ThemedText style={styles.actionText}>🔄 Share</ThemedText>
            </TouchableOpacity>
          </View>
          
          {activePostId === post.id && (
            <View style={styles.commentsSection}>
              <View style={styles.commentsList}>
                {comments[post.id]?.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <ThemedText style={styles.commentUser}>{comment.user}</ThemedText>
                    <ThemedText style={styles.commentText}>{comment.text}</ThemedText>
                    <ThemedText style={styles.commentTime}>{comment.time}</ThemedText>
                  </View>
                ))}
              </View>
              
              <View style={styles.addCommentContainer}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Add a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                />
                <TouchableOpacity 
                  style={[styles.button, styles.commentButton]}
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <ThemedText style={styles.buttonText}>Post</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ThemedView>
      ))}
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
      case 'social':
        return <SocialScreen />;
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
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'social' && styles.activeTab]} 
          onPress={() => setActiveTab('social')}
        >
          <ThemedText style={[styles.tabText, activeTab === 'social' && styles.activeTabText]}>Social</ThemedText>
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
  // Home Screen Styles
  welcomeContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 20,
  },
  quickAccessContainer: {
    marginBottom: 20,
  },
  quickAccessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginTop: 8,
  },
  quickAccessIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 20,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8A2BE2',
  },
  statLabel: {
    fontSize: 14,
    color: '#757575',
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
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodBrand: {
    fontSize: 14,
    color: '#757575',
  },
  foodCalories: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  viewButton: {
    backgroundColor: '#8A2BE2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  viewButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Food Detail Styles
  foodDetailContainer: {
    padding: 16,
  },
  foodDetailBrand: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 8,
  },
  foodDetailCategory: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  nutritionTable: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 20,
  },
  nutritionTableHeader: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  nutritionTableTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  nutritionTableSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  servingSizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  servingSizeLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  servingSizeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  // Loading Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#757575',
  },
  emptyResultsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  // Tracked Foods Styles
  trackedFoodsContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginTop: 20,
    maxHeight: 300,
  },
  trackedFoodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  trackedFoodInfo: {
    flex: 1,
  },
  trackedFoodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackedFoodBrand: {
    fontSize: 14,
    color: '#757575',
  },
  trackedFoodServing: {
    fontSize: 14,
    color: '#757575',
  },
  trackedFoodNutrition: {
    marginRight: 12,
    alignItems: 'flex-end',
  },
  trackedFoodCalories: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  trackedFoodMacros: {
    fontSize: 12,
    color: '#757575',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b6b',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  // Social Screen Styles
  socialFilters: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#8A2BE2',
  },
  activeFilterText: {
    color: 'white',
    fontWeight: 'bold',
  },
  socialPost: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postHeaderInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userGym: {
    fontSize: 14,
    color: '#757575',
  },
  postTime: {
    fontSize: 14,
    color: '#757575',
  },
  postContent: {
    marginBottom: 12,
    fontSize: 16,
  },
  workoutCard: {
    backgroundColor: '#e6f7ff',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  workoutTypeTag: {
    backgroundColor: '#0066cc',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  workoutTypeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  workoutDescription: {
    color: '#333333',
  },
  nutritionCard: {
    backgroundColor: '#f0fff4',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
  nutritionTypeTag: {
    backgroundColor: '#38a169',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  nutritionTypeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  mealRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  mealName: {
    flex: 1,
  },
  mealCalories: {
    color: '#38a169',
    fontWeight: 'bold',
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    color: '#757575',
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  commentsList: {
    marginBottom: 12,
  },
  commentItem: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentUser: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 4,
  },
  commentTime: {
    fontSize: 12,
    color: '#757575',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  commentButton: {
    marginTop: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
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