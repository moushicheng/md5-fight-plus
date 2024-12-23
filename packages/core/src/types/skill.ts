import { PlayerInstanceProperty, PlayerRuntimeProperty } from "./player";
export type Skill = {
  name: string;
  mana: number;
  description: string;
  run: (player: PlayerInstanceProperty) => void;
  type: string[];
  runtimeProperty?: {
    mana?: number;
    type?: string[];
  };
};
