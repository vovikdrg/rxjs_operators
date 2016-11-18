import { EventsService } from './events.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DisplayFirstTypeComponent } from './display-first-type/display-first-type.component';
import { DisplaySecondTypeComponent } from './display-second-type/display-second-type.component';

@NgModule({
  declarations: [
    AppComponent,
    DisplayFirstTypeComponent,
    DisplaySecondTypeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
