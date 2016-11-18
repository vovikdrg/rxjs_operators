import { EventFlow } from './events.service';
import { Observable } from 'rxjs/Observable';
import { Subscriber, Operator } from 'rxjs';

export function controlledEventFlow(this: Observable<EventFlow>, stopNotifier: Observable<boolean>, allowTypeOnly: Observable<string>): Observable<EventFlow> {
    return this.lift(new EventFlowOperator(stopNotifier, allowTypeOnly));
}

class EventFlowOperator implements Operator<EventFlow, EventFlow> {

    constructor(private stopNotifier: Observable<boolean>, private allowTypeOnly: Observable<string>) {
    }

    call(subscriber: Subscriber<EventFlow>, source: any): any {
        return source._subscribe(new EventFlowSubscriber(subscriber, this.stopNotifier, this.allowTypeOnly));
    }
}

class EventFlowSubscriber extends Subscriber<EventFlow> {
    private buffer: EventFlow[] = [];
    private flowStopper = false;
    private allowType = "";

    constructor(destination: Subscriber<EventFlow>, stopNotifier: Observable<boolean>, allowTypeOnly: Observable<string>) {
        super(destination);
        stopNotifier.subscribe((v) => {
            this.flowStopper = v;
            this.deliverNext();
        });
        allowTypeOnly.subscribe((v) => {
            this.allowType = v
            this.deliverNext();
        });
    }

    protected _next(value: EventFlow) {
        this.buffer.push(value);
        this.deliverNext();
    }

    private deliverNext() {
        console.log("deliverNext", this.flowStopper);
        if (this.buffer.length == 0) {
            return;
        }
     
        if (this.allowType) {
            var toEmit = this.buffer.filter(el => {
                return el.type === this.allowType;
            });
            toEmit.forEach(e => {
                this.buffer.splice(this.buffer.indexOf(e), 1);
                this.destination.next(e);
            })
            return;
        }
        if (this.flowStopper) {
            return;
        }
        this.destination.next(this.buffer.shift());
    }
}

Observable.prototype.controlledEventFlow = controlledEventFlow;

declare module 'rxjs/Observable' {
    interface Observable<T> {
        controlledEventFlow: typeof controlledEventFlow;
    }
}