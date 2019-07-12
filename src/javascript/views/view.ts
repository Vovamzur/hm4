interface IArgs {
  tagName: string;
  className?: string;
  attributes?: {
    [key : string] : string | number;
  };
}

export interface IView {
  element: HTMLElement;
  createElement: (args: IArgs) => HTMLElement;
}

export default class View implements IView {
  element: HTMLElement;

  createElement({ tagName, className = '', attributes = {} } : IArgs): HTMLElement {
    const element = document.createElement(tagName);
    if(className !== "") element.classList.add(className);
    Object.keys(attributes).forEach(key => element.setAttribute(key, attributes[key] as string));

    return element;
  }
}
