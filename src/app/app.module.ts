import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http'; 
import { AppComponent } from './app.component';

import { ThesaurusDisplayComponent } from './thesaurus/thesaurus-display/thesaurus-display.component';
import * as $ from 'jquery';

import {Ng2Webstorage} from 'ngx-webstorage';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//material stuff
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialCustomModule} from './material-custom/material-custom.module';
import { MainComponent } from './main/main/main.component';
import { BrowserComponent } from './rdf-store/browser/browser.component';

import { ShortenUriPipe } from './shorten-uri.pipe'


// import { DataTablesModule } from 'angular-datatables';
// import 'DataTables.net';
import { TableModule } from 'primeng/table';
import {InputTextModule} from 'primeng/inputtext';
import {TooltipModule} from 'primeng/tooltip';
import {AccordionModule} from 'primeng/accordion';
import {ToolbarModule} from 'primeng/toolbar';
import {MultiSelectModule} from 'primeng/multiselect';
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
    NgxDatatableModule,
    NgbModule,
    TableModule,
    InputTextModule,
    TooltipModule,
    AccordionModule,
    ToolbarModule,
    MultiSelectModule
        // DataTablesModule
  ],
  providers: [
    ShortenUriPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
