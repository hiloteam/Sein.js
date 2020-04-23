/**
 * @File   : CannonPhysicWorld.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 10/22/2018, 4:26:53 PM
 * @Description:
 */
import SObject from '../Core/SObject';
import {SClass} from '../Core/Decorator';
import {Vector3, Quaternion} from '../Core/Math';
import {IPhysicWorld, TColliderParams, EColliderType, IPickOptions, IPickResult, EPickMode, ERigidBodyType, TJointParams, EJointType, IPointToPointJointOptions, IDistanceJointOptions, ISpringJointOptions} from '../types/Physic';
import ColliderComponent from '../Physic/ColliderComponent';
import JointComponent from '../Physic/JointComponent';
import RigidBodyComponent, {IRigidBodyComponentState} from './RigidBodyComponent';
import SceneActor from '../Renderer/ISceneActor';
import Debug from '../Debug';
import UnmetRequireException from '../Exception/UnmetRequireException';
import {bfs} from '../utils/actorIterators';
import SpringJointComponent from './SpringJointComponent';

/**
 * 基于cannon.js的物理世界类，完成了CANNON到Sein.js的物理引擎的桥接。
 * **一般情况下你并不需要直接操作这个实例，而是使用刚体和碰撞体组件！**
 * CANNON的工程（魔改过的）请见这里：[https://github.com/dtysky/cannon.js](https://github.com/dtysky/cannon.js)，可以使用`npm i cannon-dtysky`获取。
 * 详细使用请见[Physic](../../guide/physic)。
 * 
 * @noInheritDoc
 */
@SClass({className: 'CannonPhysicWorld', classType: 'PhysicWorld'})
export default class CannonPhysicWorld extends SObject implements IPhysicWorld {
  public isPhysicWorld = true;
  public isCannonPhysicWorld = true;

  /**
   * CANNON模块引用。
   */
  public CANNON: any;

  private _world: any;
  private _fixedTimeStep: number = 1 / 60;
  private _physicsMaterials: any[] = [];
  private _ray: any;
  private _rayResult: any;

  /**
   * 构造器。
   * 
   * @param Cannon CANNON模块引用`Cannon`。
   * @param gravity 世界重力。
   * @param iterations 迭代次数。
   */
  constructor(
    Cannon: any,
    gravity: Vector3 = new Vector3(0, -9.81, 0),
    iterations: number = 10
  ) {
    super('SeinCannonPhysicWorld');

    if (!Cannon) {
      throw new UnmetRequireException(
        this, 'The newest version Cannonjs is required ! Goto "https://github.com/dtysky/cannon.js/tree/master/build" get it !'
      );
    }

    this.CANNON = Cannon;
    this._world = new this.CANNON.World();
    this._world.broadphase = new this.CANNON.NaiveBroadphase();
    this._world.solver.iterations = iterations;
    this._world.gravity.set(gravity.x, gravity.y, gravity.z);
    this._ray =  new this.CANNON.Ray();
    this._rayResult = new this.CANNON.RaycastResult();
  }

  /**
   * 设置固定步长（秒）。
   */
  set timeStep(value: number) {
    this._fixedTimeStep = value;
  }

  /**
   * 获取固定步长（秒）。
   */
  get timeStep() {
    return this._fixedTimeStep;
  }

  /**
   * 设置重力。
   */
  set gravity(gravity: Vector3) {
    this._world.gravity.set(gravity.x, gravity.y, gravity.z);
  }

  /**
   * 获取重力。
   */
  get gravity() {
    const {x, y, z} = this._world.gravity;
    return new Vector3(x, y, z);
  }

  /**
   * 启用高级碰撞事件，这可以让你拥有对碰撞更细致的控制，但会有一些性能损耗。
   */
  public initContactEvents() {
    this._world.addEventListener('beginContact', args => {
      if (!args.bodyA || !args.bodyB) {
        return;
      }

      if (args.bodyA.component.valid) {
        (args.bodyA.component as RigidBodyComponent).handleBodyEnter(
          args.bodyA.component,
          args.bodyB.component
        );
      }

      if (args.bodyB.component.valid) {
        (args.bodyB.component as RigidBodyComponent).handleBodyEnter(
          args.bodyB.component,
          args.bodyA.component
        );
      }
    });
    this._world.addEventListener('endContact', args => {
      if (!args.bodyA || !args.bodyB) {
        return;
      }

      if (args.bodyA.component.valid) {
        (args.bodyA.component as RigidBodyComponent).handleBodyLeave(
          args.bodyA.component,
          args.bodyB.component
        );
      }

      if (args.bodyB.component.valid) {
        (args.bodyB.component as RigidBodyComponent).handleBodyLeave(
          args.bodyB.component,
          args.bodyA.component
        );
      }
    });
    this._world.addEventListener('beginShapeContact', args => {
      if (!args.bodyA || !args.bodyB) {
        return;
      }

      if (args.bodyA.component.valid) {
        (args.bodyA.component as RigidBodyComponent).handleColliderEnter(
          args.bodyA.component,
          args.bodyB.component,
          args.shapeA.component,
          args.shapeB.component
        );
      }

      if (args.bodyB.component.valid) {
        (args.bodyB.component as RigidBodyComponent).handleColliderEnter(
          args.bodyB.component,
          args.bodyA.component,
          args.shapeB.component,
          args.shapeA.component
        );
      }
    });
    this._world.addEventListener('endShapeContact', args => {
      if (!args.bodyA || !args.bodyB) {
        return;
      }

      if (args.bodyA.component.valid) {
        (args.bodyA.component as RigidBodyComponent).handleColliderLeave(
          args.bodyA.component,
          args.bodyB.component,
          args.shapeA.component,
          args.shapeB.component
        );
      }

      if (args.bodyB.component.valid) {
        (args.bodyB.component as RigidBodyComponent).handleColliderLeave(
          args.bodyB.component,
          args.bodyA.component,
          args.shapeB.component,
          args.shapeA.component
        );
      }
    });
  }

  /**
   * 设置重力。
   */
  public setGravity(gravity: Vector3) {
    this._world.gravity.x = gravity.x;
    this._world.gravity.y = gravity.y;
    this._world.gravity.z = gravity.z;

    return this;
  }

  /**
   * **不要自己调用！！**
   * 
   * @hidden
   */
  public update(delta: number = 0, components: RigidBodyComponent[] = []): void {
    this._world.step(this._fixedTimeStep, delta, 3);
  }

  /**
   * 添加脉冲力。
   */
  public applyImpulse(component: RigidBodyComponent, force: Vector3, contactPoint: Vector3) {
    const worldPoint = new this.CANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
    const impulse = new this.CANNON.Vec3(force.x, force.y, force.z);

    component.rigidBody.applyImpulse(impulse, worldPoint);
  }

  /**
   * 添加力。
   */
  public applyForce(component: RigidBodyComponent, force: Vector3, contactPoint: Vector3) {
    const worldPoint = new this.CANNON.Vec3(contactPoint.x, contactPoint.y, contactPoint.z);
    const impulse = new this.CANNON.Vec3(force.x, force.y, force.z);

    component.rigidBody.applyForce(impulse, worldPoint);
  }

  /**
   * 拾取操作。
   */
  public pick(
    from: Vector3,
    to: Vector3,
    onPick: (result: IPickResult[]) => void,
    origOptions: IPickOptions = {}
  ) {
    const options = {...origOptions};

    this._ray.from.copy(from);
    this._ray.to.copy(to);
    this._ray.checkCollisionResponse = options.checkCollisionResponse === true ? true : false;

    switch (options.mode) {
      case EPickMode.All:
        (options as any).mode = this.CANNON.Ray.ALL;
        break;
      case EPickMode.Any:
        (options as any).mode = this.CANNON.Ray.ANY;
        break;
      case EPickMode.Closest:
        (options as any).mode = this.CANNON.Ray.CLOSEST;
      default:
        (options as any).mode = this.CANNON.Ray.CLOSEST;
        break;
    }

    options.skipBackfaces = options.skipBackfaces === false ? false : true;
    (options as any).result = this._rayResult;

    const result = [];
    (options as any).callback = () => {
      const {body, shape, distance, hitPointWorld} = this._rayResult;
      if (!body.component.valid) {
        return;
      }
      result.push({rigidBody: body.component, collider: shape.component, actor: body.component.getOwner(), distance, point: new Vector3(hitPointWorld.x, hitPointWorld.y, hitPointWorld.z)});
    };
    if (options.bodies) {
      (options as any).bodies = options.bodies.map(body => body.rigidBody);
    }

    const hit = this._ray.intersectWorld(this._world, options);

    if (hit) {
      if (options.mode === EPickMode.CLOSEST) {
        const {body, shape, distance, hitPointWorld} = this._rayResult;
        result.push({rigidBody: body.component, collider: shape.component, actor: body.component.getOwner(), distance, point: new Vector3(hitPointWorld.x, hitPointWorld.y, hitPointWorld.z)});
      }

      onPick(result);
    }

    return hit;
  }

  /**
   * 创建一个刚体。
   */
  public createRigidBody(component: RigidBodyComponent, options: IRigidBodyComponentState) {
    const material = this.addMaterial(
      `mat-${component.uuid}`,
      options.friction,
      options.restitution
    );

    const bodyCreationObject = {
      mass: options.mass,
      material: material
    };

    for (const key in options.nativeOptions) {
      bodyCreationObject[key] = options.nativeOptions[key];
    }

    const rigidBody = new this.CANNON.Body(bodyCreationObject);
    rigidBody.component = component;
    const [position, rotation, scale] = component.getCurrentTransform();
    this.setBodyTransform(rigidBody, position, rotation, scale);
    rigidBody.updateMassProperties();
    rigidBody.updateBoundingRadius();

    if (Debug.devMode) {
      this.checkNest(component);
    }

    this._world.addBody(rigidBody);

    return rigidBody;
  }

  /**
   * 暂时使得刚体失去效应，可以用`enableRigidBody`恢复。
   */
  public disableRigidBody(component: RigidBodyComponent) {
    this._world.remove(component.rigidBody);
  }

  /**
   * 使得一个暂时失去效应的刚体恢复。
   */
  public enableRigidBody(component: RigidBodyComponent) {
    this._world.add(component.rigidBody);
  }

  /**
   * 在开发环境下，检测是否有物理嵌套。
   */
  private checkNest(component: RigidBodyComponent) {
    const actor = component.getOwner<SceneActor>();
    let parent: any = actor.parent;

    while (parent) {
      if ((parent as SceneActor).rigidBody) {
        Debug.warn(
          'You should never have a parent and child "none isTrigger and 0 mass" rigidBody together',
          actor, parent
        );
        break;
      }

      parent = parent.parent;
    }

    bfs(actor, (child: SceneActor) => {
      if (child.rigidBody) {
        Debug.warn(
          'You should never have a parent and child "none isTrigger and 0 mass" rigidBody together',
          actor, child
        );
        return false;
      }

      return true;
    });
  }

  /**
   * 初始化基本事件。
   */
  public initEvents(component: RigidBodyComponent) {
    this._world.addEventListener('preStep', component.handleBeforeStep);
    this._world.addEventListener('postStep', component.handleAfterStep);
    component.rigidBody.addEventListener('collide', component.handleCollision);
  }

  /**
   * 移除一个刚体。
   */
  public removeRigidBody(component: RigidBodyComponent) {
    this._world.removeEventListener('preStep', component.handleBeforeStep);
    this._world.removeEventListener('postStep', component.handleAfterStep);
    component.rigidBody.removeEventListener('collision', component.handleCollision);

    this._world.remove(component.rigidBody);
  }

  /**
   * 清空物理世界。
   */
  public clear() {
    this._world._listeners.preStep = [];
    this._world._listeners.postStep = [];
    this._world.bodies = [];
  }

  public createJoint(rigidBody: RigidBodyComponent, component: JointComponent, params: TJointParams) {
    const {type, options} = params;
    const {actor, ...data} = options;
    const mainBody = rigidBody.rigidBody;
    const connectedBody = actor.rigidBody.rigidBody;

    let constraint: any;

    switch (type) {
      case EJointType.Hinge:
        constraint = new this.CANNON.HingeConstraint(mainBody, connectedBody, data);
        break;
      case EJointType.Distance:
        constraint = new this.CANNON.DistanceConstraint(mainBody, connectedBody, (<IDistanceJointOptions>data).distance, (<IDistanceJointOptions>data).maxForce);
        break;
      case EJointType.Spring:
        constraint = new this.CANNON.Spring(mainBody, connectedBody, <ISpringJointOptions>data);
        break;
      case EJointType.Lock:
        constraint = new this.CANNON.LockConstraint(mainBody, connectedBody, data);
        break;
      case EJointType.PointToPoint:
      default:
        constraint = new this.CANNON.PointToPointConstraint(mainBody, (<IPointToPointJointOptions>data).pivotA, connectedBody, (<IPointToPointJointOptions>data).pivotB, (<IPointToPointJointOptions>data).maxForce);
        break;
    }

    constraint.collideConnected = !!data.collideConnected;
    constraint.wakeUpBodies = !!data.wakeUpBodies;
    constraint.component = constraint;

    //don't add spring as constraint, as it is not one.
    if (type !== EJointType.Spring) {
      this._world.addConstraint(constraint);
    } else {
      rigidBody.event.add('AfterStep', (<SpringJointComponent>component).applyForce);
    }

    return constraint;
  }

  public removeJoint(rigidBody: RigidBodyComponent, component: JointComponent) {
    if (component.type !== EJointType.Spring) {
      this._world.removeConstraint(component.joint);
    } else {
      rigidBody.event.remove('AfterStep', (<SpringJointComponent>component).applyForce);
    }
  }

  public enableJoint(component: JointComponent) {
    component.joint.enable();
  }

  public disableJoint(component: JointComponent) {
    component.joint.disable();
  }

  private addMaterial(name: string, friction: number, restitution: number) {
    let index;
    let mat;

    for (index = 0; index < this._physicsMaterials.length; index += 1) {
      mat = this._physicsMaterials[index];

      if (mat.friction === friction && mat.restitution === restitution) {
        return mat;
      }
    }

    const currentMat = new this.CANNON.Material(name);
    currentMat.friction = friction;
    currentMat.restitution = restitution;

    this._physicsMaterials.push(currentMat);
    return currentMat;
  }

  /**
   * 创建碰撞体。
   */
  public createCollider(bodyComp: RigidBodyComponent, colliderComp: ColliderComponent, params: TColliderParams): any {
    let shape: any;

    switch (params.type) {
      case EColliderType.Sphere:
        shape = new this.CANNON.Sphere(params.options.radius);
        break;
      case EColliderType.Cylinder:
        shape = new this.CANNON.Cylinder(
          params.options.radiusTop,
          params.options.radiusBottom,
          params.options.height,
          params.options.numSegments
        );
        break;
      case EColliderType.Box:
        shape = new this.CANNON.Box(
          new this.CANNON.Vec3(
            params.options.size[0] / 2,
            params.options.size[1] / 2,
            params.options.size[2] / 2
          )
        );
        break;
      case EColliderType.Plane:
        Debug.warn('Attention, PlaneCollider might not behave as you expect. Consider using BoxCollider instead');
        shape = new this.CANNON.Plane();
        break;
      // case EColliderType.Heightmap:
      //   let oldPosition2 = object.position.clone();
      //   let oldRotation2 = object.rotation && object.rotation.clone();
      //   let oldQuaternion2 = object.rotationQuaternion && object.rotationQuaternion.clone();
      //   object.position.copyFromFloats(0, 0, 0);
      //   object.rotation && object.rotation.copyFromFloats(0, 0, 0);
      //   object.rotationQuaternion && object.rotationQuaternion.copyFrom(component.getParentsRotation());
      //   object.rotationQuaternion && object.parent && object.rotationQuaternion.conjugateInPlace();
      //   object.rotationQuaternion && object.rotationQuaternion.multiplyInPlace(this._minus90X);

      //   shape = this._createHeightmap(object);
      //   object.position.copyFrom(oldPosition2);
      //   oldRotation2 && object.rotation && object.rotation.copyFrom(oldRotation2);
      //   oldQuaternion2 && object.rotationQuaternion && object.rotationQuaternion.copyFrom(oldQuaternion2);
      //   object.computeWorldMatrix(true);
      //   break;
      // case EColliderType.Particle:
      //   shape = new this.CANNON.Particle();
      // break;
      default:
        break;
    }

    let {offset, quaternion, isTrigger} = params.options;
    const rigidBody: any = bodyComp.rigidBody;

    offset = offset || [0, 0, 0];
    quaternion = quaternion || [0, 0, 0, 1];
    isTrigger = isTrigger || false;
    rigidBody.addShape(
      shape,
      new this.CANNON.Vec3(...offset),
      new this.CANNON.Quaternion(...quaternion)
    );
    shape.collisionResponse = !isTrigger;
    shape.component = colliderComp;

    return shape;
  }

  /**
   * 移除碰撞体。
   */
  public removeCollider(rigidBodyComp: RigidBodyComponent, colliderComp: ColliderComponent) {
    const rigidBody: any = rigidBodyComp.rigidBody;
    const collider: any = colliderComp.collider;

    const index = rigidBody.shapes.indexOf(collider);
    rigidBody.shapes.splice(index, 1);
    rigidBody.shapeOffsets.splice(index, 1);
    rigidBody.shapeOrientations.splice(index, 1);
  }

  // private _createHeightmap(object: IPhysicsEnabledObject, pointDepth?: number) {
  //   const pos = <FloatArray>(object.getVerticesData(VertexBuffer.PositionKind));
  //   let transform = object.computeWorldMatrix(true);
  //   // convert rawVerts to object space
  //   const temp = new Array<number>();
  //   const index: number;
  //   for (index = 0; index < pos.length; index += 3) {
  //     Vector3.TransformCoordinates(Vector3.FromArray(pos, index), transform).toArray(temp, index);
  //   }
  //   pos = temp;
  //   const matrix = new Array<Array<any>>();

  //   //For now pointDepth will not be used and will be automatically calculated.
  //   //Future reference - try and find the best place to add a reference to the pointDepth constiable.
  //   const arraySize = pointDepth || ~~(Math.sqrt(pos.length / 3) - 1);
  //   let boundingInfo = object.getBoundingInfo();
  //   const dim = Math.min(boundingInfo.boundingBox.extendSizeWorld.x, boundingInfo.boundingBox.extendSizeWorld.y);
  //   const minY = boundingInfo.boundingBox.extendSizeWorld.z;

  //   const elementSize = dim * 2 / arraySize;

  //   for (const i = 0; i < pos.length; i = i + 3) {
  //     const x = Math.round((pos[i + 0]) / elementSize + arraySize / 2);
  //     const z = Math.round(((pos[i + 1]) / elementSize - arraySize / 2) * -1);
  //     const y = -pos[i + 2] + minY;
  //     if (!matrix[x]) {
  //       matrix[x] = [];
  //     }
  //     if (!matrix[x][z]) {
  //       matrix[x][z] = y;
  //     }
  //     matrix[x][z] = Math.max(y, matrix[x][z]);
  //   }

  //   for (const x = 0; x <= arraySize; ++x) {
  //     if (!matrix[x]) {
  //       const loc = 1;
  //       while (!matrix[(x + loc) % arraySize]) {
  //         loc++;
  //       }
  //       matrix[x] = matrix[(x + loc) % arraySize].slice();
  //       //console.log("missing x", x);
  //     }
  //     for (const z = 0; z <= arraySize; ++z) {
  //       if (!matrix[x][z]) {
  //         const loc = 1;
  //         const newValue;
  //         while (newValue === undefined) {
  //           newValue = matrix[x][(z + loc++) % arraySize];
  //         }
  //         matrix[x][z] = newValue;

  //       }
  //     }
  //   }

  //   const shape = new this.CANNON.Heightfield(matrix, {
  //     elementSize: elementSize
  //   });

  //   //For future reference, needed for body transformation
  //   shape.minY = minY;

  //   return shape;
  // }

  /**
   * 设置某个刚体的父级Actor的`transform`。
   */
  public setRootTransform(component: RigidBodyComponent) {
    const {transform} = component.getOwner<SceneActor>();
    const {position, quaternion} = component.rigidBody;

    transform.setPosition(position.x, position.y, position.z);
    transform.setQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w);
  }

  /**
   * 设置某个刚体的`transform`。
   */
  public setRigidBodyTransform(
    component: RigidBodyComponent,
    newPosition?: Vector3,
    newRotation?: Quaternion,
    // only for sphere, box, cylinder
    newScale?: Vector3
  ) {
    this.setBodyTransform(component.rigidBody, newPosition, newRotation, newScale);
  }

  protected setBodyTransform(
    body: any,
    newPosition?: Vector3,
    newRotation?: Quaternion,
    newScale?: Vector3
  ) {
    if (newPosition) {
      body.position.copy(newPosition);
    }

    if (newRotation) {
      body.quaternion.copy(newRotation);
    }

    if (newScale && body.shapes) {
      body.shapes.forEach((collider, index) => {
        this.setColliderScale(collider.component, body.component, newScale, index);
      });
    }
  }

  public setColliderTransform(
    component: ColliderComponent,
    // note: position and rotation not working in current time
    newPosition?: Vector3,
    newRotation?: Quaternion,
    // only for sphere, box, capsule
    newScale?: Vector3
  ) {
    if (!component) {
      return;
    }

    const {collider} = component;
    const {rigidBody} = component.getOwner<SceneActor>();
    const index = rigidBody.rigidBody.shapes.indexOf(collider);

    if (newScale) {
      this.setColliderScale(component, rigidBody, newScale, index);
    }

    // if want to change qrientation, change the shapeOrientations and rigidBody.updateBoundingRadius
    rigidBody.needUpdateCollider = true;
  }

  protected setColliderScale(
    component: ColliderComponent,
    rigidBodyComp: RigidBodyComponent,
    newScale: Vector3,
    index: number
  ) {
    const {collider} = component;
    const options = component.initState as any;

    // todo: better scale for multiple collider
    switch (component.type) {
      case EColliderType.Box:
        collider.halfExtents.set(
          options.size[0] / 2 * newScale.x,
          options.size[1] / 2 * newScale.y,
          options.size[2] / 2 * newScale.z
        );
        break;
      case EColliderType.Sphere:
        collider.radius = options.radius * newScale.x;
        break;
      default:
        break;
    }

    if (component.type !== EColliderType.Sphere) {
      collider.updateConvexPolyhedronRepresentation();
    }

    const {offset} = options;

    if (offset[0] !== 0 || offset[1] !== 0 || offset[2] !== 0) {
      const off = rigidBodyComp.rigidBody.shapeOffsets[index];
      off.x = offset[0] * newScale.x;
      off.y = offset[1] * newScale.y;
      off.z = -offset[2] * newScale.z;
    }
  }

  /**
   * 强制更新包围盒。
   */
  public updateBounding(component: RigidBodyComponent) {
    component.rigidBody.updateMassProperties();
    component.rigidBody.updateBoundingRadius();
  }

  /**
   * 设置线速度。
   */
  public setLinearVelocity(component: RigidBodyComponent, velocity: Vector3) {
    component.rigidBody.velocity.copy(velocity);
  }

  /**
   * 设置角速度。
   */
  public setAngularVelocity(component: RigidBodyComponent, velocity: Vector3) {
    component.rigidBody.angularVelocity.copy(velocity);
  }

  /**
   * 获取线速度。
   */
  public getLinearVelocity(component: RigidBodyComponent): Vector3 {
    const v = component.rigidBody.velocity;

    if (!v) {
      return null;
    }

    return new Vector3(v.x, v.y, v.z);
  }

  /**
   * 获取角速度。
   */
  public getAngularVelocity(component: RigidBodyComponent): Vector3 {
    const v = component.rigidBody.angularVelocity;

    if (!v) {
      return null;
    }

    return new Vector3(v.x, v.y, v.z);
  }

  /**
   * 设置重力。
   */
  public setBodyMass(component: RigidBodyComponent, mass: number) {
    component.rigidBody.mass = mass;

    if (!component.physicStatic && mass > 0) {
      this.setBodyType(component, ERigidBodyType.Dynamic);
    }

    component.rigidBody.updateMassProperties();
  }

  /**
   * 获取重力。
   */
  public getBodyMass(component: RigidBodyComponent): number {
    return component.rigidBody.mass;
  }

  /**
   * 设置filterGroup，一个32bits的整数，用于给刚体分组。
   */
  public setFilterGroup(component: RigidBodyComponent, group: number) {
    component.rigidBody.collisionFilterGroup = group;
  }

  /**
   * 获取filterGroup。
   */
  public getFilterGroup(component: RigidBodyComponent) {
    return component.rigidBody.collisionFilterGroup;
  }

  /**
   * 设置filterMask，一个32bits的整数，用于给分组后的刚体设置碰撞对象范围。
   */
  public setFilterMask(component: RigidBodyComponent, mask: number) {
    component.rigidBody.collisionFilterMask = mask;
  }

  /**
   * 获取filterMask。
   */
  public getFilterMask(component: RigidBodyComponent) {
    return component.rigidBody.collisionFilterMask;
  }

  /**
   * 设置刚体摩擦力。
   */
  public getBodyFriction(component: RigidBodyComponent): number {
    return component.rigidBody.material.friction;
  }

  /**
   * 获取刚体摩擦力。
   */
  public setBodyFriction(component: RigidBodyComponent, friction: number) {
    component.rigidBody.material.friction = friction;
  }

  /**
   * 获取刚体弹性系数。
   */
  public getBodyRestitution(component: RigidBodyComponent): number {
    return component.rigidBody.material.restitution;
  }

  /**
   * 设置刚体弹性系数。
   */
  public setBodyRestitution(component: RigidBodyComponent, restitution: number) {
    component.rigidBody.material.restitution = restitution;
  }

  /**
   * 使刚体进入睡眠状态，不会触发任何碰撞事件，但可以正确响应拾取操作。
   */
  public sleepBody(component: RigidBodyComponent) {
    component.rigidBody.sleep();
  }

  /**
   * 唤醒刚体。
   */
  public wakeUpBody(component: RigidBodyComponent) {
    component.rigidBody.wakeUp();
  }

  /**
   * 设置刚体类型。
   */
  public setBodyType(component: RigidBodyComponent, type: ERigidBodyType) {
    component.rigidBody.type = type;
  }

  /**
   * 设置碰撞体为触发器。
   */
  public setColliderIsTrigger(component: ColliderComponent, isTrigger: boolean) {
    component.collider.collisionResponse = !isTrigger;
  }

  /**
   * 获取碰撞体是否为触发器。
   */
  public getColliderIsTrigger(component: ColliderComponent): boolean {
    return !component.collider.collisionResponse;
  }

  // public updateDistanceJoint(joint: PhysicsJoint, maxDistance: number, minDistance?: number) {
  //   joint.physicsJoint.distance = maxDistance;
  // }

  // // private enableMotor(joint: IMotorEnabledJoint, motorIndex?: number) {
  // //     if (!motorIndex) {
  // //         joint.physicsJoint.enableMotor();
  // //     }
  // // }

  // // private disableMotor(joint: IMotorEnabledJoint, motorIndex?: number) {
  // //     if (!motorIndex) {
  // //         joint.physicsJoint.disableMotor();
  // //     }
  // // }

  // public setMotor(joint: IMotorEnabledJoint, speed?: number, maxForce?: number, motorIndex?: number) {
  //   if (!motorIndex) {
  //     joint.physicsJoint.enableMotor();
  //     joint.physicsJoint.setMotorSpeed(speed);
  //     if (maxForce) {
  //       this.setLimit(joint, maxForce);
  //     }
  //   }
  // }

  // public setLimit(joint: IMotorEnabledJoint, upperLimit: number, lowerLimit?: number) {
  //   joint.physicsJoint.motorEquation.maxForce = upperLimit;
  //   joint.physicsJoint.motorEquation.minForce = lowerLimit === void 0 ? -upperLimit : lowerLimit;
  // }

  // public syncMeshWithImpostor(mesh: AbstractMesh, component: RigidBodyComponent) {
  //   const body = component.rigidBody;

  //   mesh.position.x = body.position.x;
  //   mesh.position.y = body.position.y;
  //   mesh.position.z = body.position.z;

  //   if (mesh.rotationQuaternion) {
  //     mesh.rotationQuaternion.x = body.quaternion.x;
  //     mesh.rotationQuaternion.y = body.quaternion.y;
  //     mesh.rotationQuaternion.z = body.quaternion.z;
  //     mesh.rotationQuaternion.w = body.quaternion.w;
  //   }
  // }
}
