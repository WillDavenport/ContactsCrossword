import React, {Component} from 'react';
import { StyleSheet, Text, View, Button, TextInput, Image } from 'react-native';
import { generateCrossword } from './services/generateCrossword';
import CrosswordView from './components/crosswordView';
import * as Contacts from 'expo-contacts';
import { trimContactsData } from './services/trimContacts';
import { createGameWords } from './services/createGameWords';
import {
  AdMobInterstitial,
} from 'expo-ads-admob';

AdMobInterstitial.setAdUnitID('ca-app-pub-3940256099942544/4411468910'); // test ad, real ad unit id ca-app-pub-6643827733570457/5527903824

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
    // load interstitial ad
    (async () => {
      //AdMobInterstitial.setTestDeviceID('EMULATOR');
      await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
    })();
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

  newGame = () => {
    this.generateGame(this.state.contacts, 10,10);

    // Display an interstitial
    this.openInterstitial();
  }

  openInterstitial = async () => {
    try {
      await AdMobInterstitial.showAdAsync();
    } catch (error) {
      console.error(error)
    } finally {
      try {
        // load next ad
        await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
      } catch (error) {
        console.error(error)
      }
    }
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
            newGamePressed={this.newGame}
            scores={this.state.scores}
            addScore={this.addScore}
          />
        ) : (
          <View>
            {this.state.contactsPermissionsDenied && (
              <View style={styles.container}>
                <Text style={styles.askText}>
                  Contacts Crossword Requires Access to your contacts in order to create your crosswords. <Text style={styles.askTextBold}>Please go to Contacts Crossword in your settings app</Text> and allow contacts access.
                </Text>
                <Image style={styles.settingsImage} source={require('./assets/settingsAppIcon.png')} />
                <Text style={styles.directionsText}>
                  Settings > Contacts Crossword > Allow Contacts
                </Text>
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
    height: 150,
    width: 150
  },
  askText: {
    fontSize: 22,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    textAlign: 'center'
  },
  askTextBold: {
    fontSize: 22,
    fontWeight: 'bold',
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
