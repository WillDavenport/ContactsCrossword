import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './letterTile'
import Grid from './grid'

export default function CrosswordView() {
  const [value, onChangeText] = React.useState('');
  const [isWordFocused, setIsWordFocused] = React.useState(false);

  const word = ['S','M','I','T','H'];
  
  return (
    <View style={styles.container}>
      <Grid></Grid>
      <Text>John</Text>
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
