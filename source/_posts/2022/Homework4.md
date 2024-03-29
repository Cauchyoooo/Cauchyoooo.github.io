---
layout: post
title:  "HW4: 游戏对象与图形基础"
date:   2022-11-05 14:00:00 +0800
tags:
- unity
categories: Game
subtitle: '游戏对象与图形基础'
---

> 作业简介：
>
> 1.基本操作演练（游戏场景）
>
> 2.编程实践

<!--more-->

:shallow_pan_of_food:

### 一、基本操作演练

* 下载Fantasy Skybox FREE，构建自己的游戏场景（含天空、光源、音效、地形）

![scene](/img/2022/Homework4/scene.jpg)

* 写一个简单的总结，总结游戏对象的使用

目前学习到的一些游戏对象包括：3D Object里的基本物体和Terrain、Light、Camera、Skybox、Audio。每个GameObject都有Transform属性来设置位置旋转大小等。

- 基本物体（Cube、Sphere之类的）：单纯的物体，通过添加材质更改外观，添加各种组件实现功能。

- Terrain：地面，通过Terrain自带的编辑工具可以编辑地形，如更改地形大小，修改地形高度，给地形“上色”，还可以添加树木花草等。我们更多地会选择使用别人做好现成的素材。

    ![terrain1](/img/2022/Homework4/terrain1.jpg)

    ![terrain2](/img/2022/Homework4/terrain2.jpg)

- Light：灯光。光影的合理设置能更好地表达3D环境的颜色与情绪。有平行光、聚光灯、点光源、区域光等，不同光有不同属性面板。

    如点光源这个面板，我们能看到像颜色、阴影等设置。

    ![Light](/img/2022/Homework4/Light.jpg)

- Camera：摄影机。第一人称游戏可以作为玩家的眼睛，第三人称游戏可以跟随玩家运动。多摄像机是制造效果的重要手段。摄像机属性面板如下：

    ![Camera](/img/2022/Homework4/Camera.jpg)

    各属性说明可参考官方文档：[https://docs.unity.cn/cn/2021.3/Manual/class-Camera.html][link1]

    [link1]:https://docs.unity.cn/cn/2021.3/Manual/class-Camera.html

- Skybox：天空盒（一种材料）。根据shader着色器的类型不同，需要配置不同的天空盒素材。如Skybox/Cubemap是一个圆形图片、Mobile/Skybox是6面图片、Skybox/Panoramic是一张全景图。制作好天空盒材质后，可以放到Camera的Skybox部件中。

    ![skybox](/img/2022/Homework4/skybox.jpg)

    ![skybox2](/img/2022/Homework4/skybox2.jpg)

- Audio：音源。可利用Audio Source在场景中播放声音，利用附着在角色对象上的Audio Listener监听场景中的声音。Audio Source可以设置为3D，听起来有立体的效果。通过混响等技巧可以产生更复杂的效果。

    ![audio](/img/2022/Homework4/audio.jpg)

:ramen:

### 二、编程实践

牧师与魔鬼 动作分离版+设计一个裁判类（当游戏到达结束条件时，通知场景控制器游戏结束）

项目地址：[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw4/Assets/Scripts][link2]

[link2]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw4/Assets/Scripts

对比上一个版本的一些区别：

* 将动作抽离出来形成一个动作管理器
* 增加了裁判类通知游戏结束
* 增加了计时器功能
* 游戏结束会在船靠岸之后才提示弹出来

实际效果如下图：

![anime](/img/2022/Homework4/anime.gif)



#### 1 动作管理器的设计

![uml](/img/2022/Homework4/uml.jpg)

* 通过门面模式（控制器模式）输出组合好的几个动作，供原来程序调用。
* 通过组合模式实现动作组合，按组合模式设计方法
* 接口回调（函数回调）实现管理者与被管理者解耦
* 通过模板方法，让使用者减少对动作管理过程细节的要求
* 优点：
    * 程序更能适应需求变化
    * 对象更容易被复用
    * 程序更易于维护



**1.动作基类(SSAction)**

* SSAction是动作的基类，其他动作类都继承于它。
* ScriptableObject是不需要绑定GameObject对象的可编程基类。这些对象受Unity引擎场景管理。
* protected 防止用户自己new抽象的对象
* 使用virtual申明虚方法，通过重写实现多态。
* 利用接口(ISSActionCallback)实现消息通知，避免与动作管理者直接依赖

```c#
public class SSAction : ScriptableObject 
{
    public bool enable = true;
    public bool destroy = false;

    public GameObject gameObject {get; set;}
    public Transform transform {get; set;}
    public ISSActionCallback callback {get; set;}

    protected SSAction(){}

    public virtual void Start()
    {
        throw new System.NotImplementedException();
    }

    public virtual void Update()
    {
        throw new System.NotImplementedException();
    }
}
```



**2.动作管理基类(SSActionManager)**

* 该类实现所有动作的基本管理，CCActionManager会继承于它。
* 利用一个动作字典来进行动作的运行，先将waitingAdd中的动作加入字典中，运行动作后，再将它加入到waitingDelete中销毁。由于字典是线程不安全的，如果控制好队列，如每次最多存在一个动作，就不会导致动作的混乱。
* 提供了添加新动作的方法RunAction。该方法把游戏对象与动作绑定，并绑定该动作事件的消息接受者。



```c#
public class SSActionManager : MonoBehaviour {
    //动作集，以字典形式存在
    private Dictionary<int, SSAction> actions = new Dictionary<int, SSAction>();
    //等待被加入的动作队列(动作即将开始)
    private List<SSAction> waitingAdd = new List<SSAction>();
    //等待被删除的动作队列(动作已完成)
    private List<int> waitingDelete = new List<int>();

    protected void Update()
    {
        //将waitingAdd中的动作保存
        foreach (SSAction ac in waitingAdd)
            actions[ac.GetInstanceID()] = ac;
        waitingAdd.Clear();

        //运行被保存的事件
        foreach (KeyValuePair<int, SSAction> kv in actions)
        {
            SSAction ac = kv.Value;
            if (ac.destroy)
            {
                waitingDelete.Add(ac.GetInstanceID());
            }
            else if (ac.enable)
            {
                ac.Update();
            }
        }

        //销毁waitingDelete中的动作
        foreach (int key in waitingDelete)
        {
            SSAction ac = actions[key];
            actions.Remove(key);
            Destroy(ac);
        }
        waitingDelete.Clear();
    }

    //准备运行一个动作，将动作初始化，并加入到waitingAdd
    public void RunAction(GameObject gameObject, SSAction action, ISSActionCallback manager)
    {
        action.gameObject = gameObject;
        action.transform = gameObject.transform;
        action.callback = manager;
        waitingAdd.Add(action);
        action.Start();
    }

    protected void Start()
    {
        
    }
}
```



**3.动作事件接口定义(ISSActionCallback)**

* 接口作为接收通知对象的抽象类型，所有事件管理者都必须实现该接口，来实现事件调度。
* 事件类型定义，使用了**枚举变量**。

```c#
public enum SSActionEventType:int {Started, Completed}
public interface ISSActionCallback
{
    //回调函数
    void SSActionEvent(
        SSAction source,
        SSActionEventType events = SSActionEventType.Completed,
        int intParam = 0,
        string strParam = null,
        Object objectParam = null
    );
}
```



**4.简单动作实现(CCMoveToAction)**

* 实现移动动作，将物体移动到目标位置，并通知任务完成。
* 让Unity创建动作类，确保内存正确回收。
* override 多态，c++必须申明重写，java则默认重写。

```c#
public class CCMoveToAction : SSAction
{
    
    public Vector3 target; //目的地
    public float speed; //速度
    
    private CCMoveToAction(){}

    //生产函数(工厂模式)
    public static CCMoveToAction GetSSAction(Vector3 target, float speed)
    {
        CCMoveToAction action = ScriptableObject.CreateInstance<CCMoveToAction>();
        action.target = target;
        action.speed = speed;
        return action;
    }

    public override void Start(){}
    
    public override void Update()
    {
        //判断是否符合移动条件
        if (this.gameObject == null || this.transform.position == target)
        {

            this.destroy = true;
            this.callback.SSActionEvent(this);
            return;
        }
        //移动
        this.transform.position = Vector3.MoveTowards(this.transform.position, target, speed * Time.deltaTime);
    }    
}
```



**5.顺序动作组合类实现(CCSequenceAction)**

* 实现一个动作组合序列，顺序播放动作。
* 让动作组合继承抽象动作SSAction，能够进一步组合；实现回调接收，能接受被组合动作的事件。
* 创建一个动作顺序执行序列，-1表示无限循环，start开始动作。
* SSActionEvent 收到当前动作执行完成，推下一个动作，如果完成一次循环，减次数。如完成，通知该动作的管理者。
* Start 执行动作前，为每个动作注入当前动作游戏对象，并将自己作为动作事件的接收者。
* OnDestroy 如果自己被注销，应该释放自己管理的动作。这里不会被注销，因此没有实现该功能。
* 这是标准的组合设计模式。被组合对象和组合对象同属一种类型。通过该模式，我们能实现几乎满足所有越位需要、非常复杂的动作管理。

```c#
public class CCSequenceAction : SSAction, ISSActionCallback
{
    public List<SSAction> sequence; //动作序列
    public int repeat = -1; //重复次数
    public int start = 0; //动作开始指针

    //生产函数(工厂模式)
    public static CCSequenceAction GetSSAction(int repeat, int start, List<SSAction> sequence)
    {
        CCSequenceAction action = ScriptableObject.CreateInstance<CCSequenceAction>();
        action.repeat = repeat;
        action.sequence = sequence;
        action.start = start;
        return action;
    }

    public override void Start()
    {
        foreach (SSAction action in sequence)
        {
            action.gameObject = this.gameObject;
            action.transform = this.transform;
            action.callback = this;
            action.Start();
        }
    }

    public override void Update()
    {
        if (sequence.Count == 0)    
            return;
        if (start < sequence.Count)
            sequence[start].Update();
    }

    //回调处理，当有动作完成时触发
    public void SSActionEvent(
        SSAction source,
        SSActionEventType events = SSActionEventType.Completed,
        int Param = 0,
        string strParam = null,
        Object objectParam = null)
    {
        source.destroy = false;
        this.start++;
        if (this.start >= sequence.Count)
        {
            this.start = 0;
            if (repeat > 0)
                repeat--;
            if (repeat == 0)
            {
                this.destroy = true;
                this.callback.SSActionEvent(this);
            }
        }
    }

    void OnDestroy()
    {
        //TODO: Something
    }
}
```



**6.动作组合管理(CCActionManager)**

上一版本的moveable脚本拆分到这个类和FirstController的方法中，实现船和角色的移动管理。

```c#
// 将原来移动的方法 放在这里
public class CCActionManager : SSActionManager, ISSActionCallback
{
    //是否正在运动
    private bool isMoving = false;
    //船移动动作类
    public CCMoveToAction moveBoatAction;
    //人移动动作类(需要组合)
    public CCSequenceAction moveRoleAction;
    //控制器
    public FirstController controller;

    protected new void Start()
    {
        controller = (FirstController)Director.getInstance().currentSceneController;
        controller.actionManager = this;
    }

    public bool IsMoving()
    {
        return isMoving;
    }

    //移动船
    public void MoveBoat(GameObject boat, Vector3 target, float speed)
    {
        if (isMoving)
            return;
        isMoving = true;
        moveBoatAction = CCMoveToAction.GetSSAction(target, speed);
        this.RunAction(boat, moveBoatAction, this);
    }

    //移动人
    public void MoveRole(GameObject role, Vector3 mid_destination, Vector3 destination, int speed)
    {
        if (isMoving)
            return;
        isMoving = true;
        moveRoleAction = CCSequenceAction.GetSSAction(0, 0, new List<SSAction> 
            {   CCMoveToAction.GetSSAction(mid_destination, speed), 
                CCMoveToAction.GetSSAction(destination, speed) });
        this.RunAction(role, moveRoleAction, this);
    }

    //回调函数
    public void SSActionEvent(SSAction source,
    SSActionEventType events = SSActionEventType.Completed,
    int intParam = 0,
    string strParam = null,
    Object objectParam = null)
    {
        isMoving = false;
    }
}
```



#### 2 部分控制类的设计

**1.最高层控制器(FirstController)**

* 这里仅展示有增改的函数方法，增添了一个裁判反馈信息`JudgeCallback`，实现裁判类的回调函数。
* 将原有检测游戏状态的check函数抽离给裁判类JudgeController处理。
* 处理了原有可移动脚本moveable的一些部分，利于与动作管理器结合。

```c#
public class FirstController : MonoBehaviour, ISceneController, IUserAction
{
    readonly Vector3 waterPos = new Vector3(0,0.5F,0);
    public CCActionManager actionManager;
    public JudgeController judgeController;
    public CoastController startCoast;
    public CoastController endCoast;
    public BoatController boat;
    private myCharacterController[] characters;
    myUserGUI userGUI;
    public bool isRunning;
    public float time;

    public void JudgeCallback(bool _isRunning, string message)
    {
        userGUI.gameMessage = message;
        userGUI.time = (int)time;
        this.isRunning = _isRunning;
    }

    void Start ()
    {
        Director director = Director.getInstance();
        director.currentSceneController = this;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;
        actionManager = gameObject.AddComponent<CCActionManager>() as CCActionManager;
        judgeController = gameObject.AddComponent<JudgeController>() as JudgeController;
        characters = new myCharacterController[6];
        isRunning = true;
        time = 60;
        LoadResources();
    }

    public void moveBoat(){
        if(isRunning == false || actionManager.IsMoving())
            return;
        if(boat.isEmpty())
            return;
        string direct = boat.getDirection();
        Vector3 destination = boat.getPosition();        
        if (direct == "End") {
			boat.setDirection("Start");
		} 
		else {
			boat.setDirection("End");
		}
        actionManager.MoveBoat(boat.getGameobj(), destination, 20);
    }

    public void ClickCharacter(myCharacterController cC){
        if(isRunning == false || actionManager.IsMoving())
            return;
        if(cC.isOnBoat()){
            CoastController coast;
            if(boat.getDirection()=="Start")
                coast = startCoast;
            else
                coast = endCoast;

            boat.getOffBoat(cC.getName());
            Vector3 destination = coast.getEmptyPosition();
            Vector3 middle = destination;
            if (destination.y < cC.GetGameObject().transform.position.y) {
			    middle.y = cC.GetGameObject().transform.position.y;
		    } 
		    else {
			    middle.x = cC.GetGameObject().transform.position.x;
		    }
            // cC.moveTo(coast.getEmptyPosition());
            actionManager.MoveRole(cC.GetGameObject(), middle, destination, 20);
            cC.getOnCoast(coast);
            coast.getOnCoast(cC);
        }
        else{
            CoastController coast = cC.getCoastController();
            if(boat.getEmptyIndex () == -1 || coast.getDirection() != boat.getDirection())
                return;
            coast.getOffCoast(cC.getName());
            Vector3 destination = boat.getEmptyPosition();
            Vector3 middle = destination;
            if (destination.y < cC.GetGameObject().transform.position.y) {
			    middle.y = cC.GetGameObject().transform.position.y;
		    } 
		    else {
			    middle.x = cC.GetGameObject().transform.position.x;
		    }
            actionManager.MoveRole(cC.GetGameObject(), middle, destination, 20);
            // cC.moveTo(boat.getEmptyPosition());
            cC.getOnBoat(boat);
            boat.getOnBoat(cC);
        }
    }

    public void Restart(){
        //boat 移动归位
        if(boat.getDirection()=="End"){
            Vector3 destination = boat.getPosition();
            actionManager.MoveBoat(boat.getGameobj(), destination, 20);
        }
        boat.reset();
        startCoast.reset();
        endCoast.reset();
        for(int i=0;i<characters.Length;i++)
            characters[i].reset();
        isRunning = true;
        time = 60;
    }

}
```



**2.裁判类(JudgeController)**

实现原有FristController的check函数功能，检测游戏状态，在游戏结束时用过回调信息通知FirstController。

```c#
public class JudgeController : MonoBehaviour {
    public FirstController mainController;
    public CoastController startCoast;
    public CoastController endCoast;
    public BoatController boat;


    void Start()
    {
        this.mainController = (FirstController)Director.getInstance().currentSceneController;
        this.startCoast = mainController.startCoast;
        this.endCoast = mainController.endCoast;
        this.boat = mainController.boat;

    }

    void Update()
    {
        if (!mainController.isRunning)
            return;
        if(!boat.isStop())
            return;
        if (mainController.time <= 0)
        {
            mainController.JudgeCallback(false, "Game Over!");
            return;
        }
        
        this.gameObject.GetComponent<myUserGUI>().gameMessage = "";

        int startPriest = 0;
        int endPriest = 0;
        int startDevil = 0;
        int endDevil = 0;

        int[] startCount = startCoast.getNum();
        startPriest += startCount[0];
        startDevil += startCount[1];

        int[] endCount = endCoast.getNum();
        endPriest += endCount[0];
        endDevil += endCount[1];

        if(endDevil+endPriest ==6){
            mainController.JudgeCallback(false, "You Win!");
            return;
        }

        int[] boatCount = boat.getNum();
        if(boat.getDirection() == "End"){
            endPriest += boatCount[0];
            endDevil += boatCount[1];
        }
        else{
            startPriest += boatCount[0];
            startDevil += boatCount[1];
        }

        if(startPriest<startDevil && startPriest>0){
            mainController.JudgeCallback(false, "Game Over!");
            return;
        }
        if(endPriest<endDevil && endPriest>0){
            mainController.JudgeCallback(false, "Game Over!");
            return;
        }
    }
}
```





> Cauchy        2022.11.05