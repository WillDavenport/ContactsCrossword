import React, { Component } from "react";
import { View, StatusBar } from 'react-native';
import { AdMobInterstitial } from "expo-ads-admob";

AdMobInterstitial.setAdUnitID("ca-app-pub-6643827733570457/5527903824"); // test ad, real ad unit id ca-app-pub-6643827733570457/5527903824
                                                                        // test id: ca-app-pub-3940256099942544/4411468910

class InterstitialView extends Component {
    componentDidMount() {
        // load interstitial ad
        (async () => {
            //AdMobInterstitial.setTestDeviceID('EMULATOR');
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
        })();
        AdMobInterstitial.addEventListener('interstitialDidClose',
            () => {
              this.props.interstitialDidClose();
              (async () => {
              //AdMobInterstitial.setTestDeviceID('EMULATOR');
              await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
          })();}
        );
    }
    
    componentWillUnmount() {
      AdMobInterstitial.removeAllListeners();
    }
  
    componentDidUpdate(prevProps) {
        if (this.props.loadInterstitialFlag !== prevProps.loadInterstitialFlag && !(prevProps.loadInterstitialFlag === null)) {
            console.log('this.props.loadInt: ',this.props.loadInterstitialFlag, " prevProps.loadInt: ", prevProps.loadInterstitialFlag)
            this.openInterstitial();
        }
    }

  openInterstitial = async () => {
    try {
      console.log('trying to open interstatial')
      if (await AdMobInterstitial.getIsReadyAsync()) {
        await AdMobInterstitial.showAdAsync();
      }
    } catch (error) {
      console.error(error)
    } 
  }

  render() {
    return (
      <View>
        <StatusBar hidden={true} />
     </View>
    );
  }
}

export default InterstitialView;
