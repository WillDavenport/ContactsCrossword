import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';
import { generateCrossword } from './services/generateCrossword';
import CrosswordView from './components/crosswordView';
import * as Contacts from 'expo-contacts';
import { trimContactsData } from './services/trimContacts';
import { createGameWords } from './services/createGameWords';

export default function App() {
  const [haveGrid, setHaveGrid] = React.useState(false); 
  const [contacts, setContacts] = React.useState([]);
  const [grid, setGrid] = React.useState([]);
  const [gridWords, setGridWords] = React.useState([]);
  const [scores, setScores] = React.useState([]);

  const generateCrosswordPressed = () => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          let formattedContacts = trimContactsData(data);
          setContacts(formattedContacts);
          
          generateGame(formattedContacts, 10, 10);
        }
      }
    })();
  }

  const generateGame = ( formattedContacts, gridRows, gridColumns) => {
    let words = createGameWords(formattedContacts, gridRows, gridColumns);

    generatedCrossword = generateCrossword(words, gridRows, gridColumns);
    setGrid(generatedCrossword[0]);
    setGridWords(generatedCrossword[1]);
    setHaveGrid(true);

  }

  const addScore = (score) => {
    let scoresList = scores;
    scoresList.push(score);
    scoresList.sort((a, b) => b - a); // sort scores descending
    setScores(scoresList);
  }
  
  return (
    <View style={styles.container}>
      {haveGrid ? (
        <CrosswordView 
          grid={grid}
          words={gridWords}
          newGamePressed={() => generateGame(contacts, 10,10)}
          scores={scores}
          addScore={addScore}
        />
      ) : (
        <Button 
          title="Generate Crossword" 
          onPress={generateCrosswordPressed}
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
