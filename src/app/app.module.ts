import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgFor, NgForOf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { BattleBoardComponent } from './components/battle-board/battle-board.component';
import { CardComponent } from './components/card/card.component';
import { LineComponent } from './components/line/line.component';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DefaultIfNullPipe } from './services/defaultIfNull';
import { StoreModule } from '@ngrx/store';
import { appReducer } from './state/boards/app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    BattleBoardComponent,
    CardComponent,
    LineComponent,
  ],
  imports: [
    StoreModule.forRoot({ appState: appReducer }),
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    MatFormFieldModule,
    NgFor,
    NgForOf,
    MatInputModule,
    FormsModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSliderModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    CdkDrag,
    DefaultIfNullPipe,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
