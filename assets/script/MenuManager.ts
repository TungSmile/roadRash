import { _decorator, Button, Component, Node } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('MenuManager')
export class MenuManager extends Component {

    @property({ type: Node })
    btnStart: Node = null;

    @property(Node)
    left: Node | null = null;
    @property(Node)
    right: Node | null = null;
    isRight: boolean = true;
    isEvent: boolean = false;
    start() {
        let t = this;
        t.registerEvent();

    }

    registerEvent() {
        let t = this;
        t.left.on(Node.EventType.TOUCH_START, t.turnLeft, t);
        t.left.on(Node.EventType.TOUCH_MOVE, t.cancelTurn, t);
        t.left.on(Node.EventType.TOUCH_CANCEL, t.cancelTurn, t);
        t.left.on(Node.EventType.TOUCH_END, t.cancelTurn, t);
        t.right.on(Node.EventType.TOUCH_START, t.turnRight, t);
        t.right.on(Node.EventType.TOUCH_MOVE, t.cancelTurn, t);
        t.right.on(Node.EventType.TOUCH_CANCEL, t.cancelTurn, t);
        t.right.on(Node.EventType.TOUCH_END, t.cancelTurn, t);
    }



    turnLeft() {
        let t = this;
        if (t.isEvent) { return }
        DataManager.instance.turnRight = false;
        t.isEvent = true;
        DataManager.instance.isTurn = true;
    }

    turnRight() {
        let t = this;
        if (t.isEvent) { return }
        DataManager.instance.turnRight = true;
        t.isEvent = true;
        DataManager.instance.isTurn = true;
    }

    cancelTurn() {
        let t = this;
        t.isEvent = false;
        DataManager.instance.isTurn = false;
    }




    eventStart() {
        let t = this;
        t.btnStart.destroy();
        DataManager.instance.isStop = false;

    }




    update(deltaTime: number) {

    }
}

