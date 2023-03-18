import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, MaterialModule } from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ReferencesComponent } from './references.component';
import { ReferencesTableComponent } from './references-table/references-table.component';
import { ReferenceService } from 'app/services/project-management/project/reference.service';
import { EditReferenceComponent } from './edit-reference/edit-reference.component';
import { DirectivesModule } from 'app/directives/shared/directives.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatDialogModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
    DirectivesModule
  ],
  declarations: [ReferencesComponent,
    ReferencesTableComponent,
    EditReferenceComponent
  ],

  providers: [
    ReferenceService
  ]
})
export class ReferencesModule { }
