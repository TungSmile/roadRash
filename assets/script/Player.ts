import { _decorator, BoxCollider, Component, ICollisionEvent, ITriggerEvent, Node, Quat, RigidBody, tween, Vec3 } from 'cc';
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
        // collider.on('onTriggerStay', t.onCollision, t);
        // collider.on('onTriggerExit', t.onCollision, t);
        t.nextPointPosition = t.startPosition.getWorldPosition(new Vec3);
        t.schedule(() => {
            t.getPositionSeeking();
        }, 0.0015)
    }


    private onCollision(event: ITriggerEvent) {
        let t = this;
        t.countPoint++;
        console.log(event.otherCollider.node.name);
        let temp = event.otherCollider.node;
        if (temp.getComponent(RigidBody) && temp.getComponent(RigidBody).isAwake) {
            DataManager.instance.isStop = true;
            return;
        }
        if (t.countPoint > 21) {
            DataManager.instance.isStop = true;
            return;
        }
        t.nextPointPosition = t.road.getChildByName(t.countPoint.toString()).getWorldPosition(new Vec3);


    }


    getPositionSeeking() {
        // target positon is world position
        let t = this;
        t.nextPointPosition
        if (DataManager.instance.isStop) { return }
        // if (DataManager.instance.speed == 0) {
        //     if (!t.tempCheck) {
        //         t.tempCheck = true;
        //         let moto = t.node.getChildByName("Feyado 2015 Pelaautuxu 1000 S Green");
        //         tween(moto)
        //             .to(0.5, {
        //                 eulerAngles: new Vec3(0, 0, 0)
        //             })
        //             .start();
        //     }
        // } else {
        //     t.tempCheck = false;
        // }
        let desired = new Vec3();
        let speed = 0.075
        // DataManager.instance.speed / 100;
        //  (DataManager.instance.speed / 1300)      // reduce speed coincide pixel map 0.075
        // if (t.isBot && DataManager.instance.speed != 0) {
        //     speed = t.numberS
        // }

        let positionMoto = t.node.getWorldPosition(new Vec3());
        const deltaX = t.nextPointPosition.x - positionMoto.x;
        const deltaY = t.nextPointPosition.y - positionMoto.y;
        const deltaZ = t.nextPointPosition.z - positionMoto.z;
        const distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
        if (distanceSqr === 0 || (speed >= 0 && distanceSqr < speed * speed)) {
            // desired.x = targetPositon.x;
            // desired.y = targetPositon.y;
            // desired.z = targetPositon.z;
            // t.node.setWorldPosition(t.nextPointPosition);
            // t.countPoint++;
            // console.log('a');

            // DataManager.instance.point++;
            return
        }
        const distance = Math.sqrt(distanceSqr);
        const scale = speed / distance;
        desired.x = positionMoto.x + deltaX * scale;
        desired.y = positionMoto.y + deltaY * scale;
        desired.z = positionMoto.z + deltaZ * scale;
        if (scale == 0) { return }
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
        // animation tire 
        // t.spinWheels(DataManager.instance.speed)

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

