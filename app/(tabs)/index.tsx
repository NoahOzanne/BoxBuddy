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

const BoxBuddy = () => {
  const [counter, setCounter] = useState(0);

  const incrementCounter = () => {
    setCounter(counter + 2); // Currently increases by 2
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
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
