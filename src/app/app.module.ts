import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here

import { AppComponent } from './app.component';

import { ThesaurusDisplayComponent } from './thesaurus/thesaurus-display/thesaurus-display.component';

import * as $ from 'jquery';

//material stuff
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialCustomModule} from './material-custom/material-custom.module'

@NgModule({
  declarations: [
    AppComponent,
    ThesaurusDisplayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialCustomModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
