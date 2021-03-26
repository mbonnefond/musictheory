import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ComposerComponent} from './composer.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {path: '', component: ComposerComponent},
]

@NgModule({
  declarations: [ComposerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FlexLayoutModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatButtonModule,
    FormsModule
  ]
})
export class ComposerModule { }
