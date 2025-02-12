import { _decorator, BoxCollider, Component, ITriggerEvent, Node, physics, Quat, RigidBody, Vec3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property({ type: [Node] })
    wheels: Node[] = [];
    @property({ type: Node })
    velocity: Node = null;
    countPoint = 1;
    nextPointPosition: Vec3 = null;
    @property({ type: Node })
    road: Node = null;
    @property({ type: Node })
    startPosition: Node = null;




    start() {
        let t = this;
        let collider = t.velocity.getComponent(BoxCollider);
        collider.on('onTriggerEnter', t.onCollision, t);
        // t.node.getComponent(BoxCollider).on('onTriggerEnter', t.getObstalce, t)
        // t.node.getChildByName("Bike 1").getComponent(BoxCollider).on('onTriggerEnter', t.getObstalce, t);
        t.nextPointPosition = t.startPosition.getWorldPosition(new Vec3);
        t.schedule(() => { t.getPositionSeeking() }, 0.0015)
    }


    onCollision(event: ITriggerEvent) {
        let t = this;
        let temp = event.otherCollider.node;

        if (!temp.getComponent(RigidBody)) {
            // t.node.getComponent(RigidBody).enabled = true;
            // DataManager.instance.isStop = true;
            console.log("forget add rigibody", temp.name);
            return;
        }
        // sovle event collider by moto
        switch (temp.name) {
            case "Cube":
                t.countPoint = Number(temp.parent.name) + 1;
                console.log(t.countPoint, "???");
                if (t.countPoint >= t.road.children.length) {
                    DataManager.instance.isStop = true;
                    return;
                }
                t.nextPointPosition = t.road.getChildByName(t.countPoint.toString()).getWorldPosition(new Vec3);
                break;
            // case "skittle":
            //     // DataManager.instance.isStop = true;
            //     t.node.getComponent(RigidBody).type = RigidBody.Type.DYNAMIC;
            //     console.log("a");
            //     break;
            // case "fanBlades":
            //     DataManager.instance.isStop = true;
            //     break
            // case "Cube":
            //     t.countPoint = Number(temp.parent.name) + 1;
            //     console.log(t.countPoint, "???");
            //     if (t.countPoint >= t.road.children.length) {
            //         DataManager.instance.isStop = true;
            //         return;
            //     }
            //     t.nextPointPosition = t.road.getChildByName(t.countPoint.toString()).getWorldPosition(new Vec3);
            //     break;
            default:

                break;
        }
        console.log(t.nextPointPosition);

    }

    private getObstalce(event: ITriggerEvent) {
        let t = this;
        let temp = event.otherCollider.node;
        if (!temp.getComponent(RigidBody)) {
            return;
        }

        switch (temp.name) {
            case "fanBlades":
                DataManager.instance.isStop = true;
                break;
            default:
                break;
        }
    }



    // event physis on body of moto
    eventOnBody(event: ITriggerEvent) {
        let t = this;
        let otherNode = event.otherCollider.node;
        switch (otherNode.name) {
            case "bay":
                DataManager.instance.isStop = true;
                // need reset stage game
                break;
            case "vat can":
                // do nothing
                break;
            default:
                break;
        }

    }



    getPositionSeeking() {

        let t = this;
        // animation tire 
        t.spinWheels(DataManager.instance.speed);
        // check are running
        if (DataManager.instance.isStop) { return; }

        // check are over road 
        if (t.countPoint >= t.road.children.length) { return; }

        // positionTarget
        t.nextPointPosition = t.road.getChildByName(t.countPoint.toString()).getWorldPosition(new Vec3);

        let desired = new Vec3();
        let speed = 0.01
        // speed fake

        let positionMoto = t.node.getWorldPosition(new Vec3());
        const deltaX = t.nextPointPosition.x - positionMoto.x;
        const deltaY = t.nextPointPosition.y - positionMoto.y;
        const deltaZ = t.nextPointPosition.z - positionMoto.z;
        const distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
        if (distanceSqr === 0 || (speed >= 0 && distanceSqr < speed * speed)) {
            return
        }
        
        const distance = Math.sqrt(distanceSqr);
        const scale = speed / distance;
        desired.x = positionMoto.x + deltaX * scale;
        desired.y = positionMoto.y + deltaY * scale;
        desired.z = positionMoto.z + deltaZ * scale;
        if (scale == 0) { return; }
        // get velocity before it change position
        let velocity = t.velocity.getWorldPosition(new Vec3);
        let steering = new Vec3();
        Vec3.lerp(steering, desired, velocity, 0.1);
        // t.seek.position = desired
        // auto orientation to desired
        let up = new Vec3(0, 1, 0);
        t.node.lookAt(steering, up);
        let eulerAngles = Quat.toEuler(new Quat, t.node.rotation);
        eulerAngles.x = -eulerAngles.x;
        eulerAngles.y = eulerAngles.y - 180;
        t.node.setRotation(Quat.fromEuler(new Quat, eulerAngles.x, eulerAngles.y, eulerAngles.z));
        t.node.position = steering;


        // driff by user
        let moto = t.node.getChildByName("Bike 1");
        if (DataManager.instance.isTurn) {
            let xAsis = moto.position.x + (DataManager.instance.turnRight ? -0.1 : 0.1);
            moto.setRotationFromEuler(new Vec3(0, DataManager.instance.turnRight ? -1 : 1, 0));
            if (-5 < xAsis && xAsis < 5) {
                moto.setPosition(new Vec3(xAsis, 0, 0));
            }
        } else {
            moto.setRotationFromEuler(new Vec3(0, 0, 0));
        }

    }
    spinWheels(around: number) {
        let t = this;
        for (let i = 0; i < t.wheels.length; i++) {
            let wheel = t.wheels[i];
            let tempQuat = Quat.fromAxisAngle(new Quat, new Vec3(1, 0, 0), 15.7 * around) // 1.57 = 90 degree = 1 around
            wheel.rotate(tempQuat);
        }
    }
    update(deltaTime: number) {

    }


}

