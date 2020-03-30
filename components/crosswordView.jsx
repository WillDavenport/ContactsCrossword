import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Button, 
    TouchableHighlight, 
    Modal, 
    Alert,
} from 'react-native';
import Grid from './grid'

const CrosswordView = (props) => {
  const [isWordFocused, setIsWordFocused] = React.useState(false);
  const [currentWordIndex, setCurrentWordIndex] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [completedScore, setCompletedScore] = React.useState(0);
  const [isHighScore, setIsHighScore] = React.useState(false);

  const gameOver = (lettersChecked) => {
    setIsHighScore(!props.scores[0] || props.scores[0] < 1000-(30*lettersChecked));
    setCompletedScore(1000-(30*lettersChecked));
    props.addScore(1000-(30*lettersChecked))
    setModalVisible(!modalVisible);
  }
  
  return (
    <View style={styles.container}>
        <View style={styles.topBar} >
            
            <Button 
                style={styles.newGameButton}
                title="New Game +" 
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
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Congratulations!</Text>
                        {isHighScore && (<Text style={styles.modalText}>New High Score!</Text>)}
                        <Text style={styles.modalText}>You're score: {completedScore}</Text>
                        <Text style={styles.modalText}>You're top scores</Text>
                        {props.scores[0] && (<Text style={styles.modalText}>1.  {props.scores[0]}</Text>)}
                        {props.scores[1] && (<Text style={styles.modalText}>2.  {props.scores[1]}</Text>)}
                        {props.scores[2] && (<Text style={styles.modalText}>3.  {props.scores[2]}</Text>)}
                        <TouchableHighlight
                        style={ styles.modalNewGameButton }
                        onPress={() => {
                            setModalVisible(!modalVisible);
                            props.newGamePressed();
                        }}
                        >
                            <Text style={styles.textStyle}>New Game</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
      <Grid
        grid={props.grid}
        words={props.words}
        setCurrentWordIndex={setCurrentWordIndex}
        gameOver={gameOver}
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
  topBar: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#ededed',
      height: 10,
      width: '100%',
      alignItems: 'center',
      justifyContent: 'flex-end',
      textAlign: 'center',
      paddingHorizontal: 10,
      paddingTop: 15
  },
  newGameButton: {
    
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
  }
});
