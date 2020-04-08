import React, { Component } from "react";
import { View } from 'react-native';
import { AdMobInterstitial } from "expo-ads-admob";

AdMobInterstitial.setAdUnitID("ca-app-pub-3940256099942544/4411468910"); // test ad, real ad unit id ca-app-pub-6643827733570457/5527903824

class InterstitialView extends Component {
    componentDidMount() {
         // load interstitial ad
        (async () => {
            //AdMobInterstitial.setTestDeviceID('EMULATOR');
            await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true});
        })();
      }  
  
    componentDidUpdate(prevProps) {
        if (this.props.loadInterstitialFlag !== prevProps.loadInterstitialFlag && !(prevProps.loadInterstitialFlag === null)) {
            console.log('this.props.loadInt: ',this.props.loadInterstitialFlag, " prevProps.loadInt: ", prevProps.loadInterstitialFlag)
            this.openInterstitial();
        }
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

  render() {
    return <View></View>;
  }
}

export default InterstitialView;
