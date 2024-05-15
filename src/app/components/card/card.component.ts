import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Card} from "../../config/data";

export type MoveCard = {
  card: Card,
  position: {
    row: number,
    cell: number
  }
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnChanges {
  @Input() public card!: Card | undefined;
  @Output() public move = new EventEmitter<MoveCard>();
  protected _card!: Card;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['card'] ) {
      if ( this.card ) {
        this._card = this.card;
      }
    }
  }

  public snap(event: any) {
    const collisionElements = document.elementsFromPoint(event.event.clientX, event.event.clientY);

    const target = collisionElements.find((element: Element) => {
      return element.className === "battle-map_cell";
    });

    if (!target?.id) {
      return
    }
    // this.snapToCell(target.id);

    const pos = target.id.split('.').map((a)=>{return Number(a)});
    this.move.emit({card: this._card, position: {row: pos[0], cell: pos[1]}})
  }


}
