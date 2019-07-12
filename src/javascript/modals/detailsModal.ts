import View, { IView } from './../views/view';
import { IFighterInfo } from './../services/fightersService';

export interface IDetailsModal extends IView {
	container: HTMLDivElement;
	show: (fighterInfoPromise: Promise<IFighterInfo>) => Promise<void>;
}

export default class DetailsModal extends View {
	container: HTMLDivElement;
	private modalContent: HTMLDivElement;

	constructor() {
		super();

		this.container = document.getElementById('modal') as HTMLDivElement;
	}

	async show(fighterInfoPromise : Promise<IFighterInfo>): Promise<void> {
		try {
			const fighterInfo = await fighterInfoPromise;
			this._display(fighterInfo);
			const event = new CustomEvent('close', { 'detail': fighterInfo });
			Array.from(document.getElementsByClassName('close')).forEach(button => button.addEventListener('click', () => {
				this.container.style.display = 'none';
				this.container.dispatchEvent(event)
			}));
		} catch(err) {
			console.error(err);
	 		this.container.style.display = 'block';
		  this.container.innerHTML = 'Failed to load data';
		}
	}

	private _display(details: IFighterInfo): void {
		if (this.modalContent) {
			this.container.removeChild(this.modalContent);
			this.modalContent = null;
		}

		this.container.style.display = 'block';

		const closeButton = this.createElement({ tagName: 'span', className: 'close' }) as HTMLButtonElement;
		closeButton.innerHTML = '&times;';

		const title = this._createTitle(details.name);
		const content = this._createInputs(details);

		const subButton = this.createElement({
			tagName: 'input',
			className: 'close',
			attributes: { type: 'submit', id: 'submit', value: 'Ok' }
		}) as HTMLButtonElement;
		const buttonContainer = this.createElement({ tagName: 'div', className: 'right-bar' }) as HTMLDivElement;
		buttonContainer.appendChild(subButton);

		this.modalContent = this.createElement({ tagName: 'div', className: 'content' }) as HTMLDivElement;
		this.modalContent.appendChild(closeButton);
		this.modalContent.appendChild(title);
		this.modalContent.appendChild(content);
		this.modalContent.appendChild(buttonContainer);
		this.container.appendChild(this.modalContent);
	}

	private _createTitle(name: string): HTMLDivElement {
		const container = this.createElement({ tagName: 'div', className: 'mid' }) as HTMLDivElement;

		const titlename = this.createElement({ tagName: 'span', className: 'title' }) as HTMLSpanElement;
		titlename.innerHTML = 'name: ';

		const titleField = this.createElement({ tagName: 'span', className: 'title' }) as HTMLSpanElement;
		titleField.innerHTML = name;

		container.appendChild(titlename);
		container.appendChild(titleField);

		return container;
	}

	private _createInputs(details: IFighterInfo) : HTMLDivElement {
		const detailsHolder = this.createElement({ tagName: 'div', className: 'table' }) as HTMLDivElement;
		['health', 'attack', 'defense'].forEach(field => {
			detailsHolder.appendChild(this._createFieldName(field));
			detailsHolder.appendChild(this._createField(details[field] as string, e => {
				details[field] = parseInt((<HTMLInputElement>e.target).value)
			}));
		})

		return detailsHolder;
	}

	private _createFieldName(name: string): HTMLDivElement {
		const label = this.createElement({ tagName: 'div' }) as HTMLDivElement;
		label.innerHTML = name;
		return label;
	}

	private _createField(value: string = '', onChange: (e: MouseEvent) => void): HTMLInputElement{
		const input = this.createElement({ tagName: 'input', attributes: { type: 'number', value, min: 1 } }) as HTMLInputElement;
		input.addEventListener('mouseup', onChange);
		return input;
	}
}
