import { Subject, BehaviorSubject } from 'rxjs';
import { Component } from '@angular/core';
import { EventsService, EventFlow } from './events.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
  constructor(private _eventService: EventsService) {

  }
  addEvent(type) {
    this._eventService.PushEvents.next(new EventFlow(type, new Date()));
  }

  cleanType(){
    this._eventService.allowType.next(null);
  }
}
