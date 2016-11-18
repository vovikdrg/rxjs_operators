import { Observable } from 'rxjs';
import { EventsService } from './../events.service';
import { Component, OnInit } from '@angular/core';
import { TimerObservable } from "rxjs/observable/TimerObservable";

@Component({
  selector: 'app-display-first-type',
  templateUrl: './display-first-type.component.html',
  styleUrls: ['./display-first-type.component.css']
})
export class DisplayFirstTypeComponent implements OnInit {
  events: any[] = [];
  private _timer: Observable<number>;

  constructor(private _eventService: EventsService) {
    this._timer = TimerObservable.create(5000);
    this._eventService
      .events
      .filter(e => e.type == 'First')
      .subscribe(e => {
        this.events.push(e);
        this._eventService.eventFlowStopper.next(true);
        var subscription = this._timer.subscribe((n) => {
          subscription.unsubscribe();
          this._eventService.eventFlowStopper.next(false);
        })
      });
  }

  ngOnInit() {

  }

}
