import View, { IView } from './views/view';
import Fighter, { IFighter } from './fighter';
import { IFighterInfo } from './services/fightersService';

export interface IFight extends View {
	checkAndStart: (fighter: IFighterInfo) => void;
}

export default class Fight extends View implements IFight {
	private firstFighter: IFighter;
	private secondFighter: IFighter;
	private countActiveFighters: number = 0;

	constructor() {
		super();
	}

	checkAndStart(fighter: IFighterInfo): void {
		if (this.countActiveFighters === 0) {
			const f = new Fighter(fighter, false);
			this.firstFighter = f;
			this.countActiveFighters++;
		} else if (this.countActiveFighters === 1) {
			const f = new Fighter(fighter, true);
			this.secondFighter = f;
			this._start();
		}
	}

	private _fight(f1: IFighter, f2: IFighter): void {
		setInterval(() => {
			f1.doDamage(f2);

			let f = f1;
			f1 = f2;
			f2 = f;
		}, 1300);
	}

	private _start(firstFighter: IFighter = this.firstFighter, secondFighter: IFighter = this.secondFighter): void {
		const rootElement = document.getElementById('root') as HTMLDivElement;
		const fightersEl = document.getElementsByClassName('fighters')[0] as HTMLDivElement;
		fightersEl.style.display = 'none';
		const fightEl = this.createElement({ tagName: 'div', attributes: { id: 'fight' } });

		fightEl.style.display = 'flex';
		fightEl.appendChild(firstFighter.element);
		fightEl.appendChild(secondFighter.element);
		const title = this.createElement({ tagName: 'div', attributes: { id: 'title' } });
		title.innerHTML = 'Lets Go!';
		rootElement.appendChild(fightEl)
		rootElement.appendChild(title);

		this._fight(firstFighter, secondFighter);
	}
}
