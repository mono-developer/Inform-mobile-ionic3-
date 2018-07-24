import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DocAPage } from './doc-a';

@NgModule({
  declarations: [
    DocAPage,
  ],
  imports: [
    IonicPageModule.forChild(DocAPage),
  ],
})
export class DocAPageModule {}
