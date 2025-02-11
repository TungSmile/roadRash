import { _decorator, Component, Input, KeyCode, Node, Quat, Vec3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property({ type: [Node] })
    wheels: Node[] = [];



    start() {
        let t = this;
        t.node.on(Input.EventType.KEY_DOWN, t.pressBtn, t)
        t.eventStartGame()
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

    eventStartGame() {
        let t = this;

        // event for wheel blade
        t.schedule(t.aroundWheel, 0.01);

    }


    aroundWheel() {
        let t = this;
        for (let i = 0; i < t.wheels.length; i++) {
            let wheel = t.wheels[i];
            let tempQuat = Quat.fromAxisAngle(new Quat, new Vec3(0, 1, 0), 0.0157 / 5) // 1.57 = 90 degree = 1 around
            wheel.rotate(tempQuat);
        }
    }


     




    update(deltaTime: number) {

    }
}

