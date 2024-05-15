import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public state = new BehaviorSubject<string>('IDLE');

  constructor() {

  }

  public transition(newState: string) {
    console.log('NEW STATE: ', newState)
    this.state.next(newState);
  }


}
