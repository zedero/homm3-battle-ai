import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type State =
  | 'IDLE'
  | 'START'
  | 'ROUND.END'
  | 'ROUND.REQUEST.NEW'
  | 'NEXT.UNIT'
  | 'ENEMY.TURN'
  | 'ENEMY.END'
  | 'PLAYER.TURN'
  | 'PLAYER.SELECTED'
  | 'PLAYER.END';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  public state = new BehaviorSubject<string>('IDLE');

  constructor() {}

  public transition(newState: State) {
    console.log('CURRENT STATE: ', newState);
    this.state.next(newState);
  }
}
