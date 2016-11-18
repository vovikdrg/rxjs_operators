import { EventFlow } from './events.service';
import { Observable } from 'rxjs/Observable';
import { Subscriber, Operator } from 'rxjs';

function controlledEventFlow(this: Observable<EventFlow>, stopNotifier: Observable<boolean>, allowTypeOnly: Observable<string>): Observable<EventFlow> {
    return this.lift(new EventFlowOperator(stopNotifier, allowTypeOnly));
}

declare module 'rxjs/Observable' {
    interface Observable<T> {
        controlledEventFlow: typeof controlledEventFlow;
    }
}

Observable.prototype.controlledEventFlow = controlledEventFlow;



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
        var pred = (<any>this.destination).predicate ? (<any>this.destination).predicate.toString() : "No predicate";
        stopNotifier
            .subscribe((v) => {
                console.log("flowStopper", pred, v);
                this.flowStopper = v;
                this.deliverNext();
            });
        allowTypeOnly
            .subscribe((v) => {
                console.log("allowType", (<any>this.destination).predicate, v);
                this.allowType = v
                this.deliverNext();
            });
    }

    protected _next(value: EventFlow) {
        this.buffer.push(value);
        this.deliverNext();
    }

    private deliverNext() {

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
        var ev = this.buffer.shift();
        console.log("deliverNext => ", ev.type, "=>", (<any>this.destination).predicate, "buffer[", this.buffer.length, "]");
        this.destination.next(ev);
    }
}

