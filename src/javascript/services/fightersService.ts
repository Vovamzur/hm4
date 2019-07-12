import { callApi } from '../helpers/apiHelper';

export interface IFighterViewInfo {
  _id: string;
  name: string;
  source: string;
}

export interface IFighterInfo extends IFighterViewInfo {
  attack: number;
  defense: number;
  health: number;
  [key: string]: string | number;
}

const getInfoByEndpoint = async (endpoint: string) : Promise<IFighterInfo | Array<IFighterViewInfo>> => {
  try {
    const apiResult = await callApi(endpoint, 'GET');
    return JSON.parse(atob(apiResult.content));
  } catch (error) {
    throw error;
  }
}

interface IFighterService {
  getFighters: () => Promise<Array<IFighterViewInfo>>;
  getFighterDetails: (_id: string) => Promise<IFighterInfo>
}

class FighterService implements IFighterService {
  async getFighters(): Promise<Array<IFighterViewInfo>> {
    const endpoint: string = 'fighters.json';
    const info = await getInfoByEndpoint(endpoint) as Array<IFighterViewInfo>;
    return info;
  }

  async getFighterDetails(_id: string) : Promise<IFighterInfo>{
    const endpoint: string = `details/fighter/${_id}.json`;
    const info = await getInfoByEndpoint(endpoint) as IFighterInfo;
    return info;
  }
}

export const fighterService = new FighterService();
