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
}
