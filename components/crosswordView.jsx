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
    Dimensions,
    Keyboard
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
  const [completedLetterScore, setCompletedLetterScore] = React.useState(0);
  const [completedTimeMultiplier, setCompletedTimeMultiplier] = React.useState(1);
  const [victory, setVictory] = React.useState(false);

  const gameOver = (lettersCheckedWrong, lettersCorrect) => {
    var timeMultiplier = Math.round(1000/props.timer * 10) / 10
    setCompletedLetterScore(lettersCorrect*2-lettersCheckedWrong);
    setCompletedTimeMultiplier(timeMultiplier);
    setCompletedScore(Math.round((lettersCorrect*2-lettersCheckedWrong) * timeMultiplier));
    props.addScore(Math.round((lettersCorrect*2-lettersCheckedWrong) * timeMultiplier));
    
    /*console.log('gameOver lettersCorrect: ',lettersCorrect)
    setCompletedScore(1000-(30*lettersCheckedWrong));
    props.addScore(1000-(30*lettersCheckedWrong))*/
    setVictory(true);
    setModalVisible(!modalVisible);
  }

  const modalHidden = () => {
    if (onlyDismissedModal) {
      setOnlyDismissedModal(false);
      Keyboard.dismiss()
    } else {
      newGamePressed();
    }
  }

  const newGamePressed = () => {
    props.newGamePressed();
    setVictory(false);
  }
  
  return (
    <View style={styles.container}>
          <View style={(window.height > 811 && window.width < 415) ? styles.tallTopBar : styles.topBar} >
            {/*<Ionicons name="ios-help-buoy" size={40} color="#007AFF" style={window.height > 740 && {marginTop: 3}} />*/}
  <Text style={styles.timer}>{Math.floor(props.timer/60)}:{props.timer%60<10 && 0}{props.timer%60}</Text>
            <Button 
                style={styles.newGameButton}
                title="New Game" 
                onPress={newGamePressed}
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
                          <Text style={styles.modalCongratulationsText}>Congratulations!</Text>
                          {props.isHighScore && (<Text style={styles.modalText}>New High Score!</Text>)}
                          <View style={styles.scoreBox}>
                            <View style={styles.scoreBoxMultiplication}>
                            <View style={{flexDirection: 'column'}}>
                              <Text style={styles.modalText_scoreBox}>Letter Score</Text>
                              <Text style={styles.modalText_scoreBoxScore}>{completedLetterScore} </Text>
                            </View>
                            <Text style ={{justifyContent:'center',alignItems:'center', alignContent:'center', fontSize:20, fontWeight:'bold'}}>X</Text>
                            <View style={{flexDirection: 'column'}}>
                              <Text style={styles.modalText_scoreBox}>Time Multiplier</Text>
                              <Text style={styles.modalText_scoreBoxScore}>{completedTimeMultiplier} </Text>
                            </View>
                            </View>
                            <Text style={styles.modalText}>You're score: <Text style={{color: '#1ec31e',fontWeight:'bold'}}>{completedScore}</Text></Text>
                          </View>
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
      {victory ?
        (<View style={[styles.bottomScoreboard, (window.height > 811 && window.width < 415) ? styles.tallBottomFlex : (window.height < 810) ? styles.shortBottomFlex :styles.bottomFlex]}>
          {window.height < 810 ? (
          <View>
          <Text style={styles.bottomScoreboardTopScoresText}>You're top scores</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{flexDirection:'column', flex: 1}}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>1.</Text>
            <Text style={(props.scores[0] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[0]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>2.</Text>
            <Text style={(props.scores[1] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[1]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>3.</Text>
            <Text style={(props.scores[2] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[2]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>4.</Text>
            <Text style={(props.scores[3] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[3]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>5.</Text>
            <Text style={(props.scores[4] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[4]}</Text>
          </View>
          </View>
          <View style={{flexDirection:'column', flex: 1}}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>6.</Text>
            <Text style={(props.scores[5] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[5]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>7.</Text>
            <Text style={(props.scores[6] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[6]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>8.</Text>
            <Text style={(props.scores[7] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[7]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>9.</Text>
            <Text style={(props.scores[8] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[8]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>10.</Text>
            <Text style={(props.scores[9] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[9]}</Text>
          </View></View></View></View>
          ) : (
          <View><Text style={styles.bottomScoreboardTopScoresText}>You're top scores</Text>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>1.</Text>
            <Text style={(props.scores[0] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[0]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>2.</Text>
            <Text style={(props.scores[1] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[1]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>3.</Text>
            <Text style={(props.scores[2] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[2]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>4.</Text>
            <Text style={(props.scores[3] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[3]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>5.</Text>
            <Text style={(props.scores[4] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[4]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>6.</Text>
            <Text style={(props.scores[5] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[5]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>7.</Text>
            <Text style={(props.scores[6] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[6]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>8.</Text>
            <Text style={(props.scores[7] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[7]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>9.</Text>
            <Text style={(props.scores[8] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[8]}</Text>
          </View>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.bottomScoreboardNumber}>10.</Text>
            <Text style={(props.scores[9] === completedScore) ? styles.bottomScoreboardThisScoreText : styles.bottomScoreboardText}>{props.scores[9]}</Text>
          </View></View>)}
        </View>)
      :
      (<Text style={(window.height < 810) ? styles.shortHowToStyle : window.width < 415 ? styles.tallHowToStyle : styles.howToStyle}>
        <Text style={{color: '#147efb'}}>How to play:{"\n"}</Text>
        1. Each word in the crossword (Down or Accross) is either the first or last name of one of your contacts{"\n"}
        2. The clue for the current word is shown above the keyboard{"\n"}
        3. Double tap on a square to switch direction{"\n"}
        4. If you need help, click on the <Ionicons name="ios-help-buoy" size={24} color="#147efb" /> icon above to reveal a letter, word, or the rest of the puzzle{"\n"}
        5. Tap on any box to get started{"\n"}
      </Text>)
  }
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
  tallHowToStyle: {
    flex: 6,
    bottom: 0,
    padding: 18,
    paddingBottom: 10,
    fontSize: 18,
    lineHeight: 22,
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
  modalCongratulationsText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 22,
    fontWeight: 'bold',
    color: '#D4AF37'
  },
  scoreBox: {
    backgroundColor: '#ededed',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    marginBottom: 10
  },
  scoreBoxMultiplication: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 22,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold'
  },
  modalText_scoreBox: {
    marginBottom: 10,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 18,
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalText_scoreBoxScore: {
    marginBottom: 0,
    marginHorizontal: 5,
    textAlign: "center",
    fontSize: 22,
    alignContent: 'center',
    textAlign: 'center',
    color: '#1ec31e',
    fontWeight: 'bold',
  },
  thisScoreText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    color: '#1ec31e',
    fontWeight:'bold'
  },
  bottomFlex: {
    position: 'absolute',
    bottom: 0
  },
  shortBottomFlex: {
    position: 'absolute',
    bottom: 0,
    width: 300
  },
  tallBottomFlex: {
    flex: 6,
  },
  bottomScoreboard: {
    width: 250,
    backgroundColor: '#ededed',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15
  },
  bottomScoreboardTopScoresText: {
    marginBottom: 10,
    textAlign: "center",
    fontSize: 20,
    color: '#1ec31e',
    fontWeight:'bold'
  },
  bottomScoreboardText: {
    flex: 6,
    marginBottom: 2,
    textAlign: "left",
    fontSize: 20
  },
  bottomScoreboardThisScoreText: {
    flex: 6,
    marginBottom: 2,
    textAlign: "left",
    fontSize: 20,
    color: '#1ec31e',
    fontWeight:'bold'
  },
  bottomScoreboardNumber: {
    flex: 2,
    justifyContent: 'flex-start',
    marginBottom: 5,
    textAlign: "center",
    fontSize: 20
  },
});
