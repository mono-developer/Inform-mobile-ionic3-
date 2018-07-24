import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";

import { TabsPage } from '../pages/tabs/tabs';
import { NetworkProvider } from "../service/network";
import { Network } from '@ionic-native/network';



@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(
    platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
    public storage: Storage,
    public networkStatus: NetworkProvider,
    public network: Network
  ) {
    platform.ready().then(() => {
      this.network.onConnect().subscribe(() => {
        alert('network connected!');
        setTimeout(() => {
          if (this.network.type === 'wifi') {
            alert('we got a wifi connection, woohoo!');
          }
        }, 3000);
      });


      this.initializeApp();
    });
  }

  initializeApp(): void {
    /* Check networkStatus */
    this.networkStatus.initializeNetworkEvents()
    this.events.subscribe('network:offline', () => {
      alert('network:offline ==> ' + this.networkStatus.getNetworkType());
      this.storage.set('network', 0);
    })
    this.events.subscribe('network:online', () => {
      alert('network:online ==> ' + this.networkStatus.getNetworkType());
      this.storage.set("network", 1);
    })

    /* Ionic stuff */
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }

}
