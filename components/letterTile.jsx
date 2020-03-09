import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, ShadowPropTypesIOS } from 'react-native';

const LetterTile = (props) => {
  const [value, onChangeText] = React.useState('');
  return (
    <TextInput
        style={[styles.letterTile, props.isFocused && styles.letterTileIsFocused]}
        onChangeText={text => onChangeText(text)}
        value={value}
        maxLength={1}
        onFocus={() => props.letterFocus(true)}
    />
  );
}
export default LetterTile;

const styles = StyleSheet.create({
  letterTile: {
    height: 60, 
    width: 60, 
    borderColor: 'gray', 
    borderWidth: 1, 
    fontSize: 26, 
    textAlign: "center",
  },
  letterTileIsFocused: {
    backgroundColor: '#f0ffff',
  }
});
