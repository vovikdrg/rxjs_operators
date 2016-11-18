import { EventsService } from './../events.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-second-type',
  templateUrl: './display-second-type.component.html',
  styleUrls: ['./display-second-type.component.css']
})
export class DisplaySecondTypeComponent implements OnInit {
  events: any[] = [];
  constructor(private _eventService: EventsService) {
    this._eventService
      .events
      .filter(e => e.type == 'Second')
      .subscribe(e => {
        console.log(e)
        this.events.push(e);
        this._eventService.allowType.next("Second");
      });
  }

  ngOnInit() {
  }

}
