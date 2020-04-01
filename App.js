import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { generateCrossword } from './services/generateCrossword';
import CrosswordView from './components/crosswordView';
import * as Contacts from 'expo-contacts';
import { trimContactsData } from './services/trimContacts';
import { createGameWords } from './services/createGameWords';

class App extends Component {
  state = { 
    haveGrid: false,
    contacts: [],
    grid: [],
    gridWords: [],
    scores: [],
    contactsPermissionsDenied: false
  }

  componentDidMount() {
    if(!this.state.contacts[0] && !this.state.haveGrid) {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.Emails],
          });
  
          if (data.length > 0) {
            let formattedContacts = trimContactsData(data);
            this.setState({contacts: formattedContacts});
            
            this.generateGame(formattedContacts, 10, 10);
          }
        }
        if (status === 'denied') {
          this.setState({contactsPermissionsDenied: true})
        }
      })();
    }
  }

  getContacts = () => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === 'granted') {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          let formattedContacts = trimContactsData(data);
          this.setState({contacts: formattedContacts});
          
          this.generateGame(formattedContacts, 10, 10);
        }
        this.setState({contactsPermissionsDenied: false})
      }
      if (status === 'denied') {
        this.setState({contactsPermissionsDenied: true})
      }
    })();
  }

  generateGame = ( formattedContacts, gridRows, gridColumns) => {
    let words = createGameWords(formattedContacts, gridRows, gridColumns);

    generatedCrossword = generateCrossword(words, gridRows, gridColumns);
    this.setState({grid: generatedCrossword[0]});
    this.setState({gridWords: generatedCrossword[1]});
    this.setState({haveGrid: true});
  }
  
  addScore = (score) => {
    let scoresList = this.state.scores;
    scoresList.push(score);
    scoresList.sort((a, b) => b - a); // sort scores descending
    this.setState({scores: scoresList});
  }

  render() { 
    return ( 
      <View style={styles.container}>
        {this.state.haveGrid ? (
          <CrosswordView 
            grid={this.state.grid}
            words={this.state.gridWords}
            newGamePressed={() => this.generateGame(this.state.contacts, 10,10)}
            scores={this.state.scores}
            addScore={this.addScore}
          />
        ) : (
          <View>
            {this.state.contactsPermissionsDenied && (
              <View style={styles.container}>
                <Text style={styles.askText}>
                  Contacts Crossword Requires Access to your contacts in order to create your crosswords. Please go to your settings app and allow contacts access.
                </Text>
                <Image style={styles.settingsImage} source={require('./assets/settingsAppIcon.png')} />
                <Text style={styles.directionsText}>
                  Settings > Contacts Crossword > Allow Contacts
                </Text>
                <Button 
                  title="OK" 
                  onPress={this.getContacts}
                />
              </View>
            )}
          </View>
        )}
      </View>
     );
  }
}
 
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsImage: {
    height: 200,
    width: 200
  },
  askText: {
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    textAlign: 'center'
  },
  directionsText: {
    fontSize: 22,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  }
});
