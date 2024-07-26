// src/app/state/app.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ApplicationState } from './app.reducer';
import { CommonModule } from '@angular/common';

export const applicationState =
  createFeatureSelector<ApplicationState>('applicationStore');

export const selectTabs = createSelector(applicationState, (state) => state);
