import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleBoardComponent } from './battle-board.component';

describe('BattleBoardComponent', () => {
  let component: BattleBoardComponent;
  let fixture: ComponentFixture<BattleBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BattleBoardComponent]
    });
    fixture = TestBed.createComponent(BattleBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
