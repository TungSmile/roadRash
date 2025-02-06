import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }
    public speed: number = 0;
    public point: number = 0;
    public lap: number = 0;
    public countPoint: number = 0;
    public ready: boolean = false;
    public isStop: boolean = true;
    public endGame: boolean = false;
    public isTurn: boolean = false;
    public turnRight: boolean = false;

}

