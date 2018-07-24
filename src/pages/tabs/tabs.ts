import { Component } from '@angular/core';


import { LoginPage } from '../login/login';
import { MainPage } from '../main/main';
import { DocAPage } from '../doc-a/doc-a';
import { DocBPage } from '../doc-b/doc-b';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = LoginPage;
  tab2Root = MainPage;
  tab3Root = DocAPage;
  tab4Root = DocBPage;

  constructor() {

  }
}
