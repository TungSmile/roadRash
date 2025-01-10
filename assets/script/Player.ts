import { _decorator, Component, Node, Quat, tween, Vec3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {
    @property({ type: [Node] })
    wheels: Node[] = [];
    @property({ type: Node })
    velocity: Node = null
    start() {

    }
    tempCheck: boolean = false;
    getPositionSeeking(targetPositon: Vec3) {
        // target positon is world position
        let t = this;
        if (DataManager.instance.isStop) { return }
        if (DataManager.instance.speed == 0) {
            if (!t.tempCheck) {
                t.tempCheck = true;
                let moto = t.node.getChildByName("Feyado 2015 Pelaautuxu 1000 S Green");
                tween(moto)
                    .to(0.5, {
                        eulerAngles: new Vec3(0, 0, 0)
                    })
                    .start();
            }
        } else {
            t.tempCheck = false;
        }
        let desired = new Vec3();
        let speed = 0.075;
        //  (DataManager.instance.speed / 1300)      // reduce speed coincide pixel map 0.075
        // if (t.isBot && DataManager.instance.speed != 0) {
        //     speed = t.numberS
        // }

        let positionMoto = t.node.getWorldPosition(new Vec3());
        const deltaX = targetPositon.x - positionMoto.x;
        const deltaY = targetPositon.y - positionMoto.y;
        const deltaZ = targetPositon.z - positionMoto.z;
        const distanceSqr = deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ;
        if (distanceSqr === 0 || (speed >= 0 && distanceSqr < speed * speed)) {
            // desired.x = targetPositon.x;
            // desired.y = targetPositon.y;
            // desired.z = targetPositon.z;
            t.node.setWorldPosition(targetPositon)
            // DataManager.instance.point++;
            return
        }
        const distance = Math.sqrt(distanceSqr);
        const scale = speed / distance;
        desired.x = t.node.position.x + deltaX * scale;
        desired.y = t.node.position.y + deltaY * scale;
        desired.z = t.node.position.z + deltaZ * scale;
        if (scale == 0) { return }
        // get velocity before it change position
        let velocity = t.velocity.getWorldPosition(new Vec3);
        let steering = new Vec3();
        Vec3.lerp(steering, desired, velocity, 0.2);
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

