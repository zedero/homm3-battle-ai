import {Component, OnInit} from '@angular/core';
import {FormControl} from "@angular/forms";
import {BehaviorSubject, map, Observable, startWith} from "rxjs";
import {Card, TIER, TYPE, Unit, UNITS} from "../../config/data";
import {Point} from "../line/line.component";
import {MoveCard} from "../card/card.component";
import {StateService} from "../../services/state.service";



export type Line = {
  source: Point,
  target: Point,
}

export type GameState = {
  isPlayerTurn: boolean,
  cardQueue: Card[]
}

@Component({
  selector: 'app-battle-board',
  templateUrl: './battle-board.component.html',
  styleUrls: ['./battle-board.component.scss']
})
export class BattleBoardComponent  implements OnInit {
  public state$: BehaviorSubject<string>;
  public state: StateService;


  constructor(state: StateService) {
    this.state$ = state.state;
    this.state = state;
  }

  moveLine: Line = {
    source:  {x: 0, y: 0},
    target:  {x: 0, y: 0},
  }

  turnState: GameState = {
    isPlayerTurn: true,
    cardQueue: [],
  }


  rows = [0,1,2,3,4]
  cells  = [0,1,2,3]

  placedCards: Card[] = [{
    tier: TIER.BRONZE,
    initiative: 4,
    name: 'Skeletons',
    type: TYPE.MELEE,
    canTeleport: false,
    isEnemy: true,
    position: {
      row: 1,
      cell: 0
    }
  },{
    tier: TIER.BRONZE,
    initiative: 4,
    name: 'Halberdiers',
    type: TYPE.MELEE,
    canTeleport: false,
    isEnemy: false,
    position: {
      row: 3,
      cell: 0
    }
  },{
    tier: TIER.BRONZE,
    initiative: 5,
    name: 'Zombies',
    type: TYPE.MELEE,
    canTeleport: false,
    isEnemy: true,
    position: {
      row: 1,
      cell: 1
    }
  },{
    tier: TIER.BRONZE,
    initiative: 4,
    name: 'Griffins',
    type: TYPE.MELEE,
    canTeleport: false,
    isEnemy: false,
    position: {
      row: 3,
      cell: 1
    }
  },{
    tier: TIER.BRONZE,
    initiative: 4,
    name: 'Marksmen',
    type: TYPE.MELEE,
    canTeleport: false,
    isEnemy: false,
    position: {
      row: 3,
      cell: 2
    }
  }];

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
      map(value => this.unitFilter(value || '')),
    );

    this.filteredUnitBOptions = this.unitBControl.valueChanges.pipe(
      startWith(''),
      map(value => this.unitFilter(value || '')),
    );

    this.state$.subscribe((state) => {
      if (state === 'START') {
        this.startBattle();
      }
      if (state === 'BATTLE') {
        this.nextMove();
      }
    });

  }

  private unitFilter(value: string): Unit[] {
    const filterValue = value.toLowerCase();
    return this.units.filter(option => option.id.toLowerCase().includes(filterValue)).sort((a: Unit,b:Unit) => {
      if (a.id.toLowerCase() < b.id.toLowerCase()) {
        return -1;
      }
      return 0;
    });
  }



  public fromName(name: string | null) {
    if (name) {
      return name.toUpperCase().replace(/ /g, "_").replace(/_\*/g, " *");
    }
    return null;
  }

  public name(id: string) {
    return (id.charAt(0) + id.slice(1).toLowerCase()).replace(/_/g, " ")
  }

  public isCardPresent(row: number, cell: number): boolean {
    return !!this.placedCards.find(card => card.position.row === row && card.position.cell === cell);
  }

  public getCard(row: number, cell: number): Card | undefined {
    return this.placedCards.find(card => card.position.row === row && card.position.cell === cell);
  }

  public moveCard(movedCard: MoveCard) {
    const card = this.placedCards.find(card => card.name === movedCard.card.name);
    if (!card) {
      return;
    }
    card.position.row = movedCard.position.row;
    card.position.cell = movedCard.position.cell;
  }



  startBattle() {
    const battleCards = JSON.parse(JSON.stringify(this.placedCards));
    this.shuffleArray(battleCards);
    this.turnState = {
      isPlayerTurn: true,
      cardQueue: battleCards
    }
    // this.test(battleCards);
    this.state.transition('BATTLE');
  }

  getNextHighestInitiative(cards: Card[]) {
    const initiatives = new Set(cards.map((card: Card) => card.initiative));
    return Array.from(initiatives).sort().reverse()[0];
  }


  nextMove() {
    if (this.turnState.cardQueue.length === 0) {
      console.log('Game Over');
      return
    }

    const currentInitiative = this.getNextHighestInitiative(this.turnState.cardQueue);
    const removeCardFromQueue = (cardToRemove: Card) => {
      console.log('@@', cardToRemove.name)
      this.turnState.cardQueue = this.turnState.cardQueue.filter((card: Card) => card.name !== cardToRemove.name);
    }


    const possibleCards = this.turnState.cardQueue.filter((card: Card) => {
      return card.initiative === currentInitiative
    });

    if (this.turnState.isPlayerTurn && !!possibleCards.filter((card: Card) => {
      return !card.isEnemy
    }).length) {
      this.state.transition('PLAYER');
      removeCardFromQueue(possibleCards.filter((card: Card) => {
        return !card.isEnemy
      })[0]);
    } else if (!!possibleCards.filter((card: Card) => {
      return card.isEnemy
    }).length) {
      const card = possibleCards.filter((card: Card) => {
        return card.isEnemy
      })[0]
      this.state.transition('ENEMY');
      removeCardFromQueue(card);
      this.moveLine = {
        source: {x: card.position.cell, y: card.position.row},
        target: {x: Math.floor(Math.random() * 4), y: Math.floor(Math.random() * 4)},
      }
    } else {
      this.state.transition('PLAYER');
      removeCardFromQueue(possibleCards.filter((card: Card) => {
        return !card.isEnemy
      })[0]);
    }

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


  test(battleCards: any) {
    const source = battleCards.find((unit: any) => !unit.isEnemy);
    const target = battleCards.find((unit: any) => unit.isEnemy);
    if (!source || !target) {
      return;
    }
    this.moveLine = {
      source: {x: source.position.cell, y: source.position.row},
      target: {x: target.position.cell, y: target.position.row},
    }
  }

  removeCardFromGame = (cardToRemove: Card) => {
    console.log('@@', cardToRemove.name)
    this.turnState.cardQueue = this.turnState.cardQueue.filter((card: Card) => card.name !== cardToRemove.name);
    this.placedCards = this.placedCards.filter((card: Card) => card.name !== cardToRemove.name);
  }

}
