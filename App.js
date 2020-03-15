import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import LetterTile from './components/letterTile'
import { generateCrossword } from './services/generateCrossword';
import CrosswordView from './components/crosswordView';
import * as Contacts from 'expo-contacts';
import { trimContactsData } from './services/trimContacts';
import { createGameWords } from './services/createGameWords';

export default function App() {
  const [haveGrid, setHaveGrid] = React.useState(false); 
  const [grid, setGrid] = React.useState([]);
  const [gridWords, setGridWords] = React.useState([]); 

  const generateCrosswordPressed = () => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          let formattedContacts = trimContactsData(data);
          console.log('FormattedContacts length: ',formattedContacts.length)
          
          generateGame(formattedContacts, 10, 10);
        }
      }
    })();
  }

  const generateGame = (formattedContacts, gridRows, gridColumns) => {
    let words = createGameWords(formattedContacts, gridRows, gridColumns);
    
    console.log('words to add length: ',words.length)
    setGrid(generateCrossword(words, gridRows, gridColumns));
    setGridWords(words);
    setHaveGrid(true);

  }
  
  return (
    <View style={styles.container}>
      <Button 
        title="Generate Crossword" 
        onPress={generateCrosswordPressed}
      />
      {haveGrid && (
        <CrosswordView 
          grid={grid}
          words={gridWords}
        />
      )}
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
