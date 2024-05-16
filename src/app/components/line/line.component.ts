import {
  Component,
  Input,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';

export type Point = {
  x: number;
  y: number;
};

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnChanges {
  @Input() source: Point = { x: 2, y: 3 };
  @Input() target: Point = { x: 0, y: 1 };
  @Input() isAttack: Boolean = false;

  public top = 0;
  public left = 0;
  public length = 0;
  public orientation = 0;

  private width = 120;
  private height = 100;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['source'] || changes['target']) {
      this.calculateLine(
        {
          x: this.source.x * this.height,
          y: this.source.y * this.width,
        },
        {
          x: this.target.x * this.height,
          y: this.target.y * this.width,
        },
      );
    }
  }

  calculateLine(point1: Point, point2: Point) {
    let dx = point2.x - point1.x;
    let dy = point2.y - point1.y;

    let length = Math.sqrt(dx * dx + dy * dy);

    let orientation = (Math.atan2(dy, dx) * 180) / Math.PI;

    if (orientation < 0) {
      orientation += 360;
    }

    this.length = length;
    this.orientation = orientation;
    this.top = point1.y + 60;
    this.left = point1.x + 50;
  }
}
