import { Actions, createEffect, ofType } from '@ngrx/effects';
import { boardActions } from './app.actions';
import { tap, withLatestFrom } from 'rxjs';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ApplicationState } from './app.state';
import { selectAppState } from './app.selectors';

@Injectable()
export class AppEffects {
  moveCardEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          boardActions.createNewBoard,
          boardActions.selectBoard,
          boardActions.deleteBoard,
          boardActions.addCard,
          boardActions.moveCard,
          boardActions.removeCard,
          boardActions.renameBoard,
        ),
        withLatestFrom(this.store.select(selectAppState)),
        tap(([, store]) => {
          console.log('State updated');
          this.saveAppData(store);
        }),
      ),
    { dispatch: false },
  );
  removeCardEffect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(boardActions.removeCard),
        tap(({ cardGuid }) =>
          console.log(`Removed card with guid: ${cardGuid}`),
        ),
      ),
    { dispatch: false },
  );
  LoadDataEffect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(boardActions.loadAppData),
        tap(() => this.loadAppData()),
      ),
    { dispatch: false },
  );

  //TODO should be moved to a service

  storeageKey = 'HoMM3BoardgameAIAppData';
  saveAppData = (data: ApplicationState) => {
    localStorage.setItem(this.storeageKey, JSON.stringify(data));
  };

  loadAppData = () => {
    const data = localStorage.getItem(this.storeageKey);
    if (data) {
      this.store.dispatch(
        boardActions.loadAppDataSuccess({ data: JSON.parse(data) }),
      );
    }
  };

  constructor(
    private actions$: Actions,
    private store: Store<ApplicationState>,
  ) {}
}
