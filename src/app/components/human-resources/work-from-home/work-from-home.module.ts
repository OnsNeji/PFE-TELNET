import { NgModule } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { WorkFromHomeRequestComponent } from './work-from-home-request/work-from-home-request.component';
import { SharedModule, MaterialModule } from 'app/shared/shared.module';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClientModule } from '@angular/common/http';
import { WorkFromHomeRequestTableComponent } from './work-from-home-request/work-from-home-request-table/work-from-home-request-table.component';
import { SearchFilterService } from 'app/services/shared';
import { DirectivesModule } from 'app/directives/shared/directives.module';
import { WorkFromHomeRoutingModule } from './work-from-home-routing.module';
import { WorkFromHomeService } from 'app/services/human-resources/work-from-home';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditWorkFromHomeRequestComponent } from './work-from-home-request/edit-work-from-home-request/edit-work-from-home-request.component';

export const CUSTOM_DT_FORMATS = {
  parse: {
    dateInput: 'L',
  },
  display: {
    dateInput: 'L',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    DirectivesModule,
    WorkFromHomeRoutingModule
  ],
  declarations: [
    WorkFromHomeRequestComponent,
    WorkFromHomeRequestTableComponent,
    EditWorkFromHomeRequestComponent
  ],
  providers: [
    WorkFromHomeService,
    SearchFilterService,
    DatePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DT_FORMATS }
  ],
  exports: [
    WorkFromHomeRequestComponent,
    WorkFromHomeRequestTableComponent
  ]
})
export class WorkFromHomeModule { }
