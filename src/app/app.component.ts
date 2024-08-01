import { OnInit, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState, Board } from './state/boards/app.state';
import { Observable } from 'rxjs';
import { getBoards, getCurrentBoard } from './state/boards/app.selectors';
import { boardActions } from './state/boards/app.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<ApplicationState>) {}

  currentBoard$: Observable<Board | undefined> =
    this.store.select(getCurrentBoard);

  allBoard$: Observable<Board[] | undefined> = this.store.select(getBoards);
  ngOnInit() {
    this.store.dispatch(boardActions.loadAppData());
  }

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

  renameBoard(event: any, guid: string) {
    event.stopPropagation();
    let text = prompt('Enter new name');
    if (text) {
      this.store.dispatch(boardActions.renameBoard({ guid, text }));
    }
  }
}
