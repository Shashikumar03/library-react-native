import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CustomRadioButton = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={styles.radioButtonContainer}
          onPress={() => onSelect(option.value)}
        >
          <View
            style={[
              styles.radioButton,
              selectedValue === option.value && styles.radioButtonSelected,
            ]}
          >
            {selectedValue === option.value && <View style={styles.radioButtonDot} />}
          </View>
          <Text style={styles.radioButtonLabel}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioButtonSelected: {
    borderColor: '#4CAF50', // Green color for selected radio button
  },
  radioButtonDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50', // Green dot color
  },
  radioButtonLabel: {
    fontSize: 16,
    color: '#333',
  },
});

export default CustomRadioButton;
