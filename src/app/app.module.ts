import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';

import { ApiService } from '../service/api-service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { PinCheck } from '@ionic-native/pin-check';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Geolocation } from '@ionic-native/geolocation';
import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network'

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    TouchID,
    PinCheck,
    AndroidFingerprintAuth,
    UniqueDeviceID,
    NFC,
    Ndef,
    Geolocation,
    Camera,
    Network,
    ApiService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
