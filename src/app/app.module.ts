import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { MainPage } from '../pages/main/main';
import { DocAPage } from '../pages/doc-a/doc-a';
import { DocBPage } from '../pages/doc-b/doc-b';

import { ApiService } from '../service/api-service';
import { NetworkProvider } from '../service/network'

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
    LoginPage,
    MainPage,
    DocAPage,
    DocBPage,
    TabsPage
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
    LoginPage,
    MainPage,
    DocAPage,
    DocBPage,
    TabsPage
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
    NetworkProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}