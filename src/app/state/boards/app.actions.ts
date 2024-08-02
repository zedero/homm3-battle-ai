import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApplicationState, Board } from './app.state';
import { Card } from '../../config/data';

export const boardActions = createActionGroup({
  source: 'Boards',
  events: {
    testAction: emptyProps(),
    loadAppData: emptyProps(),
    loadAppDataSuccess: props<{ data: ApplicationState }>(),
    saveAppData: props<{ data: ApplicationState }>(),
    move: props<{ guid: string }>(),
    moveCard: props<{ guid: string; x: number; y: number; cardGuid: string }>(),
    addCard: props<{ guid: string; card: Card }>(),
    removeCard: props<{ guid: string; cardGuid: string }>(),
    createNewBoard: emptyProps(),
    renameBoard: props<{ guid: string; text: string }>(),
    deleteBoard: props<{ guid: string }>(),
    selectBoard: props<{ guid: string }>(),
    isBattleActive: props<{ isActive: boolean }>(),
  },
});
