import { Pipe, PipeTransform } from '@angular/core';
import { MediaEvent } from 'app/models/shared/mediaEvent.model';

@Pipe({
  name: 'filterMediaEventByEvenementId'
})
export class FilterMediaEventByEvenementIdPipe implements PipeTransform {
  transform(mediaEvents: MediaEvent[], evenementId: number): MediaEvent[] {
    return mediaEvents.filter(m => m.evenementId === evenementId);
  }
}
