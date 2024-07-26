import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const boardActions = createActionGroup({
  source: 'Boards',
  events: {
    createNewBoard: emptyProps(),
    selectBoard: props<{ guid: string }>(),
  },
});
