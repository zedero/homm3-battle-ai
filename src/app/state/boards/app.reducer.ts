import { ActionReducer, createReducer, on, State } from '@ngrx/store';
import { ApplicationState } from './app.state';
import { TIER, TYPE } from '../../config/data';
import { boardActions } from './app.actions';

export const generateGuid = () => {
  let result, i, j;
  result = '';
  for (j = 0; j < 32; j++) {
    if (j == 8 || j == 12 || j == 16 || j == 20) result = result + '-';
    i = Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase();
    result = result + i;
  }
  return result;
};

export const initialState: ApplicationState = {
  boards: [
    {
      guid: '0000001',
      alias: 'TestAlias',
      placedCards: [
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Skeletons',
          type: TYPE.MELEE,
          canTeleport: false,
          isEnemy: true,
          position: {
            x: 0,
            y: 1,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Halberdiers',
          type: TYPE.MELEE,
          canTeleport: false,
          isEnemy: false,
          position: {
            x: 0,
            y: 3,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Zombies',
          type: TYPE.MELEE,
          canTeleport: false,
          isEnemy: true,
          position: {
            x: 1,
            y: 1,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Wraiths',
          type: TYPE.MELEE,
          canTeleport: false,
          isEnemy: true,
          position: {
            x: 2,
            y: 1,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Griffins',
          type: TYPE.MELEE,
          canTeleport: false,
          isEnemy: false,
          position: {
            x: 1,
            y: 3,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.BRONZE,
          initiative: 4,
          name: 'Marksmen',
          type: TYPE.RANGED,
          canTeleport: false,
          isEnemy: false,
          position: {
            x: 0,
            y: 4,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.SILVER,
          initiative: 6,
          name: 'Monks',
          type: TYPE.RANGED,
          canTeleport: false,
          isEnemy: false,
          position: {
            x: 1,
            y: 4,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.SILVER,
          initiative: 5,
          name: 'Liches',
          type: TYPE.RANGED,
          canTeleport: false,
          isEnemy: true,
          position: {
            x: 0,
            y: 0,
          },
        },
        {
          guid: generateGuid(),
          tier: TIER.GOLD,
          initiative: 7,
          name: 'Arch Angels',
          type: TYPE.FLYING,
          canTeleport: false,
          isEnemy: false,
          position: {
            x: 2,
            y: 3,
          },
        },
      ],
      playerBenchedCards: [],
      enemyBenchedCards: [],
    },
  ],
  currentBoardGuid: '0000001',
  battleStarted: false,
};

export const appReducer: ActionReducer<ApplicationState> = createReducer(
  initialState,
  on(boardActions.selectBoard, (state, { guid }) => {
    return {
      ...state,
      currentBoardGuid: guid,
    };
  }),
  on(boardActions.loadAppDataSuccess, (state, { data }) => {
    return {
      ...state,
      ...data,
    };
  }),
  on(boardActions.addCard, (state, { guid, card }) => {
    return {
      ...state,
      boards: state.boards.map((board) => {
        if (board.guid === state.currentBoardGuid) {
          return {
            ...board,
            placedCards: [...board.placedCards, card],
          };
        }
        return board;
      }),
    };
  }),
  on(boardActions.isBattleActive, (state, { isActive }) => {
    return {
      ...state,
      battleStarted: isActive,
    };
  }),
  on(boardActions.createNewBoard, (state) => {
    const guid = generateGuid();
    return {
      ...state,
      currentBoardGuid: guid,
      boards: [
        ...state.boards,
        {
          guid,
          alias: 'Player board - ' + (state.boards.length + 1),
          placedCards: [],
          playerBenchedCards: [],
          enemyBenchedCards: [],
        },
      ],
    };
  }),
  on(boardActions.renameBoard, (state, { guid, text }) => {
    return {
      ...state,
      boards: state.boards.map((board) => {
        if (board.guid === guid) {
          return {
            ...board,
            alias: text,
          };
        }
        return board;
      }),
    };
  }),
  on(boardActions.deleteBoard, (state, { guid }) => {
    const otherBoards = state.boards.filter((board) => board.guid !== guid);
    const newSelectedBoard =
      state.currentBoardGuid !== guid
        ? state.currentBoardGuid
        : otherBoards.length > 0
          ? otherBoards[0].guid
          : '';
    return {
      ...state,
      boards: state.boards.filter((board) => board.guid !== guid),
      currentBoardGuid: newSelectedBoard,
    };
  }),
  on(boardActions.moveCard, (state, { guid, x, y, cardGuid }) => {
    return {
      ...state,
      boards: state.boards.map((board) => {
        if (board.guid === state.currentBoardGuid) {
          return {
            ...board,
            placedCards: board.placedCards.map((card) => {
              if (card.guid === cardGuid) {
                return {
                  ...card,
                  position: {
                    x,
                    y,
                  },
                };
              }
              return card;
            }),
          };
        }
        return board;
      }),
    };
  }),
  on(boardActions.removeCard, (state, { guid, cardGuid }) => {
    return {
      ...state,
      boards: state.boards.map((board) => {
        if (board.guid === state.currentBoardGuid) {
          return {
            ...board,
            placedCards: board.placedCards.filter(
              (card) => card.guid !== cardGuid,
            ),
          };
        }
        return board;
      }),
    };
  }),
);
