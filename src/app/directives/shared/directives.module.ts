import { TextValidatorDirective } from './text-validator.directive';
import { NgModule } from '@angular/core';
import { NumbrerValidatorDirective } from './number-validator.directive';

@NgModule({
  imports: [
  ],
  exports: [
    TextValidatorDirective,
    NumbrerValidatorDirective
  ],
  declarations: [
    TextValidatorDirective,
    NumbrerValidatorDirective,
  ],
  providers: [
  ],
  schemas: [
  ]
})
export class DirectivesModule { }
