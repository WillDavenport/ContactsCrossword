import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Grid from './grid'

const CrosswordView = (props) => {
  const [isWordFocused, setIsWordFocused] = React.useState(false);
  const [currentWordIndex, setCurrentWordIndex] = React.useState('');
  
  return (
    <View style={styles.container}>
        <View style={styles.hintBar} >
            <Text style={styles.hint} >{props.words[currentWordIndex]?.hint}</Text>
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
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hintBar: {
      flex: 1,
      height: 40,
      width: '100%',
      backgroundColor: 'lightblue',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
  },
  hint: {
      //position: 'absolute',
      fontSize: 24,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center'
  }
});
