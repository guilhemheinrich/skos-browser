import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';

import { ThesaurusDisplayComponent } from './thesaurus/thesaurus-display/thesaurus-display.component';

import * as $ from 'jquery';

import {Ng2Webstorage} from 'ngx-webstorage';
//material stuff
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialCustomModule} from './material-custom/material-custom.module';
import { MainComponent } from './main/main/main.component';
import { BrowserComponent } from './rdf-store/browser/browser.component';

import { ShortenUriPipe } from './shorten-uri.pipe'


// import { DataTablesModule } from 'angular-datatables';
// import 'DataTables.net';
import { DatatableTestComponent } from './datatable-test/datatable-test.component';

@NgModule({
  declarations: [
    AppComponent,
    ThesaurusDisplayComponent,
    MainComponent,
    BrowserComponent,
    ShortenUriPipe,
    DatatableTestComponent
  ],
  imports: [
    BrowserModule,
    Ng2Webstorage,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialCustomModule,
    HttpClientModule,
    // DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
