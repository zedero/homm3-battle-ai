import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  signal,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { Card, TIER, TierName, TYPE, Unit, UNITS } from '../../config/data';
import { Point } from '../line/line.component';
import { MoveCard } from '../card/card.component';
import { StateService } from '../../services/state.service';
import { AiService } from 'src/app/services/ai.service';
import { SPECIALS } from '../../config/specials';
import { Board } from '../../state/boards/app.state';

export type Line = {
  source: Point;
  target: Point;
};

export type GameState = {
  lastInitiative: number;
  isPlayerTurn: boolean;
  cardQueue: Card[];
};

@Component({
  selector: 'app-battle-board',
  templateUrl: './battle-board.component.html',
  styleUrls: ['./battle-board.component.scss'],
})
export class BattleBoardComponent implements OnInit, OnChanges {
  public state$: BehaviorSubject<string>;
  public highlightedUnits$: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);
  public state: StateService;
  public aiService: AiService;
  public selectedPlayerCard: Card | undefined = undefined;
  @Input() public boardData: Board | undefined;
  placedCards: Card[] = [];

  test = signal(0);

  constructor(state: StateService, aiService: AiService) {
    this.state$ = state.state;
    this.state = state;
    this.aiService = aiService;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['boardData']) {
      this.placedCards = changes['boardData'].currentValue.placedCards;
    }
    // this.placedCards = changes.boardData.currentValue.pl
  }

  moveLine: Line = {
    source: { x: -1, y: -1 },
    target: { x: -1, y: -1 },
  };

  attackLine: Line = {
    source: { x: -1, y: -1 },
    target: { x: -1, y: -1 },
  };

  turnState: GameState = {
    lastInitiative: -1,
    isPlayerTurn: true,
    cardQueue: [],
  };

  rows = [0, 1, 2, 3, 4];
  cells = [0, 1, 2, 3];

  enemyUnplacedCards: Card[] = [];
  playerUnplacedCards: Card[] = [];

  unitAControl = new FormControl('');
  // @ts-ignore
  filteredUnitAOptions: Observable<any[]>;

  unitBControl = new FormControl('');
  // @ts-ignore
  filteredUnitBOptions: Observable<any[]>;

  // @ViewChild(MatSort) sort: MatSort;

  public units: Unit[] = UNITS.map((unit) => {
    // unit.special = []
    return unit;
  });

  ngOnInit() {
    this.filteredUnitAOptions = this.unitAControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.unitFilter(value || '')),
    );

    this.filteredUnitBOptions = this.unitBControl.valueChanges.pipe(
      startWith(''),
      map((value) => this.unitFilter(value || '')),
    );

    this.state$.subscribe((state) => {
      if (state === 'IDLE') {
        this.highlightedUnits$.next([]);
      }
      if (state === 'PLAYER.END') {
        this.state.transition('NEXT.UNIT');
      }
      if (state === 'ROUND.END') {
        this.state.transition('ROUND.REQUEST.NEW');
      }
      if (state === 'START') {
        this.startBattle();
      }
      if (state === 'NEXT.UNIT') {
        this.nextMove();
      }
      if (state === 'ENEMY.END') {
        this.nextMove();
      }
    });
  }

  private unitFilter(value: string): Unit[] {
    const filterValue = value.toLowerCase();
    return this.units
      .filter((option) => option.id.toLowerCase().includes(filterValue))
      .sort((a: Unit, b: Unit) => {
        if (a.id.toLowerCase() < b.id.toLowerCase()) {
          return -1;
        }
        return 0;
      });
  }

  public fromName(name: string | null) {
    if (name) {
      return name.toUpperCase().replace(/ /g, '_').replace(/_\*/g, ' *');
    }
    return null;
  }

  public name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace(/_/g, ' ');
  }

  public isCardPresent(x: number, y: number): boolean {
    return !!this.placedCards.find(
      (card) => card.position.x === x && card.position.y === y,
    );
  }

  public getCard(x: number, y: number): Card | undefined {
    return this.placedCards.find(
      (card) => card.position.x === x && card.position.y === y,
    );
  }

  public moveCardOnBoard(newCard: MoveCard) {
    newCard.card.position.x = newCard.position.x;
    newCard.card.position.y = newCard.position.y;

    const occupiedByCard = this.placedCards.find(
      (card) =>
        card.position.x === newCard.position.x &&
        card.position.y === newCard.position.y,
    );
    if (!newCard || occupiedByCard) {
      return;
    }

    this.placedCards.push(newCard.card);
    if (newCard.card.isEnemy) {
      this.removeEnemyUnplacedCard(newCard.card);
    } else {
      this.removePlayerUnplacedCard(newCard.card);
    }
  }

  public moveCard(movedCard: MoveCard) {
    // console.log('! MOVE', movedCard.card.name, movedCard.position.row, movedCard.position.cell)
    const card = this.placedCards.find(
      (card) => card.name === movedCard.card.name,
    );

    const occupiedByCard = this.placedCards.find(
      (card) =>
        card.position.x === movedCard.position.x &&
        card.position.y === movedCard.position.y,
    );

    if (!card || occupiedByCard) {
      return;
    }

    card.position.x = movedCard.position.x;
    card.position.y = movedCard.position.y;
  }

  public newRound(newRound: boolean) {
    if (newRound) {
      this.state.transition('START');
    } else {
      this.state.transition('IDLE');
    }
  }

  public useCard(useCard: Card | undefined) {
    if (!useCard) {
      return;
    }
    this.removeCardFromQueue(useCard);
    this.selectedPlayerCard = undefined;
    this.state.transition('PLAYER.END');
  }
  public selectCard(selectCard: Card | undefined) {
    this.selectedPlayerCard = selectCard;
    this.state.transition('PLAYER.SELECTED');
  }

  public endEnemyTurn() {
    this.state.transition('ENEMY.END');
  }

  startBattle() {
    const battleCards = JSON.parse(JSON.stringify(this.placedCards));
    this.shuffleArray(battleCards);
    this.turnState = {
      lastInitiative: -1,
      isPlayerTurn: true,
      cardQueue: battleCards,
    };
    this.state.transition('NEXT.UNIT');
  }

  getNextHighestInitiative(cards: Card[]) {
    const initiatives = new Set(cards.map((card: Card) => card.initiative));
    return Array.from(initiatives)
      .sort((a, b) => a - b)
      .reverse()[0];
  }

  removeCardFromQueue = (cardToRemove: Card) => {
    // console.log('@@', cardToRemove.name);
    this.turnState.cardQueue = this.turnState.cardQueue.filter(
      (card: Card) => card.name !== cardToRemove.name,
    );
  };

  nextMove() {
    // reset lines and highlighted units
    this.highlightedUnits$.next([]);

    this.moveLine = {
      source: { x: -1, y: -1 },
      target: { x: -1, y: -1 },
    };
    this.attackLine = {
      source: { x: -1, y: -1 },
      target: { x: -1, y: -1 },
    };

    // check if the queue is empty
    if (this.turnState.cardQueue.length === 0) {
      this.state.transition('ROUND.END');
      return;
    }

    const currentInitiative = this.getNextHighestInitiative(
      this.turnState.cardQueue,
    );

    if (currentInitiative !== this.turnState.lastInitiative) {
      this.turnState.isPlayerTurn = true;
    }
    this.turnState.lastInitiative = currentInitiative;

    const removeCardFromQueue = (cardToRemove: Card) => {
      this.turnState.cardQueue = this.turnState.cardQueue.filter(
        (card: Card) => card.name !== cardToRemove.name,
      );
    };

    const moveEnemyCard = (card: Card, pos: Point) => {
      removeCardFromQueue(card);
      this.moveLine = {
        source: { x: card.position.x, y: card.position.y },
        target: pos,
      };
      this.moveCard({
        card,
        position: pos,
      });
    };

    const possibleCards = this.turnState.cardQueue.filter((card: Card) => {
      return card.initiative === currentInitiative;
    });

    if (
      this.turnState.isPlayerTurn &&
      !!possibleCards.filter((card: Card) => {
        return !card.isEnemy;
      }).length
    ) {
      this.state.transition('PLAYER.TURN');
      // removeCardFromQueue(possibleCards.filter((card: Card) => {
      //   return !card.isEnemy
      // })[0]);
      const possibleUnits = possibleCards.filter((card: Card) => {
        return !card.isEnemy;
      });
      this.highlightedUnits$.next(
        possibleUnits ? possibleUnits.map((unit) => unit.name) : [],
      );
    } else if (
      !!possibleCards.filter((card: Card) => {
        return card.isEnemy;
      }).length
    ) {
      this.state.transition('ENEMY.TURN');
      const card = possibleCards.filter((card: Card) => {
        return card.isEnemy;
      })[0];
      const data = this.aiService.getTargetToAttack(this.placedCards, card);
      if (data.moveTo && data.attackTarget) {
        moveEnemyCard(card, data.moveTo);
        this.attackLine = {
          source: data.moveTo,
          target: data.attackTarget?.position,
        };
      } else if (data.moveTo) {
        moveEnemyCard(card, data.moveTo);
      } else {
        removeCardFromQueue(card);
        console.log('UNIT COULD NOT MOVE OR ATTACK:', card.name);
        this.state.transition('ENEMY.END');
      }
    } else {
      this.state.transition('PLAYER.TURN');
      const possibleUnits = possibleCards.filter((card: Card) => {
        return !card.isEnemy;
      });
      this.highlightedUnits$.next(
        possibleUnits ? possibleUnits.map((unit) => unit.name) : [],
      );
    }
    // console.log('##', this.state$.value);
    this.turnState.isPlayerTurn = !this.turnState.isPlayerTurn;

    // this.turnState

    // get card with the highest initiative
    // console.log(initiatives[0], possibleCards, battleCards)

    // if turns out to be players unit turn, highlight the cards that can be moved
    // else if its the enemies turn, move the card with the highest initiative
  }

  shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  removeCardFromGame = (cardToRemove: Card) => {
    // console.log('@@', cardToRemove.name);
    this.turnState.cardQueue = this.turnState.cardQueue.filter(
      (card: Card) => card.name !== cardToRemove.name,
    );
    this.placedCards = this.placedCards.filter(
      (card: Card) => card.name !== cardToRemove.name,
    );
  };

  removeEnemyUnplacedCard = (cardToRemove: Card) => {
    this.enemyUnplacedCards = this.enemyUnplacedCards.filter(
      (card: Card) => card.name !== cardToRemove.name,
    );
  };

  removePlayerUnplacedCard = (cardToRemove: Card) => {
    this.playerUnplacedCards = this.playerUnplacedCards.filter(
      (card: Card) => card.name !== cardToRemove.name,
    );
  };

  getTier = (tier: string) => {
    // @ts-ignore
    return TierName[tier][0];
  };

  getUnitType = (tier: string) => {
    // @ts-ignore
    return TYPE[tier];
  };

  private hasSkill(unit: Unit, skill: number) {
    return unit.special.find((special) => special === skill) !== undefined;
  }

  addEnemyUnplacedCard(option: any) {
    const id = this.fromName(option.option.value);
    const card = UNITS.find((unit) => unit.id === id);

    if (!card) {
      return;
    }
    // clear autocomplete input
    this.unitAControl.setValue('');

    // console.log(this.unitAControl);

    this.enemyUnplacedCards.push({
      tier: this.getTier(card.tier),
      initiative: card.initiative,
      name: option.option.value,
      type: card.ranged ? TYPE.RANGED : TYPE.MELEE,
      canTeleport: this.hasSkill(card, SPECIALS.TELEPORT),
      isEnemy: true,
      position: {
        x: -1,
        y: -1,
      },
    });
  }

  addPlayerUnplacedCard(option: any) {
    const id = this.fromName(option.option.value);
    const card = UNITS.find((unit) => unit.id === id);

    if (!card) {
      return;
    }
    // clear autocomplete input
    this.unitBControl.setValue('');

    // console.log(this.unitAControl);

    this.playerUnplacedCards.push({
      tier: this.getTier(card.tier),
      initiative: card.initiative,
      name: option.option.value,
      type: card.ranged ? TYPE.RANGED : TYPE.MELEE,
      canTeleport: this.hasSkill(card, SPECIALS.TELEPORT),
      isEnemy: false,
      position: {
        x: -1,
        y: -1,
      },
    });
  }
}
