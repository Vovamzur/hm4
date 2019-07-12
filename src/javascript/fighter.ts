import ActiveFighterView from './views/activeFighterView';
import { IFighterInfo } from './services/fightersService';
import { IActiveFighterView } from './views/activeFighterView';

const rand = (min: number, max: number): number => {
	return Math.random() * (max - min) + min;
}

export interface IFighter extends IActiveFighterView {
	health: number;
	getHitPower: () => number;
	getBlockPower: () => number;
	reloadHealthBar: () => void;
	doDamage: (figher: IFighter) => void;
}

export default class Fighter extends ActiveFighterView implements IFighter {
	health: number;
	private name: string;
	private attack: number;
	private defense: number;
	private source: string;
	private static readonly minCriticalHitChance = 1;
	private static readonly maxCriticalHitChance = 2;

	constructor(fighter: IFighterInfo, isRight: boolean) {
		super(fighter);

		const { name, health, attack, defense, source } = fighter;
		this.name = name;
		this.health = health;
		this.attack = attack;
		this.defense = defense;
		this.source = source;
		this.right = isRight;

		this.element.classList.add(this.right ? 'right' : 'left');
	}

	getHitPower(): number {
		const criticalHitChance = rand(Fighter.minCriticalHitChance, Fighter.maxCriticalHitChance);
		const power = this.attack * criticalHitChance;

		return power;
	}

	getBlockPower(): number {
		const dodgeChance = rand(Fighter.minCriticalHitChance, Fighter.maxCriticalHitChance);
		const power = this.defense * dodgeChance;

		return power;
	}

	reloadHealthBar(): void {
		this.healthBar.value = this.health;
	}

	doDamage(fighter: IFighter): void {
		const hitPower = this.getHitPower();
		const blockPower = fighter.getBlockPower();
		const damage = hitPower - blockPower;

		if (damage > 0) {
			this._setTitle('Hit!');
			this.hit();
			fighter.block();
			const leftHealth = fighter.health - damage;
			if (leftHealth < 0) {
				alert(`${this.name} win`);
				window.location.reload()
			} else {
				fighter.health = leftHealth;
				fighter.reloadHealthBar();
			}
		} else {
			this._setTitle('Dodge!');
			this.hit();
			fighter.dodge();
		}
	}

	private _setTitle(text: string): void {
		const title = document.getElementById('title');
		title.innerHTML = text;
		setTimeout(() => title.innerHTML = '', 700);
	}
}
