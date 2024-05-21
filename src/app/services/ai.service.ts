import { Injectable } from '@angular/core';
import { Card, TYPE } from '../config/data';
import * as pathfinding from 'pathfinding';

export type Target = {
  target: Card;
  path: any[];
};

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private gridSize = {
    x: 4, // x
    y: 5, // y
  };

  constructor() {}

  public getTargetToAttack(units: Card[], source: Card) {
    let attackTarget: Card | undefined;
    let moveTo: { x: number; y: number } | undefined;

    if (source.type === TYPE.RANGED) {
      attackTarget = this.getRangedTarget(units, source);
      moveTo = source.position;
    } else {
      const target: Target = this.getMeleeTarget(units, source);

      if (
        !target?.path ||
        target?.path.length > 5 ||
        target?.path.length === 0
      ) {
        attackTarget = undefined;
        if (target?.path && target?.path.length > 0) {
          moveTo = this.toPoint(target?.path[3]);
        }
      } else {
        attackTarget = target?.target;
        moveTo = this.toPoint(target?.path[target?.path.length - 2]);
      }
    }
    return {
      attackTarget,
      moveTo,
    };
  }

  toPoint(coor: number[]) {
    return { x: coor[0], y: coor[1] };
  }

  public prioritizeTargets(targets: Card[], source: Card) {
    // sort higher to lower
    targets.sort(this.sortByTier);
    // gat units of the same tier
    const sameTier = targets.filter((target) => target.tier === source.tier);
    const differentTier = targets.filter(
      (target) => target.tier !== source.tier,
    );
    const higherTier = differentTier
      .filter((target) => target.tier > source.tier)
      .sort(this.sortByTier);
    const lowerTier = differentTier.filter(
      (target) => target.tier < source.tier,
    );
    return [...sameTier, ...lowerTier, ...higherTier];
  }

  private getRangedTarget(units: Card[], source: Card) {
    const targets = units.filter((unit) => {
      return unit.isEnemy !== source.isEnemy;
    });
    const prioritizeTargets = this.prioritizeTargets(targets, source);
    const rangedTarget = prioritizeTargets.find(
      (target) => target.type === TYPE.RANGED,
    );
    return rangedTarget ? rangedTarget : prioritizeTargets[0];
  }

  private getMeleeTarget(units: Card[], source: Card) {
    const targets = units.filter((unit) => {
      return unit.isEnemy !== source.isEnemy;
    });
    const prioritizeTargets = this.prioritizeTargets(targets, source);

    const reachableTargets: Target[] = [];
    const justOutOfReachTargets: Target[] = [];

    prioritizeTargets.forEach((unit) => {
      const grid = this.getGrid(units);
      grid.setWalkableAt(unit.position.x, unit.position.y, true); // set target as walkable
      const finder = new pathfinding.BestFirstFinder();
      const path = finder.findPath(
        source.position.x,
        source.position.y,
        unit.position.x,
        unit.position.y,
        grid,
      );
      // need to check with 5 as the first and last cell is included even though thats contains an unit
      if (path.length !== 0 && path.length <= 5) {
        reachableTargets.push({
          target: unit,
          path,
        });
      } else if (path.length > 5) {
        justOutOfReachTargets.push({
          target: unit,
          path,
        });
      }
    });

    return reachableTargets.length !== 0
      ? reachableTargets[0]
      : justOutOfReachTargets[0];
  }
  private getFlyingTarget(units: Card[], source: Card) {
    this.getMeleeTarget(units, source);
  }

  private getGrid(units: Card[]) {
    const grid = new pathfinding.Grid(this.gridSize.x, this.gridSize.y);
    units.forEach((unit) => {
      grid.setWalkableAt(unit.position.x, unit.position.y, false);
    });
    return grid;
  }

  public sortByTier(a: Card, b: Card) {
    return a.tier - b.tier;
  }
  public sortByTierRev(a: Card, b: Card) {
    return b.tier - a.tier;
  }
}
