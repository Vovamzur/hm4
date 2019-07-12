import FightersView from './views/fightersView';
import { fighterService } from './services/fightersService';

export interface IApp {
  startApp: () => Promise<void>;
}

export default class App implements IApp {
  private static readonly rootElement = document.getElementById('root') as HTMLDivElement;
  private static readonly loadingElement = document.getElementById('loading-overlay') as HTMLDivElement;

  constructor() {
    this.startApp();
  }

  async startApp(): Promise<void> {
    try {
      App.loadingElement.style.visibility = 'visible';
      
      const fighters = await fighterService.getFighters();
      const fightersView = new FightersView(fighters);
      const fightersElement = fightersView.element;

      App.rootElement.appendChild(fightersElement);
    } catch (error) {
      console.warn(error);
      App.rootElement.innerText = 'Failed to load data';
    } finally {
      App.loadingElement.style.visibility = 'hidden';
    }
  }
}
