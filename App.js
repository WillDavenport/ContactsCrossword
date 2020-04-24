import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import { generateCrossword } from './services/generateCrossword';
import CrosswordView from './components/crosswordView';
import * as Contacts from 'expo-contacts';
import { trimContactsData } from './services/trimContacts';
import { createGameWords } from './services/createGameWords';
import { AsyncStorage } from 'react-native';
import * as Analytics from 'expo-firebase-analytics'; 
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import InterstitialView from './components/interstitialView';
import * as StoreReview from 'expo-store-review';
import * as Device from 'expo-device';

Analytics.logEvent('share', {
  contentType: 'text', 
  itemId: 'Expo rocks!', 
  method: 'facebook'
});

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

const window = Dimensions.get("window");

class App extends Component {
  state = { 
    haveGrid: false,
    contacts: [],
    grid: [],
    gridWords: [],
    scores: [],
    contactsPermissionsDenied: false,
    loadInterstitialFlag: false,
    isHighScore: false,
    timer: 0,
    isTimerOn: true
  }

  componentDidMount() {
    console.log('Device: ',Device.brand)
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
    this._interval = setInterval(() => {
      if (this.state.isTimerOn) {
        this.setState({timer: this.state.timer+1});
      }

    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this._interval);
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
    if (window.width > 750) { // iPad width
      this.generateGame(this.state.contacts, 12,16);
    } else {
      this.generateGame(this.state.contacts, 10,10);
    }

    // ask for a review after the 5th game
    if (this.state.scores.length === 5){
      StoreReview.requestReview();
      this.setState({timer: 0, isTimerOn: false})
    } else {
      // Display an interstitial
      this.setState({loadInterstitialFlag: !this.state.loadInterstitialFlag, timer: 0})
    }
  }
  
  addScore = (score) => {
    (async () => {
      try {
        let scoresString = await AsyncStorage.getItem('scores');
        var scores;
        if (scoresString !== null) {
          // We have data!!
          scores = JSON.parse(scoresString);

          scores.push(score);
          scores.sort((a, b) => b - a); // sort scores descending
        } else {
          scores = [];
          scores.push(score);
        }
        this.setState({
          scores,
          isHighScore: score == scores[0],
          isTimerOn: false
        });
        try { // put new scores in storage
          await AsyncStorage.setItem('scores', JSON.stringify(scores));
        } catch (error) {
          // Error saving data
          console.log(error)
        }
      } catch (error) {
        // Error retrieving data
        console.log(error)
      }
    })();
    /*let scoresList = this.state.scores;
    scoresList.push(score);
    scoresList.sort((a, b) => b - a); // sort scores descending
    this.setState({scores: scoresList});*/
  }

  interstitialDidClose = () => {
    this.setState({timer: 0, isTimerOn: true});
  }

  render() { 
    return ( 
      <View style={styles.container}>
        <InterstitialView 
          loadInterstitialFlag={this.state.loadInterstitialFlag}
          interstitialDidClose={this.interstitialDidClose}
        />
        {this.state.haveGrid ? (
          <ActionSheetProvider>
            <CrosswordView 
              grid={this.state.grid}
              words={this.state.gridWords}
              newGamePressed={this.newGame}
              scores={this.state.scores}
              addScore={this.addScore}
              isHighScore={this.state.isHighScore}
              timer={this.state.timer}
              turnOnTimer={() => this.setState({isTimerOn: true})}
            />
          </ActionSheetProvider>
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
