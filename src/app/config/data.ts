import { DUNGEON } from './dungeon';
import { CASTLE } from './castle';
import { NECROPOLIS } from './necropolis';
import { NEUTRAL } from './neutral';
import { TOWER } from './tower';
import { RAMPART } from './rampart';
import { FORTRESS } from './fortress';
import { INFERNO } from './inferno';

export enum TIER {
  'BRONZE',
  'SILVER',
  'GOLD',
  'AZURE',
}

export const TierName = {
  Bronze: TIER.BRONZE,
  Silver: TIER.SILVER,
  Gold: TIER.GOLD,
  Azure: TIER.AZURE,
};

export enum TYPE {
  MELEE,
  RANGED,
  FLYING,
}

export type Card = {
  guid: string;
  tier: TIER;
  initiative: number;
  name: string;
  type: TYPE;
  canTeleport: boolean;
  isEnemy: boolean;
  position: {
    x: number;
    y: number;
  };
};

export type Unit = {
  id: string;
  attack: number;
  defence: number;
  health: number;
  initiative: number;
  ranged: boolean;
  special: number[];
  upgradeFrom: string;
  costs: [number, number];
  faction: string;
  tier: string;
};

export const UNITS: Unit[] = [
  ...DUNGEON,
  ...CASTLE,
  ...NECROPOLIS,
  ...TOWER,
  ...RAMPART,
  ...FORTRESS,
  ...INFERNO,
  ...NEUTRAL,
];
