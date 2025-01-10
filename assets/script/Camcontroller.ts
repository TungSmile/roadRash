import { _decorator, Camera, Component, Node, Vec3 } from 'cc';
import { DataManager } from './DataManager';
const { ccclass, property } = _decorator;

@ccclass('Camcontroller')
export class Camcontroller extends Component {
    @property({ type: Node })
    public target: Node | null = null;

    private camera: Camera | null = null;

    @property
    distance: number = 5;

    @property
    height: number = 2;

    @property
    smoothness: number = 0.01;

    @property
    offsetX: number = 0;


    start() {
        this.camera = this.getComponent(Camera);
        if (!this.camera) {
            console.error("Camera component not found on this node.");
        }
    }

    // hiệu ứng giảm tốc sử dụng t.smooth
    camFollowBehind() {
        let t = this;
        if (!t.target || !t.camera) { return }
        // if (DataManager.instance.statusMove == statusMoto.giam) {
        //     // speed =0-120
        //     // t.distance = 10 - (5 - DataManager.instance.speed / 30);
        //     // t.smoothness = 1 - DataManager.instance.speed / 120;
        //     // console.log(t.smoothness);
        // }
        // t.smoothness = 1.1 - DataManager.instance.speed / 120
        const targetPosition = this.target.worldPosition;
        const targetRotation = this.target.worldRotation;
        if (!DataManager.instance.endGame) {
            const backwardDirection = new Vec3(0, 0, -1);
            Vec3.transformQuat(backwardDirection, backwardDirection, targetRotation);
            const desiredPosition = new Vec3();
            Vec3.scaleAndAdd(desiredPosition, targetPosition, backwardDirection, t.distance);
            desiredPosition.y += this.height;
            desiredPosition.x += this.offsetX;
            const smoothedPosition = new Vec3();
            Vec3.lerp(smoothedPosition, this.node.worldPosition, desiredPosition, t.smoothness);
            this.node.setWorldPosition(smoothedPosition);
        }
        this.node.lookAt(targetPosition);
    }




    update(deltaTime: number) {
        this.camFollowBehind()
    }
}

