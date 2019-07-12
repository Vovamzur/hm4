import View from './view';
import FighterView, { IHandleFighterClick } from './fighterView';
import { fighterService, IFighterInfo } from './../services/fightersService';
import DetailsModal, { IDetailsModal } from './../modals/detailsModal';
import Fight, { IFight } from '../fight';
import { IFighterViewInfo } from './../services/fightersService'

export default class FightersView extends View {
  private handleClick: IHandleFighterClick;
  private fightersDetailsMap: any;
  private modal: IDetailsModal;
  private fight: IFight;

  constructor(fighters: Array<IFighterViewInfo>) {
    super();

    this.handleClick = this._handleFighterClick.bind(this);
    this._createFighters(fighters);
    this.fightersDetailsMap = new Map();
    this.modal = new DetailsModal();
    this.fight = new Fight();

    this._createModalListener();
  }

  private _createFighters(fighters: Array<IFighterViewInfo>): void {
    const fighterElements = fighters.map(fighter => {
      const fighterView = new FighterView(fighter, this.handleClick);
      return fighterView.element;
    });

    this.element = this.createElement({ tagName: 'div', className: 'fighters' }) as HTMLDivElement;
    fighterElements.forEach(fighterEl => this.element.appendChild(fighterEl));
  }

  private _handleFighterClick(event: Event, fighter: IFighterViewInfo): void {
    const id = fighter._id;
    const info = this._getFighterDetails(id);
    if ((<HTMLInputElement>event.target).checked) {
      info
        .then(fighter => this.fight.checkAndStart(fighter))
        .catch(err => console.error(err));
    } else {
      this.modal.show(info);
    }
  }

  private async _getFighterDetails(id: string): Promise<IFighterInfo> {
    let fighterInfo;

    if (!this.fightersDetailsMap.has(id)) {
      try {
        fighterInfo = await fighterService.getFighterDetails(id);
        this.fightersDetailsMap.set(id, fighterInfo);
      } catch (error) {
        throw error;
      }
    } else fighterInfo = this.fightersDetailsMap.get(id);

    return fighterInfo;
  }

  private _createModalListener(): void {
    this.modal.container.addEventListener('close', event => {
      const newDetails = (<CustomEvent>event).detail;
      const { _id } = newDetails;
      this.fightersDetailsMap.set(_id, newDetails);
    })
  }
}
