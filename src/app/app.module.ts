import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';

import { ThesaurusDisplayComponent } from './thesaurus/thesaurus-display/thesaurus-display.component';

import * as $ from 'jquery';

//material stuff
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialCustomModule} from './material-custom/material-custom.module';
import { MainComponent } from './main/main/main.component'

@NgModule({
  declarations: [
    AppComponent,
    ThesaurusDisplayComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialCustomModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
