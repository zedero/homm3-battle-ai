import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from './app.state';

export const selectAppState =
  createFeatureSelector<ApplicationState>('appState');

export const selectBoards = createSelector(
  selectAppState,
  (state: ApplicationState) => state.boards,
);

export const selectSelectedBoardGuid = createSelector(
  selectAppState,
  (state: ApplicationState) => state.currentBoardGuid,
);

export const getBoards = createSelector(
  selectAppState,
  (state: ApplicationState) => {
    return state.boards;
  },
);

export const getCurrentBoard = createSelector(
  selectAppState,
  (state: ApplicationState) => {
    return state.boards.find((board) => board.guid === state.currentBoardGuid);
  },
);
