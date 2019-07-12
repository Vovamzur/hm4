import View , { IView } from './view';
import { IFighterViewInfo } from './../services/fightersService'

export interface IFighterView extends IView {
  createFighter: (fighter: IFighterViewInfo, handleClick: IHandleFighterClick ) => void; 
}

export interface IHandleFighterClick {
  (event: MouseEvent, fighter: IFighterViewInfo): void;
}

export default class FighterView extends View  implements IFighterView {
  constructor(fighter: IFighterViewInfo, handleClick: IHandleFighterClick) {
    super();

    this.createFighter(fighter, handleClick);
  }

  createFighter(fighter: IFighterViewInfo, handleClick: IHandleFighterClick): void {
    const { name, source } = fighter;
    const nameElement = this._createName(name);
    const imageElement = this._createImage(source);
    const checkElement = this._createCheckBox();

    this.element = this.createElement({ tagName: 'div', className: 'fighter' });
    this.element.appendChild(imageElement);
    this.element.appendChild(nameElement);
    this.element.appendChild(checkElement);
    if(handleClick) {
      this.element.addEventListener('click', event => handleClick(event, fighter), false);
    }
  }

  private _createName(name: string) : HTMLSpanElement {
    const nameElement = this.createElement({ tagName: 'span', className: 'name' }) as HTMLSpanElement;
    nameElement.innerText = name;

    return nameElement;
  }

  private _createImage(source: string) : HTMLImageElement {
    const attributes = { src: source };
    const imgElement = this.createElement({
      tagName: 'img',
      className: 'fighter-image',
      attributes
    }) as HTMLImageElement;

    return imgElement;
  }

  private _createCheckBox() : HTMLInputElement {
    const checkElement = this.createElement({ 
      tagName: 'input',
      className: 'name',
      attributes: { type: 'checkbox' }
    }) as HTMLInputElement;
    
    return checkElement;
  }
}
