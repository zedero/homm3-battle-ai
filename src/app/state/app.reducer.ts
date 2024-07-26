import { ActionReducer, createReducer, on, State } from '@ngrx/store';
import { increment, decrement, reset, count } from './app.actions';

export interface ApplicationState {
  tabs: Array<any>;
  count: number;
}

export const initialState: ApplicationState = {
  tabs: [
    {
      test: 'test',
      wow: 1,
    },
  ],
  count: 1,
};

export const appReducer: ActionReducer<ApplicationState> = createReducer(
  initialState,
  on(increment, (state) => {
    return { ...state, count: state.count + 1 };
  }),
  // on(increment, (state) => {}),
  // on(decrement, (state) => state - 1),
  // on(count, (state) => {
  //   return { ...state, count: state.count + 1 };
  // }),
);
