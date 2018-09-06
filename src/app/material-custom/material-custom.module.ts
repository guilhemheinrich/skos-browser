import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatChipsModule} from '@angular/material';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    MatButtonToggleModule
  ],
  exports: [
    MatChipsModule,
    MatButtonToggleModule
  ],
  declarations: []
})
export class MaterialCustomModule { }
