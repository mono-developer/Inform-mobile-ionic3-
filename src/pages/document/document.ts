import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ToastController } from 'ionic-angular';
import { ApiService } from '../../service/api-service';
import { DomSanitizer } from '@angular/platform-browser';
import { TouchID } from '@ionic-native/touch-id';
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
import { PinCheck } from '@ionic-native/pin-check';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { NFC, Ndef } from '@ionic-native/nfc';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PinDialog } from "@ionic-native/pin-dialog";

import * as $ from 'jquery';

@IonicPage()
@Component({
  selector: "page-document",
  templateUrl: "document.html"
})
export class DocumentPage {
  public docData: any = "";
  public title: string = "";

  granted: boolean;
  denied: boolean;
  scanned: boolean;
  tagId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public apiService: ApiService,
    private sanitized: DomSanitizer,
    private touchId: TouchID,
    private androidFingerprintAuth: AndroidFingerprintAuth,
    private pinCheck: PinCheck,
    private plt: Platform,
    private uniqueDeviceID: UniqueDeviceID,
    private nfc: NFC,
    public ndef: Ndef,
    private geolocation: Geolocation,
    private storage: Storage,
    private camera: Camera,
    private toastCtrl: ToastController,
    private pinDialog: PinDialog
  ) {
    this.resetScanData();
  }

  ionViewWillEnter() {
    let item = this.navParams.get("item");
    this.storage.get("network").then(val => {
      if (val == 1) {
        this.getDocument(item.id);
      } else {
        this.docData = this.sanitized.bypassSecurityTrustHtml(item.data);
        this.title = item.title;
        console.log(this.docData, this.title);
        window.setTimeout(() => {
          this.implementEvents();
        }, 1000);
      }
    });
  }

  getDocument(id) {
    console.log("4");
    let url = "http://testrestidmr.azurewebsites.net/api/documents/" + id;
    this.apiService.getData(url).subscribe(
      res => {
        this.docData = this.sanitized.bypassSecurityTrustHtml(res.data);
        this.title = res.title;
        console.log(res);
        window.setTimeout(() => {
          this.implementEvents();
        }, 2000);
      },
      err => {
        console.log(err);
      }
    );
  }

  implementEvents() {
    $(".js_finger").on("click", () => {
      if (this.plt.is("ios")) {
        this.checkTouchID();
      } else {
        this.checkFingerPrints();
      }
    });

    $(".js_pin").on("click", () => {
      // Test Pin
      this.checkPin();
    });

    $(".js_uniqueid").on("click", () => {
      // Device ID
      this.checkDeviceID();
    });

    $(".js_nfc").on("click", () => {
      // NFC
      this.checkNFC();
    });

    $(".js_location").on("click", () => {
      // Location
      this.checkGeolocation();
    });

    // $('.tl03').on('click', () => {
    //   // Camera
    //   this.checkCamera();
    // });

    $(".js_storage").on("click", () => {
      // storage
      this.readStorage();
    });
  }

  checkTouchID() {
    console.log("Check TouchID");
    this.touchId.isAvailable().then(
      res => {
        this.touchId
          .verifyFingerprint("Scan your fingerprint please")
          .then(
            res => console.log("Ok", res),
            err => console.error("Error", err)
          );
      },
      err => console.error("TouchID is not available", err)
    );
  }

  checkFingerPrints() {
    console.log("Check FingerPrints");
    this.androidFingerprintAuth
      .isAvailable()
      .then(result => {
        if (result.isAvailable) {
          // it is available
          this.androidFingerprintAuth
            .encrypt({
              clientId: "myAppName",
              username: "myUsername",
              password: "myPassword"
            })
            .then(result => {
              if (result.withFingerprint) {
                this.showAlert(
                  "Success",
                  "Successfully encrypted credentials. Encrypted credentials: " +
                    result.token
                );
              } else if (result.withBackup) {
                this.showAlert(
                  "Success",
                  "Successfully authenticated with backup password!"
                );
              } else {
                this.showAlert("Success", "Didn't authenticate!");
              }
            })
            .catch(error => {
              if (
                error ===
                this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED
              ) {
                console.log("Fingerprint authentication cancelled");
                this.showAlert("Error", "Fingerprint authentication cancelled");
              } else {
                this.showAlert("Error", error);
              }
            });
        } else {
          console.log("touchID is not available");
          this.showAlert("Error", "FingerPrints is not available now");
        }
      })
      .catch(error => console.error(error));
  }

  checkPin() {
    console.log("Check Pin");
    this.pinCheck.isPinSetup().then(
      (success: any) => {
        // this.showAlert("Success", "pin is setup.");
        this.pinDialog
          .prompt("Enter your PIN", "Verify PIN", ["OK", "Cancel"])
          .then((result: any) => {
            if (result.buttonIndex == 1) {
              this.showAlert("User clicked OK, value is ", result.input1);
            } else if (result.buttonIndex == 2) {
              this.showAlert("Canceled", "User cancelled");
            }
          });
      },
      (error: string) => {
        this.showAlert("Success", "pin is not setup.");
      }
    );
  }

  checkDeviceID() {
    console.log("Check DeviceID");
    this.uniqueDeviceID
      .get()
      .then((uuid: any) => {
        this.showAlert("UUID", uuid);
      })
      .catch((error: any) => {
        console.log(error);
        this.showAlert("Error", error);
      });
  }

  resetScanData() {
    this.granted = false;
    this.scanned = false;
    this.tagId = "";
  }

  checkNFC() {
    this.nfc
      .enabled()
      .then(resolve => {
        this.addListenNFC();
      })
      .catch(reject => {
        alert("NFC is not supported by your Device");
      });
  }

  addListenNFC() {
    this.nfc
      .addTagDiscoveredListener(nfcEvent => this.sesReadNFC(nfcEvent))
      .subscribe(data => {
        if (data && data.tag && data.tag.id) {
          let tagId = this.nfc.bytesToHexString(data.tag.id);
          if (tagId) {
            this.tagId = tagId;
            this.scanned = true;

            // only testing data consider to ask web api for access
            this.granted = ["7d3c6179"].indexOf(tagId) != -1;
          } else {
            alert("NFC_NOT_DETECTED");
          }
        }
      });
  }

  sesReadNFC(data): void {
    this.showAlert("Success", "NFC is supported by your Device");
    console.log('data', data);
  }

  failNFC(err) {
    this.showAlert('Error', "Error while reading: Please Retry");
  }

  checkGeolocation() {
    console.log("Check Geolocation");
    this.geolocation
      .getCurrentPosition()
      .then(resp => {
        let lat = resp.coords.latitude;
        let lng = resp.coords.longitude;
        this.showAlert("Position", "Lat: " + lat + " Lng: " + lng);
      })
      .catch(error => {
        this.showAlert("Error getting location", error);
      });

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   console.log( 'location', data.coords.latitude, data.coords.longitude);
    //   this.showAlert('Your Location', 'Lat: ' + data.coords.latitude + ' Lng: '+ data.coords.longitude);
    // });
  }

  readStorage() {
    console.log("Check Storage");
    this.storage.get("document").then(val => {
      this.showAlert("Storeage is Available", JSON.stringify(val));
    });
  }

  checkCamera() {
    console.log("Check Camera");

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera.getPicture(options).then(
      imageData => {
        let base64Image = "data:image/jpeg;base64," + imageData;
        this.showAlert("Camera is available", base64Image);
      },
      err => {
        this.showAlert("Error", "Camera is not available");
      }
    );
  }

  showToast(message, timer, position) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: timer,
      position: position
    });

    toast.present();
  }
  showAlert(title, body) {
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: body,
      buttons: ["OK"]
    });
    alert.present();
  }
}


