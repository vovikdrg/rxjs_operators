import { Injectable } from '@angular/core';
import { Subject, Observable, Scheduler, BehaviorSubject } from 'rxjs';
import './event.flow.operator'

@Injectable()
export class EventsService {

  public PushEvents = new Subject<EventFlow>();
  private _eventFlowStopper = new BehaviorSubject<boolean>(false);
  private _allowType = new BehaviorSubject<string>("");
  //private _eventsObservable: Observable<EventFlow>
  private _eventsObservable: Subject<EventFlow> = new Subject<EventFlow>();

  constructor() {
    this.PushEvents
      .controlledEventFlow(this._eventFlowStopper, this._allowType)      
      .subscribe(ev=>this._eventsObservable.next(ev));
  }


  public get events(): Observable<EventFlow> {
    return this._eventsObservable;
  }

  public get eventFlowStopper(): BehaviorSubject<boolean> {
    return this._eventFlowStopper;
  }

  public get allowType(): BehaviorSubject<string> {
    return this._allowType;
  }
}

export class EventFlow {
  public type: string;
  public value: any;
  constructor(type: string, value: any) {
    this.type = type;
    this.value = value;
  }


}