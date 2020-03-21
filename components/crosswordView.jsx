import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Grid from './grid'

const CrosswordView = (props) => {
  const [isWordFocused, setIsWordFocused] = React.useState(false);
  const [currentWordIndex, setCurrentWordIndex] = React.useState('');
  
  return (
    <View style={styles.container}>
        <View style={styles.hintBar} >
            <Button 
                style={styles.newGameButton}
                title="New Game" 
                onPress={props.newGamePressed}
            />
        </View>
      <Grid
        grid={props.grid}
        words={props.words}
        setCurrentWordIndex={setCurrentWordIndex}
      />
    </View>
  );
}
export default CrosswordView;

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBar: {
      flex: 1,
      height: 10,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
  },
  newGameButton: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  }
});
