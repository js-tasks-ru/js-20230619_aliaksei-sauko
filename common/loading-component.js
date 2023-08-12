import Component from "./component.js";

export default class LoadableComponent extends Component {
    startLoadingCallback;
    endLoadingCallback;

    constructor({ startLoadingCallback = () => { }, endLoadingCallback = () => { } } = {}) {
        super();
        
        this.startLoadingCallback = startLoadingCallback;
        this.endLoadingCallback = endLoadingCallback;
    }
}
