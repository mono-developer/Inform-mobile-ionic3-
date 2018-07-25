import { Component } from '@angular/core';
import {
  Platform, ToastController
} from "ionic-angular";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from "@ionic/storage";
import { Network } from '@ionic-native/network';



@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage: any = 'TabsPage';

  constructor(
    platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public storage: Storage,
    public network: Network,
    public toastCtrl: ToastController
  ) {
    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initializeApp();
    });
  }

  initializeApp(): void {
    this.network.onDisconnect().subscribe(() => {
      this.showToast( "Network was disconnected!");
      this.storage.set("network", 0);
    });
    this.network.onConnect().subscribe(() => {
      this.showToast("Network was connected!");
      this.storage.set("network", 1);
    });

    if (this.network.type === "wifi") {
      this.storage.set("network", 1);
    } else {
      console.log("Please Check your network and try again");
      this.storage.set("network", 0);
    }
  }

  showToast(message) {
    const toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
