import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Card } from '../../config/data';

export type MoveCard = {
  card: Card;
  position: {
    x: number;
    y: number;
  };
};

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnChanges {
  @Input() public card!: Card | undefined;
  @Input() public highlighted!: string[];
  @Input() public state!: string;
  @Output() public move = new EventEmitter<MoveCard>();
  @Output() public deleteCard = new EventEmitter<Card>();
  @Output() public useCard = new EventEmitter<Card>();
  protected _card!: Card;

  isHighlighted = false;
  isEnemy = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card']) {
      if (this.card) {
        this._card = this.card;
        this.isEnemy = this._card.isEnemy;
      }
    }
    if (changes['highlighted']) {
      this.isHighlighted = false;
      this.highlighted.forEach((unit) => {
        if (unit === this._card.name) {
          this.isHighlighted = true;
        }
      });
    }
  }

  public snap(event: any) {
    const collisionElements = document.elementsFromPoint(
      event.event.clientX,
      event.event.clientY,
    );

    const target = collisionElements.find((element: Element) => {
      return element.className === 'battle-map_cell';
    });

    if (!target?.id) {
      return;
    }
    // this.snapToCell(target.id);

    const pos = target.id.split('.').map((a) => {
      return Number(a);
    });
    this.move.emit({
      card: this._card,
      position: { x: pos[0], y: pos[1] },
    });
  }

  delete() {
    this.deleteCard.emit(this._card);
  }

  use() {
    this.useCard.emit(this._card);
  }
}
