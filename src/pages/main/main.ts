import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../service/api-service';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {

  public main_url: string = 'http://testrestidmr.azurewebsites.net/api/documents';
  public mainData: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public apiService: ApiService,
    private storage: Storage
  ) {

  }

  ionViewWillEnter() {

    this.storage.get('network').then((val) => {
      if (val == 1) {
        this.getDocument();
      } else {
        this.storage.get('document').then((res) => {
          console.log(JSON.stringify(res));
          this.mainData = res;
        });
      }
    });
  }

  getDocument() {
    this.apiService.getData(this.main_url).subscribe(
      (res) => {
        this.mainData = res;
        this.storage.set('document', this.mainData);
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
