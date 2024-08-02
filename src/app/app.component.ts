import { OnInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState, Board } from './state/boards/app.state';
import { Observable, Subject } from 'rxjs';
import {
  getBoards,
  getCurrentBoard,
  getIfBattleActive,
} from './state/boards/app.selectors';
import { boardActions } from './state/boards/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  currentBoard$: Observable<Board | undefined> =
    this.store.select(getCurrentBoard);

  isBattleActive$: Observable<boolean> = this.store.select(getIfBattleActive);

  allBoard$: Observable<Board[] | undefined> = this.store.select(getBoards);

  createBoard() {
    this.store.dispatch(boardActions.createNewBoard());
  }

  selectBoard(guid: string) {
    this.store.dispatch(boardActions.selectBoard({ guid }));
  }

  deleteBoard(event: any, guid: string) {
    event.stopPropagation();
    this.store.dispatch(boardActions.deleteBoard({ guid }));
  }

  renameBoard(event: any, guid: string, alias: string) {
    event.stopPropagation();
    let text = prompt('Enter new name', alias);
    if (text) {
      this.store.dispatch(boardActions.renameBoard({ guid, text }));
    }
  }

  constructor(private store: Store<ApplicationState>) {}

  ngOnInit() {
    this.store.dispatch(boardActions.loadAppData());
  }
}
