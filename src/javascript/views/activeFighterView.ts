import FighterView, { IFighterView } from './fighterView';
import { IFighterInfo } from './../services/fightersService'

export interface IActiveFighterView extends IFighterView {
	hit: () => void;
	block: () => void;
	dodge: () => void;
}

export default abstract class ActiveFighterView extends FighterView implements IActiveFighterView {
	protected healthBar: HTMLProgressElement;
	protected right: boolean;

	constructor(fighter: IFighterInfo, handleClick: null = null) {
		super(fighter, handleClick);

		this.element.removeChild(this.element.lastChild);
		this.healthBar = this._createHealthBar(fighter.health);
		this.element.appendChild(this.healthBar);
		this.right = true;
	}

	private _createHealthBar(health: number) : HTMLProgressElement {
		const healthElement = this.createElement({ tagName: 'progress' }) as HTMLProgressElement;
		healthElement.value = health;
		healthElement.max = 100;

		return healthElement;
	}

	private _applyAnimation(name: string, mill: number): void {
		this.element.classList.add(name, 'move');
		setTimeout(() => this.element.classList.remove(name, 'move'), mill);
	}

	hit(): void {
		this._applyAnimation(`attack-${this.right ? 'left' : 'right'}`, 1000);
	}

	block(): void {
		this._applyAnimation('defence', 700)
	}

	dodge(): void {
		this._applyAnimation(`dodge-${this.right ? 'right' : 'left'}`, 1000);
	}
}
