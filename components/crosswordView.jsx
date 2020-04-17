import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Button, 
    TouchableHighlight, 
    Modal, 
    Alert,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Grid from './grid';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
const window = Dimensions.get("window");

const CrosswordView = (props) => {
  const didMountRef = React.useRef(false);
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [completedScore, setCompletedScore] = React.useState(0);
  const [openActionSheet, setOpenActionSheet] = React.useState(false);
  const [onlyDismissedModal, setOnlyDismissedModal] = React.useState(false);

  const gameOver = (lettersChecked, lettersCorrect) => {
    console.log('gameOver lettersCorrect: ',lettersCorrect)
    setCompletedScore(1000-(30*lettersChecked));
    props.addScore(1000-(30*lettersChecked))
    setModalVisible(!modalVisible);
  }

  const modalHidden = () => {
    if (onlyDismissedModal) {
      setOnlyDismissedModal(false);
    } else {
      props.newGamePressed();
    }
  }
  
  return (
    <View style={styles.container}>
          <View style={(window.height > 811 && window.width < 415) ? styles.tallTopBar : styles.topBar} >
            {/*<Ionicons name="ios-help-buoy" size={40} color="#007AFF" style={window.height > 740 && {marginTop: 3}} />*/}
  <Text style={styles.timer}>{Math.floor(props.timer/60)}:{props.timer%60<10 && 0}{props.timer%60}</Text>
            <Button 
                style={styles.newGameButton}
                title="New Game" 
                onPress={props.newGamePressed}
            />
          </View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
                onDismiss={modalHidden}
            >
                <TouchableWithoutFeedback onPress={() => {
                  setOnlyDismissedModal(true);
                  setModalVisible(false);
                }}>
                  <View style={styles.centeredView}>
                      <View style={styles.modalView}>
                          <Text style={styles.modalText}>Congratulations!</Text>
                          {props.isHighScore && (<Text style={styles.modalText}>New High Score!</Text>)}
                          <Text style={styles.modalText}>You're score: {completedScore}</Text>
                          <Text style={styles.modalText}>You're top scores</Text>
                          {props.scores[0] && (<Text style={(props.scores[0] === completedScore) ? styles.thisScoreText : styles.modalText}>1.  {props.scores[0]}</Text>)}
                          {props.scores[1] && (<Text style={(props.scores[1] === completedScore) ? styles.thisScoreText : styles.modalText}>2.  {props.scores[1]}</Text>)}
                          {props.scores[2] && (<Text style={(props.scores[2] === completedScore) ? styles.thisScoreText : styles.modalText}>3.  {props.scores[2]}</Text>)}
                          <TouchableHighlight
                            style={ styles.modalNewGameButton }
                            onPress={() => {
                              setModalVisible(false);  
                            }}
                          >
                              <Text style={styles.textStyle}>New Game</Text>
                          </TouchableHighlight>
                      </View>
                  </View>
                </TouchableWithoutFeedback>
            </Modal>
        <Grid
          grid={props.grid}
          words={props.words}
          setCurrentWordIndex={props.turnOnTimer}
          gameOver={gameOver}
          openActionSheet={openActionSheet}
          resetActionSheetCall={() => setOpenActionSheet(false)}
        />
      
      <Text style={(window.height < 810) ? styles.shortHowToStyle :styles.howToStyle}>
        <Text style={{color: '#147efb'}}>How to play:{"\n"}</Text>
        1. Each word in the crossword (Down or Accross) is either the first or last name of one of your contacts{"\n"}
        2. The clue for the current word is shown above the keyboard{"\n"}
        3. Double tap on a square to switch direction{"\n"}
        4. If you need help, click on the <Ionicons name="ios-help-buoy" size={24} color="#147efb" /> icon above to reveal a letter, word, or the rest of the puzzle{"\n"}
        5. Tap on any box to get started{"\n"}
      </Text>
    </View>
  );
}
export default CrosswordView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 2
  },
  topBar: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#ededed',
      height: 20,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'center',
      paddingHorizontal: 10,
      paddingTop: 0,
  },
  tallTopBar: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ededed',
    height: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    textAlign: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  timer: {
    flex: 1,
    paddingHorizontal: 10,
    color: '#2196F3',
    fontSize: 18
  },
  helpDropdown: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    fontSize: 18,
    width: 100,
    zIndex: 100,
    marginTop: 45
  },
  helpDropdownButton: {
    fontSize: 18,
  },
  newGameButton: {
    flex: 1,
    paddingHorizontal: 5
  },
  howToStyle: {
    position: 'absolute',
    bottom: 0,
    padding: 18,
    paddingBottom: 10,
    fontSize: 18,
    lineHeight: 22,
  },
  shortHowToStyle: {
    position: 'absolute',
    bottom: 0,
    padding: 8,
    paddingBottom: 0,
    fontSize: 18,
    lineHeight: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalNewGameButton: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20
  },
  thisScoreText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: '#1ec31e',
    fontWeight:'bold'
  }
});
