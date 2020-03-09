import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './components/letterTile'
import { generateCrossword } from './services/generateCrossword';

export default function App() {
  const [value, onChangeText] = React.useState('');
  const [isWordFocused, setIsWordFocused] = React.useState(false);

  const word = ['S','M','I','T','H'];

  const generateCrosswordPressed = () => {
    generateCrossword ([
      {
        text: ['S','M','I','T','H'],
        hint: 'John'
      },
      {
        text: ['D','A','V','E','N','P','O','R','T'],
        hint: 'William'
      }
    ])
  }
  
  return (
    <View style={styles.container}>
      <Button 
        title="Generate Crossword" 
        onPress={generateCrosswordPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
