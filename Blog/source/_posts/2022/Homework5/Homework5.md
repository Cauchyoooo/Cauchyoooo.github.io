---
layout: post
title:  "HW5: 与游戏世界交互"
date:   2022-11-13 14:00:00 +0800
tags: 
- unity
- singleton
categories: Game
subtitle: '与游戏世界交互'
---

> 作业简介：
>
> 1.自定义组件：涉及SciptableObject
>
> 2.编程实践（Hit UFO）：涉及工厂模式

<!--more-->

:gem:

### 一、自定义组件

* 用自定义组件定义几种飞碟，做成预制

这里借用资源商店的Sets - Gems里的prefab（都是宝石呀）作为飞碟原型。

先利用 ScriptableObject 设定飞碟的属性

```c#
[System.Serializable]
public class Attributes{
    [Tooltip("大小")]
    public int size;
    [Tooltip("速度")]
    public int speed;
    [Tooltip("得分")]
    public int score;
}

[CreateAssetMenu(fileName = "DiskItem", menuName = "(ScritableObject)DiskItem")]
public class DiskItem : ScriptableObject
{
    public string Name;
    public string Desc;
    [Tooltip("飞碟属性")]
    public Attributes attributes;
}
```

分数与对应的属性如下表所示:

| 分数 | 大小 | 速度 |
| ---- | ---- | ---- |
| 1    | 2    | 15   |
| 2    | 1    | 17   |
| 5    | 1    | 20   |
| 9    | 1    | 35   |

形状颜色与之匹配的分数规则如下图所示：

![01](../../../assets/game/1113/01.png)

再利用Monobehavior脚本为各飞碟附上相应属性

```c#
public class Test : MonoBehaviour
{
    public DiskItem diskItem;
}
```

这样，我们自定义的预制件就做好了。

:space_invader:

### 二、编程实践

项目地址：[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw5/Assets][link]

[link]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw5/Assets

* 编写一个简单的鼠标打飞碟游戏
    * 游戏有多个round，每个round包括数次trial；
    * 每个trial的飞碟属性（色彩、大小、发射位置、速度、角度）及同时出现的个数都可能不同；
    * 每个trial的飞碟有随机性，总体难度随round上升；
    * 鼠标点中得分，得分规则按飞碟属性不同计算，规则可自定义。
* 要求：
    * 使用带缓存的工厂模式管理不同飞碟的生产与回收，该工厂必须是场景单实例的！具体实现可参考资源Singleton模板类；
    * 尽可能使用前面MVC结构实现人机交互与游戏模型分离。



#### 简单工厂

简单工厂又称为工厂方法，即类一个方法能够得到一个对象实例，使用者不需要知道该实例如何构建、初始化等细节。

* 游戏对象的创建与销毁高成本，必须减少销毁次数。
* 屏蔽创建与销毁的业务逻辑，是程序易于扩展。

在Unity中，**工厂方法+单实例+对象池** 通常都是同时一起用。这里给出一个设计例子：

![02](../../../assets/game/1113/02.png)

其中：

* DiskFactory 类是一个单实例类，用钱买场景单实例创建
* DiskFactory 类有工厂方法 GetDisk 产生飞碟，有回收方法 FreeDisk
* DiskFactory 使用模板模式根据预制和规则制作飞碟
* 对象模板包括飞碟对象与飞碟数据



#### 实现效果

![04](../../../assets/game/1113/04.gif)



#### 代码框架

![03](../../../assets/game/1113/03.png)

其中标注了**固定模板**的类是基本与前几次作业使用的代码一致，除了`Singleton`是本次作业新增的。

`Singleton`代码如下：

```c#
public class Singleton<T> : MonoBehaviour where T : MonoBehaviour
{
    protected static T instance;

    public static T Instance{
        get{
            if(instance == null){
                instance = (T)FindObjectOfType(typeof(T));
                if(instance == null){
                    Debug.LogError(
                        "An instance of "+
                        typeof(T)+
                        " is needed in the scene, but there is none."
                    );
                }
            }
            return instance;
        }
    }
}
```



#### 主要代码

**CCFlyAction**

用于飞行动作。通过改变游戏对象position的z轴来实现其移动，也加入了游戏对象自己旋转。当z轴坐标不大于-20时，理解为飞出屏幕，销毁处理。

```c#
public class CCFlyAction : SSAction
{
    public float speed;
    public static CCFlyAction GetCCFlyAction(float s){
        CCFlyAction action = ScriptableObject.CreateInstance<CCFlyAction>();
        action.speed = s;
        return action;
    }

    public override void Start(){}

    public override void Update()
    {
        //飞碟已经被"销毁"
        if (this.transform.gameObject.activeSelf == false) { 
            Debug.Log("Hit Destroy");
            this.destroy = true;
            this.callback.SSActionEvent(this);
            return;
        }
        if(this.transform.position.z <= -20){
            Debug.Log("Out Destroy");
            this.destroy = true;
            this.callback.SSActionEvent(this);
            return;
        }

        transform.position -= new Vector3(0, 0, speed * Time.deltaTime);
        transform.Rotate(new Vector3(0, 10 * Time.deltaTime, 30 * Time.deltaTime));
    }
}
```



**CCActionManager**

用于管理飞行动作。**注**：其中这里的`Update()`不需要实现，则不要`new`，否则不能进入基类已编写好的`Update()`函数。

```c#
public class CCActionManager : SSActionManager, ISSActionCallback 
{
    public RoundController sceneController;
    public CCFlyAction action;
    public DiskFactory factory;

    protected new void Start()
    {
        sceneController = (RoundController)Director.getInstance().currentSceneController;
        sceneController.actionManager = this;
        factory = Singleton<DiskFactory>.Instance;
    }

    // protected new void Update(){}

    public void SSActionEvent(
        SSAction source,
        SSActionEventType events = SSActionEventType.Completed,
        int intParam = 0,
        string strParam = null,
        Object objectParam = null) {
            factory.freeDisk(source.transform.gameObject);
    }

    public void MoveDisk(GameObject disk) {
        action = CCFlyAction.GetCCFlyAction((float)disk.GetComponent<Test>().diskItem.attributes.speed);
        RunAction(disk, action, this);
    }
}
```



**IUserAction & ISceneController**

用户动作及场景动作的接口。两者共用一个`getHit()`来检测用户点击场景的游戏对象。

```c#
public interface IUserAction
{
    void gameOver();
    void getHit();
    void Restart();
}

public interface ISceneController
{
    void LoadResource();
    void getHit();
}
```



**DiskFactory**

飞碟工厂。used用于存储创造出来的飞碟，free用于要销毁的飞碟。由于飞碟对象使用我们前面制作的预制件，所以只需要使用及对不同round做一些处理即可。

对于第一轮，只会出现1分与2分的飞碟；第二轮只会出现1分、2分与5分的飞碟；第三轮往后会出现所有种类的飞碟。要注意飞碟加分与扣分的区别。飞碟的出生位置，随轮数增加而中心向外扩。

```c#
public class MyException : System.Exception
{
    public MyException(){}
    public MyException(string message) : base(message){}
}

public class DiskFactory : MonoBehaviour
{
    List<GameObject> used;
    List<GameObject> free;
    System.Random rand;

    void Start()
    {
        used = new List<GameObject>();
        free = new List<GameObject>();
        rand = new System.Random();
    }

    void Update(){}

    public string getDiskName(int seed){
        if(seed == 1)
            return "Prefabs/Bomb1a";
        if(seed == 2)
            return "Prefabs/Bomb1b";
        if(seed == 3)
            return "Prefabs/Bomb1c";
        if(seed == 4)
            return "Prefabs/Disk1a";    
        if(seed == 5)
            return "Prefabs/Disk1b";    
        if(seed == 6)
            return "Prefabs/Disk1c";
        if(seed == 7)
            return "Prefabs/Disk2a";
        if(seed == 8)
            return "Prefabs/Disk2b";
        if(seed == 9)
            return "Prefabs/Bomb5a";
        if(seed == 10)
            return "Prefabs/Disk5a";
        if(seed == 11)
            return "Prefabs/Bomb5b";
        if(seed == 12)
            return "Prefabs/Disk5b";
        if(seed == 13)
            return "Prefabs/Bomb9";
        if(seed == 14)
            return "Prefabs/Disk9";               
        return "Error";
    }

    public GameObject createDisk(int round){
        GameObject disk;
        int right=7;
        if(round == 1)
            right = 7;
        else if(round == 2)
            right = 10;
        else
            right = 14;
            
        if(free.Count != 0){
            disk = free[0];
            free.Remove(disk);
        }
        else{
            string getName = getDiskName(rand.Next(1,right+1));
            disk = GameObject.Instantiate(Resources.Load(getName, typeof(GameObject))) as GameObject;
        }
        int roundX = round*10;
        int roundY = round*6;
        int roundZ = 100+round*20;
        disk.transform.position = new Vector3(rand.Next(-roundX,roundX+1), rand.Next(-roundY,roundY+1), rand.Next(80,roundZ));

        int scale = disk.GetComponent<Test>().diskItem.attributes.size;
        disk.transform.localScale = new Vector3(scale, scale, scale);
        
        used.Add(disk);
        disk.SetActive(true);
        Debug.Log("Generate disk success");
        return disk; 
    }

    public void freeDisk(GameObject disk){
        disk.SetActive(false);
        if (!used.Contains(disk)) {
            throw new MyException("Try to remove a item from a list which doesn't contain it.");
        }
        Debug.Log("Free disk success");
        used.Remove(disk);
        free.Add(disk);
    }
}
```



**RoundController**

局数控制器。相当于之前的FirstController。实现了用户行为与场景行为的接口。实现了每局产生飞碟的函数。每个round会有4次发射，每次发射6个飞碟，发射间隔会根据round增加而减小。利用射线碰撞检测鼠标点击飞碟。**注**：预制件中的飞碟必须要加入collider碰撞器。否则无法检测射线碰撞。

```c#
public class RoundController : MonoBehaviour, ISceneController, IUserAction
{
    int round = 1;
    int currDisk = 0;
    int max_round = 5;
    float timer = 1.0f;
    GameObject disk;
    DiskFactory factory;
    public CCActionManager actionManager;
    public ScoreController scoreController;
    public myUserGUI userGUI;

    void Start()
    {   
        Director director = Director.getInstance();
        director.currentSceneController = this;
        director.currentSceneController.LoadResource();
        gameObject.AddComponent<DiskFactory>();
        factory = Singleton<DiskFactory>.Instance;
        actionManager = gameObject.AddComponent<CCActionManager>() as CCActionManager;
        scoreController = gameObject.AddComponent<ScoreController>() as ScoreController;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;

    }
    // No need to loadresource
    public void LoadResource(){}

    void Update()
    {
        if(userGUI.mode == 0)
            return;
        getHit();
        gameOver();
        if(round>max_round)
            return;
        timer -= Time.deltaTime;
        if(timer<=0 ){
            for(int i=0; i<6;i++){
                disk = factory.createDisk(round);
                actionManager.MoveDisk(disk);
            }
            currDisk+=6;
            if(round<=max_round)
                userGUI.round = round;
            timer = (float)(4-round*0.5);
            if(currDisk%24 == 0){
                round++;
                timer = 10.0F;
            }
        }
    }

    public void gameOver()
    {
        if (round > max_round && actionManager.RemainActionCount() == 0)
            userGUI.gameMessage = "Game Over!";
    }

    public void getHit()
    {
        // 按钮设置 名为“Fire1”监听鼠标点击
        if (Input.GetButtonDown("Fire1")) {
            Debug.Log("Fire pressed");
			Camera ca = Camera.main;
			Ray ray = ca.ScreenPointToRay(Input.mousePosition);

			RaycastHit hit;
			if (Physics.Raycast(ray, out hit)) {
                Debug.Log(hit.transform.gameObject.name);
                scoreController.Record(hit.transform.gameObject);
                hit.transform.gameObject.SetActive(false);
			}
        }
    }

    public void Restart(){
        round = 1;
        currDisk = 0;
        timer = 1.0F;
        scoreController.Reset();
        userGUI.Reset();
    }
    
}
```



**ScoreController**

分数控制器。用于简单的计分功能。由于预制件中扣分的飞碟的score属性已经为负，此处的`Record`函数的score直接加就可以了。

```c#
public class ScoreController : MonoBehaviour
{
    public int score;
    public RoundController roundController;
    public myUserGUI userGUI;
    void Start()
    {
        roundController = (RoundController)Director.getInstance().currentSceneController;
        roundController.scoreController = this;
        userGUI = this.gameObject.GetComponent<myUserGUI>();
    }

    public void Record(GameObject disk){
        score += disk.GetComponent<Test>().diskItem.attributes.score;
        userGUI.score = score;
    }

    public void Reset(){
        score = 0;
    }
}
```



**myUserGUI**

用户界面。分为主界面`mainMenu`和游玩界面`gameStart`。

```c#
public class myUserGUI : MonoBehaviour
{
    public int mode;
    public int score;
    public int round;
    public string gameMessage;
    private IUserAction action;
    public GUIStyle titleStyle, textStyle;
    private int menu_w = Screen.width/5, menu_h = Screen.height/5;

    void Start()
    {
        mode = 0;
        gameMessage = "";
        action = Director.getInstance().currentSceneController as IUserAction;
    
        titleStyle = new GUIStyle();
        titleStyle.normal.textColor = Color.white;
        titleStyle.normal.background = null;
        titleStyle.fontSize = 50;
        titleStyle.alignment = TextAnchor.MiddleCenter;

        textStyle = new GUIStyle();
        textStyle.normal.textColor = Color.white;
        textStyle.normal.background = null;
        textStyle.fontSize = 20;
        textStyle.alignment = TextAnchor.MiddleCenter;

    }

    void Update(){}

    void OnGUI()
    {
        GUI.skin.button.fontSize = 35;
        switch(mode){
            case 0:
                mainMenu();
                break;
            case 1:
                gameStart();
                break;
        }
    }

    void mainMenu()
    {
        GUI.Label(new Rect(Screen.width / 2 - menu_w * 0.5f, Screen.height * 0.1f, menu_w, menu_h), "Hit UFO", titleStyle);
        bool button = GUI.Button(new Rect(Screen.width / 2 - menu_w * 0.5f, Screen.height * 3 / 7, menu_w, menu_h), "Start");
        if (button) {
            mode = 1;
        }
    }

    void gameStart()
    {
        GUI.Label(new Rect(Screen.width/2-100, Screen.height/2-60, 200, 50), gameMessage, titleStyle);
        GUI.Label(new Rect(0, 0, 100, 50), "Score: " + score, textStyle);
        GUI.Label(new Rect(Screen.width-100, 0, 100, 50), "Round: " + round, textStyle);
        if (gameMessage == "Game Over!") {
			if (GUI.Button(new Rect(Screen.width/2-100, Screen.height/2, 200, 50), "Restart")) {
				action.Restart ();
			}
		}
    }

    public void Reset()
    {
        score = 0;
        round = 1;
        mode = 0;
        gameMessage = "";
    }
    
}
```



> 2022.11.13				Cauchy