import { _decorator, Component, Input, KeyCode, Node } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    start() {
        let t = this;
        t.node.on(Input.EventType.KEY_DOWN, t.pressBtn, t)

    }

    pressBtn(e) {
        let t = this;
        switch (e.keyCode) {
            case KeyCode.KEY_W:
                DataManager.instance.speed = 7;
                break;
            case KeyCode.KEY_S:
                DataManager.instance.speed = 0;
                break;
            case KeyCode.KEY_A:
                break;
            case KeyCode.KEY_D:
                break;
            default:
                break;
        }
    }



    update(deltaTime: number) {

    }
}

