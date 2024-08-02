import { Card } from '../../config/data';

export type Board = {
  guid: string;
  alias: string;
  placedCards: Card[];
  playerBenchedCards: Card[];
  enemyBenchedCards: Card[];
};

export interface ApplicationState {
  boards: Board[];
  currentBoardGuid: string | undefined;
  battleStarted: boolean;
  /*
    This is a version of the store to handle migrations.
    Taking example 1.2,
    the first number is the breaking version, if updated, the store will be reset.
    The second number is the minor version, usually this is either an addition or
    removal of store entries, the store can and will be migrated.
  */
  storeVersion: string;
}
