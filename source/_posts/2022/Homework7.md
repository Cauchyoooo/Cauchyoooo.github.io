---
layout: post
title:  "HW7: 模型与动画"
date:   2022-12-18 14:00:00 +0800
tags:
- unity
- animator
categories: Game
subtitle: '模型与动画'
---

> 作业简介：
>
> 1. 智能巡逻兵(动画、订阅/发布模式)

<!--more-->

:fox_face:

## 智能巡逻兵

#### 设计要求

* 创建一个地图和若干巡逻兵（使用动画）；
* 每个巡逻兵走一个3-5个边的凸多边形，位置数据是相对地址。即每次确定下一个目标位置，用自己当前位置为原点计算；
* 巡逻兵碰撞到障碍物，则会自动选下一个点为目标；
* 巡逻兵在设定范围内感知到玩家，会自动追击玩家；
* 失去玩家目标后，继续巡逻；
* 计分：玩家每次甩掉一个巡逻兵计一分，与巡逻兵碰撞游戏结束；

#### 程序设计要求

* 必须使用订阅与发布模式传消息
* 工厂模式生产巡逻兵



#### 项目地址

[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw7/Assets][link]

[link]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw7/Assets

#### 效果展示图

地图展示

![map](/img/2022/Homework7/map.gif)

游戏展示

![game](/img/2022/Homework7/game.gif)



#### 玩法

​	你是一个狐狸妈咪，你在和你的7个小狐狸宝贝玩捉迷藏。你有一堆烦人的动物朋友，分别为猩猩、老虎和鸽子，你一靠近他们，他们就会追着你喋喋不休。要是被它们逮到，你就会被他们烦死。你要做的是快速地绕开你的烦人朋友，找到你的所有宝贝狐狸们。**方向键控制行进，按住左shift键进行加速，鼠标右键移动视角。**



### 1.  预制件制作

本次作业选用了Asset store里的资源包[《Quirky Series Vol.2 [v1.3]》][link2]。

[link2]:https://assetstore.unity.com/packages/3d/characters/animals/quirky-series-animals-mega-pack-vol-2-183280

角色主要分为3类：Player玩家：大狐狸；巡逻兵：其他动物；可拾取物体：小狐狸。

#### 组件设置

​	点开Jungle Vol.1/Prefabs/RedPanda_LOD1，可以看到如图所示。为了简化模型，没有使用带有Lod Group的prefabs，这里选取的是较为精细的lod1。

![01](/img/2022/Homework7/01.png)

​	对于**Player玩家**来说，我们只需要在最外层的父对象挂一个rigidbody就行，碰撞检测的部分由其他碰撞体实现。该rigidbody属性如下图所示。这里为了方便没有使用重力。注意到Constraints处勾选了几项，是因为在调试过程中，遇到了**碰撞抖动**问题。本次作业角色移动没有利用物理学，碰撞后受力就会发生奇怪的运动。这里采取锁定刚体旋转和部分位移的方式解决。

![02](/img/2022/Homework7/02.png)

​	

​	对于**巡逻兵**来说，在最外层的父对象挂上rigidbody和两个脚本（一个是属性脚本，一个是检测玩家碰撞的脚本）。这里的rigidbody和上述设置类似。创建Collider空子对象，挂上一个方盒碰撞器并设为触发器，再挂上一个用于检测玩家范围的脚本。巡逻兵大体都也是这样做。差异只在属性脚本和检测范围上面。

![03](/img/2022/Homework7/03.png)

![04](/img/2022/Homework7/04.png)

​	对于**拾取的物体**来说，父对象挂一个碰撞器并设为触发器，再挂一个检测玩家碰撞的脚本即可。这里没有用mesh碰撞器，觉得拾取范围可以模糊一点。

![05](/img/2022/Homework7/05.png)



#### 动画控制器制作

​	点开官方的AC_Red Panda(Animator Controller)，我们可以看到有两个层，一个是控制整体动作，一个是控制眼睛动作。其中，整体动作可以直接通过Inspector预览，而眼睛动作需要将模型拖到Inspector才可预览，也可直接先在官方给出的Demo场景中预览。

![06](/img/2022/Homework7/06.png)

![07](/img/2022/Homework7/07.png)

为了简单起见，本作业只用到了其中很少的动作。

​	下图是Player的动画控制器，包含三个bool类型参数：存活live、是否行走isWalk、是否奔跑isRun。动作只有默认状态Idle、行走Walk、奔跑Run及死亡Death。这里Idle到Exit的过渡没有条件，会被系统自动忽略。

![08](/img/2022/Homework7/08.png)

​	下图是Idle过渡到Walk的设置。注意，这里的动作大多没有Exit Time，因为满足过渡条件时，如进入行走、进入攻击等动作变化需要马上执行，不需要等待上一个动作做完。

![09](/img/2022/Homework7/09.png)

​	下图是**巡逻兵**的动画控制器，这个更简单，其实只有行走和攻击两种状态，不过在游戏结束时，我们还是让它进入到静止状态的Idle。这里只是给出一个例子，不同的模型要匹配相应的模型动作，不然执行时模型会变成动画控制器的那个 (别问怎么知道的，问就是干过这种蠢事)。

![10](/img/2022/Homework7/10.png)

​	下图是**拾取的物体**的动画控制器，由于动作比较简单，也加入了眼睛的变化。没被找到时，就坐在原地哭唧唧，被找到后就高兴跳起来。

![11](/img/2022/Homework7/11.png)![12](/img/2022/Homework7/12.png)



到此，角色的预制件就做得差不多了。后面就是根据实际情况，还要去预先设计并记录一下巡逻兵属性脚本的数据值。



### 2.  场景制作

场景分两部分，摄像机Camera和地图Map。为了方便加载，这个地图是预先摆好并保存为预制件。

​	地图部分如下图，是Map空对象下放了子对象墙体地板等组成的。子对象部分有4类：Wall、InnerWall、Plane、Area，分别代表四面围墙、内部障碍墙、地板和各巡逻区域。Wall和InnerWall都是普通的Cube对象，Plane就是Plane对象，Area则是空对象挂上一个Box Collider和一个区域检测的脚本。位置摆放及数值等都是本人自己设计的，没什么好讲的。~~(这里有扇墙是假的)~~

![13](/img/2022/Homework7/13.png)

​	然后，我们将第一步做的预制件先放在想要放的位置，记录位置数据等。因为要求用工厂模式生成巡逻兵，拾取的物体也顺便通过该模式生成了。

​	摄像机是使用Main Camera，为了可以通过鼠标控制视角，并跟随玩家，挂上一个Camera Flow脚本。确定好Player的初始位置，就可以确定好摄像机的初始位置了。

到此，预制部分就全部做完了，可以开始写代码了。



### 3.  代码解析

#### 代码框架图

(本人还是不太习惯用UML图，思维导图既能帮助我整理结构，又能标记完成情况等，比较方便。)

![Patrol](/img/2022/Homework7/Patrol.png)



#### Models部分

**Camera Flow**

摄像机跟随脚本，网络上挺多这样的模板的，这里也是随便参考了一个。因为视角只希望在水平方向移动，不希望上下或者前后移动，这里的RotateAround就只是绕着跟随的目标的Y轴旋转。

```c#
public class CameraFlow : MonoBehaviour
{
    public GameObject target;

    Vector3 offset;

    void Start()
    {
        offset = this.transform.position - target.transform.position;
    }

    // Update is called once per frame
    void Update()
    {
        this.transform.position = target.transform.position + offset;
        Rotate();
        Scale();
    }
    //缩放
    private void Scale()
    {
        float dis = offset.magnitude;
        dis += Input.GetAxis("Mouse ScrollWheel") * 5;
        if (dis < 3 || dis > 20)
        {
            return;
        }
        offset = offset.normalized * dis;
    }
    //左右移动
    private void Rotate()
    {
        if (Input.GetMouseButton(1))
        {
            Vector3 pos = this.transform.position;
            this.transform.RotateAround(target.transform.position, Vector3.up, Input.GetAxis("Mouse X") * 10);
            //  更新相对差值
            offset = this.transform.position - target.transform.position;
        }
    }
}
```



**Enemy Data**

巡逻兵属性。每个数据的含义如注释所写。在工厂模式生成的时候，初始化数值。

```c#
public class EnemyData : MonoBehaviour
{
    public int AreaID;                      //  Enemy巡逻区域序号
    public bool isFollow = false;           // 是否跟随玩家
    public int CurID = -1;                  //  当前玩家所在区域序号
    public GameObject player;               //  玩家游戏对象
    public int kind;                        //  巡逻类型 3/4/5边
    public Vector3 startPos;                //  Enemy初始位置   
    public Vector3 lu;                      //  Enemy巡逻区域左上角坐标
    public Vector3 rd;                      //  Enemy巡逻区域右下角坐标
}
```



**Patrol Detection**

巡逻检测，玩家进入范围就追捕，走出范围就停止追捕。

```c#
public class PatrolDetection : MonoBehaviour
{
    void OnTriggerEnter(Collider collider)
    {
        EnemyData parent = this.gameObject.transform.parent.GetComponent<EnemyData>();
    	//玩家进入Enemy追捕范围，开始追捕
        if (collider.gameObject.tag == "Player")
        {
            //启动追捕模式
            parent.isFollow = true;
            //将追捕对象设置为玩家
            parent.player = collider.gameObject;
        }
    }
    void OnTriggerExit(Collider collider)
    {
        EnemyData parent = this.gameObject.transform.parent.GetComponent<EnemyData>();
        //玩家跑出Enemy追捕范围/玩家跑出Enemy管控范围，结束追捕
        if (collider.gameObject.tag == "Player" || parent.AreaID != parent.CurID)
        {
            //关闭追捕模式
            parent.isFollow = false;
            //将追捕对象设置为空
            parent.player = null;
        }
    }
}
```



**Other Detection** 

```c#
// 检测玩家与巡逻兵碰撞
public class PlayerDetection : MonoBehaviour
{
    void OnCollisionEnter(Collision other)
    {
        //当玩家与巡逻兵相撞
        if (other.gameObject.tag == "Player")
        {
            //玩家死亡
            other.gameObject.GetComponent<Animator>().SetBool("live",false);
            //Enemy发动攻击
            this.GetComponent<Animator>().SetTrigger("attack_tri");
            //游戏结束
            Singleton<GameEventManager>.Instance.playerGameOver();
        }
    }
}

// 检测被拾取的物体(Baby)是否被碰撞(拾取)
public class BabyDetection : MonoBehaviour
{
    void OnTriggerEnter(Collider collider)
    {
        if (collider.gameObject.tag == "Player" && this.gameObject.activeSelf)
        {
            this.gameObject.GetComponent<Animator>().SetBool("isFind",true);
            this.gameObject.GetComponent<BoxCollider>().enabled = false;
            Singleton<GameEventManager>.Instance.reduceBabyNum();
        }
    }
}

// 区域标志、检测玩家进入哪个区域
public class AreaDetection : MonoBehaviour
{
    public int AreaID = 0;
    FirstSceneController sceneController;

    void Start()
    {
        sceneController = Director.getInstance().currentSceneController as FirstSceneController;
    }

    void OnTriggerEnter(Collider collider){
        if(collider.gameObject.tag == "Player"){
            sceneController.CurID = AreaID;
        }
    }
}
```



#### Actions部分

这里只介绍巡逻动作的脚本。

**Enemy Walk Action**

​	通过在矩形画凸多边形，在多边形上任意取点。多边形取点逻辑如下图所示。橙色边为给定的巡逻大范围。**三角形**则在紫色、绿色及黄色三条线段依次任取点；**四边形**则在紫色、绿色、黄色、蓝色四条线段上依次任取点；**五边形**则在紫色、绿色、右侧粉色、粉色定点、上方粉色，四条线段加一个定点依次取点。忽略边界的小概率实践，形成的轨迹就是指定的凸多边形。

![14](/img/2022/Homework7/14.png)

​	也许会留意到轨迹周围有一段留白，那是为了避免巡逻兵在指定轨迹上行走，碰上障碍物原地不动的情况设置的。

```c#
public class EnemyWalkAction : SSAction
{
    private int kind = 4;                           //  多边形边数
    // 运动范围为(areaDown,areaUp),(areaLeft,areaRight)
    private float areaLeft = 0;
    private float areaUp = 0;
    private float areaRight = 0;
    private float areaDown = 0;
    private float moveSpeed = 1.8f;                 //  移动速度
    private bool isReach = true;                    //  是否到达目的地
    private EnemyData enemyData;                    //  Enemy数据
    private List<Vector3> path = new List<Vector3>();   //存储路径点
    private int curTar = 0;     //  当前目标地索引

    private EnemyWalkAction() { }
    public static EnemyWalkAction GetSSAction(int k, Vector3 start, Vector3 lu, Vector3 rd)
    {
        EnemyWalkAction action = CreateInstance<EnemyWalkAction>();
        action.kind = k;
        action.areaLeft = lu.x;
        action.areaRight = rd.x;
        action.areaUp = lu.z;
        action.areaDown = rd.z;
        action.initPath();
        
        return action;
    }
    Vector3 getPoint(float left, float right, float down, float up){
        Vector3 res= new Vector3(0,0,0);
        if(left==right){    //竖线
            res.x = left;
            res.z = Random.Range(down,up); 
        }
        else if(down==up){
            res.x = Random.Range(left,right);
            res.z = down;
        }
        else{
            res.x = Random.Range(left,right);
            res.z = Random.Range(down,up);
        }
        return res;
    }
    void initPath()
    {
        float midx = (areaLeft+areaRight)/2;
        float midz = (areaUp+areaDown)/2;
        path.Add(getPoint(areaLeft+2f,areaLeft+2f,areaDown+2f,areaUp-2f));
        path.Add(getPoint(areaLeft+2f,areaRight-2f,areaDown+2f,areaDown+2f));
        // 三角形
        if(kind==3){
            path.Add(getPoint(areaRight-2f,areaRight-2f,midz,areaUp-2f));
        }
        // 四边形
        else if(kind==4){
            path.Add(getPoint(areaRight-2f,areaRight-2f,areaDown+2f,areaUp-2f));
            path.Add(getPoint(areaLeft+2f,areaRight-2f,areaUp-2f,areaUp-2f));
        }
        // 五边形
        else if(kind==5){
            float quax = (midx+areaRight)/2;
            float quaz = (midz+areaUp)/2;
            path.Add(getPoint(areaRight-2f,areaRight-2f,areaDown+2f,midz));
            path.Add(new Vector3(quax,0,quaz));
            path.Add(getPoint(areaLeft+2f,midx,areaUp-2f,areaUp-2f));
        }
    }

    void goPatrol()
    {
        if(isReach){
            curTar ++;
            curTar %= kind;
            isReach = false;
        }
        this.transform.LookAt(path[curTar]);
        // 只要很接近地点就相当于到了
        float distance = Vector3.Distance(transform.position, path[curTar]);
        if (distance > 0.9)
        {
            transform.position = Vector3.MoveTowards(this.transform.position, path[curTar], moveSpeed * Time.deltaTime);
        }
        else{
            isReach = true;
        }
    }
    

    public override void Update()
    {
        // 巡逻移动
        goPatrol();
        // 如果巡逻兵需要跟随玩家并且玩家就在巡逻兵所在的区域，巡逻动作停止
        if (enemyData.isFollow && enemyData.CurID == enemyData.AreaID)
        {
            this.destroy = true;
            this.callback.SSActionEvent(this, 0, this.gameObject);
        }
    }
    public override void Start()
    {
        this.gameObject.GetComponent<Animator>().SetBool("isWalk", true);
        enemyData = this.gameObject.GetComponent<EnemyData>();
    }
}

```



#### Controllers部分

**First Scene Controller**

简单讲一下场景控制器。实现了消息订阅，实现了用户动作接口和场景动作接口。其中，有一个需要注意的点是 Restart 使用了`SceneManager.LoadScene();`，可以加载指定场景，比较方便。

```c#
public class FirstSceneController : MonoBehaviour, IUserAction, ISceneController
{
    public PropFactory factory;                              // Enemy和Baby工厂
    public ScoreController scoreController;                  // 记分员
    public EnemyActionManager manager;                       // 运动管理器
    public myUserGUI userGUI;                                // 用户界面
    public int CurID = -1;                                   // 当前玩家所于检测区域的序号
    public GameObject player;                                // 玩家
    public Camera cam;                                       // 主相机
    public float moveSpeed = 5;                              // 玩家移动速度
    public float rotateSpeed = 250f;                         // 玩家旋转速度
    private List<GameObject> enemies;                        // 场景中Enemy列表
    private List<GameObject> babies;                         // 场景Baby列表
    private bool isGameOver = false;                         // 游戏是否结束

    void Update()
    {
        for (int i = 0; i < enemies.Count; i++)
        {
            enemies[i].gameObject.GetComponent<EnemyData>().CurID = CurID;
        }
        // Baby收集完毕
        if(scoreController.getBabyNum() == 0)
        {
            GameOver();
        }
    }
    void Start()
    {
        Director director = Director.getInstance();
        director.currentSceneController = this;
        gameObject.AddComponent<PropFactory>();
        factory = Singleton<PropFactory>.Instance;
        manager = gameObject.AddComponent<EnemyActionManager>() as EnemyActionManager;
        scoreController = gameObject.AddComponent<ScoreController>() as ScoreController;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;
        LoadResource();
        cam.GetComponent<CameraFlow>().target = player;
        
    }

    public void LoadResource()
    {
        Instantiate(Resources.Load<GameObject>("Prefabs/Map"));
        player = Instantiate(Resources.Load("Prefabs/Player"), new Vector3(0, 0, 0), Quaternion.identity) as GameObject;
        babies = factory.getBabies();
        enemies = factory.getEnemies();

        // 所有巡逻兵移动
        for (int i = 0; i < enemies.Count; i++)
        {
            manager.Walk(enemies[i]);
        }
    }


    // 玩家移动
    public void movePlayer(float tranX, float tranZ, bool isShift)
    {
        if(!isGameOver)
        {
            if (tranX != 0 || tranZ != 0)
            {
                player.GetComponent<Animator>().SetBool("isWalk", true);
                // 如果shift加速
                if (isShift){
                    player.GetComponent<Animator>().SetBool("isRun", true);
                    moveSpeed = 10;
                }
                else{
                    player.GetComponent<Animator>().SetBool("isRun", false);
                    moveSpeed = 5;
                }
            }
            else
            {
                player.GetComponent<Animator>().SetBool("isWalk", false);
                return;
            }
            // 移动和旋转
            player.transform.Translate(0, 0, tranZ * moveSpeed * Time.deltaTime);
            player.transform.Rotate(0, tranX * rotateSpeed * Time.deltaTime, 0);

            // 防止碰撞带来的移动
            if (player.transform.localEulerAngles.x != 0 || player.transform.localEulerAngles.z != 0)
            {
                player.transform.localEulerAngles = new Vector3(0, player.transform.localEulerAngles.y, 0);
            }
            if (player.transform.position.y != 0)
            {
                player.transform.position = new Vector3(player.transform.position.x, 0, player.transform.position.z);
            }     
        }
    }

    public int getScore()
    {
        return scoreController.getScore();
    }

    public int getBabyNum()
    {
        return scoreController.getBabyNum();
    }
    public bool getGameOver()
    {
        return isGameOver;
    }
    public void Restart()
    {
        SceneManager.LoadScene("Scenes/startScene");
    }

    void OnEnable()
    {
        GameEventManager.scoreChange += addScore;
        GameEventManager.gameOverChange += GameOver;
        GameEventManager.babyChange += reduceBabyNum;
    }
    void OnDisable()
    {
        GameEventManager.scoreChange -= addScore;
        GameEventManager.gameOverChange -= GameOver;
        GameEventManager.babyChange -= reduceBabyNum;
    }

    void reduceBabyNum()
    {
        scoreController.reduceBaby();
    }
    void addScore()
    {
        scoreController.addScore();
    }
    void GameOver()
    {
        isGameOver = true;
        factory.stopEnemies();
        manager.DestroyAllAction();
    }
}
```





#### Others部分

**Game Event Manager**

订阅/发布模式（又叫观察者模式，事件-代理机制 ， 事件的代理模型）。

```c#
public class GameEventManager : MonoBehaviour
{
    //  分数变化
    public delegate void ScoreEvent();
    public static event ScoreEvent scoreChange;
    //  游戏结束
    public delegate void GameOverEvent();
    public static event GameOverEvent gameOverChange;
    //  Baby数量
    public delegate void BabyEvent();
    public static event BabyEvent babyChange;

    //  分数变化
    public void playerEscape()
    {
        if (scoreChange != null)
        {
            scoreChange();
        }
    }
    //  游戏结束
    public void playerGameOver()
    {
        if (gameOverChange != null)
        {
            gameOverChange();
        }
    }
    //  Baby数量
    public void reduceBabyNum()
    {
        if (babyChange != null)
        {
            babyChange();
        }
    }
}
```

`delegate`关键字定义了函数类型`ScoreEvent`、`GameOverEvent`、`BabyEvent`等的代理类型。静态变量scoreChange、gameOverChange、babyChange就是相应的“被订阅的主题”。

如下图 FirstSceneController 里的调用，+= 部分表示左边的函数一被调用，就会通知**所有**带有右边函数的对象要进行调用右边的函数，相当于右边订阅了左边。而 -= 就代表取消订阅了。

这里的`playerEscape()`等函数是一个接口，当调用时，就在告诉记分员要计分`addScore()`了。

![15](/img/2022/Homework7/15.png)



#### Views部分

**myUserGUI**

用户界面，也是大同小异。

这里主要是为了提到一个悬浮提示的小制作。格式如下，其中`tipStyle`为可选

```c#
GUI.Button(new Rect(0,0,0,0), new GUIContent("提示", "提示内容"));
GUI.Label(new Rect(1,1,1,1), GUI.tooltip[, tipStyle]);
```

第一次知道，IMGUI里的内容可以使用 `\n` 来换行。

```c#
public class myUserGUI : MonoBehaviour
{
    private IUserAction action;
    private GUIStyle scoreNumStyle = new GUIStyle();
    private GUIStyle scoreTextStyle = new GUIStyle();
    private GUIStyle scoreShadowStyle = new GUIStyle();
    private GUIStyle titleStyle = new GUIStyle();
    private GUIStyle shadowStyle = new GUIStyle();
    private GUIStyle tipStyle = new GUIStyle();

    void Start ()
    {
        action = Director.getInstance().currentSceneController as IUserAction;
        scoreNumStyle.normal.textColor = new Color(1,0.92f,0.016f,1);
        scoreNumStyle.fontSize = 30;
        scoreTextStyle.normal.textColor = new Color(0, 0, 0, 1);
        scoreTextStyle.fontSize = 30;
        scoreShadowStyle.normal.textColor = new Color(1,1,1,0.4f);
        scoreShadowStyle.fontSize = 30;
        titleStyle.normal.textColor = new Color(0.47F,0.4F,0.93F,1);
        titleStyle.fontSize = 40;
        shadowStyle.normal.textColor = new Color(1,1,1,0.5f);
        shadowStyle.fontSize = 40;
        tipStyle.normal.textColor = new Color(0.54f,0.27f,0.04f,1);
        tipStyle.fontSize = 18;
        
    }

    void Update()
    {
        //获取方向键的偏移量
        float tranX = Input.GetAxis("Horizontal");
        float tranZ = Input.GetAxis("Vertical");
        bool isShift = Input.GetKey(KeyCode.LeftShift);
        //移动玩家
        action.movePlayer(tranX, tranZ, isShift);
    }
    private void OnGUI()
    {
        GUI.skin.button.fontSize = 20;
        GUI.Label(new Rect(10, 5, 200, 50), "分数:", scoreTextStyle);
        GUI.Label(new Rect(9, 4, 200, 50), "分数:", scoreShadowStyle);
        GUI.Label(new Rect(90, 5, 200, 50), action.getScore().ToString(), scoreNumStyle);
        GUI.Label(new Rect(Screen.width - 245, 5, 200, 50), "剩余小狐狸数:", scoreTextStyle);
        GUI.Label(new Rect(Screen.width - 246, 4, 200, 50), "剩余小狐狸数:", scoreShadowStyle);
        GUI.Label(new Rect(Screen.width - 50, 5, 50, 50), action.getBabyNum().ToString(), scoreNumStyle);
        if(action.getGameOver() && action.getBabyNum() != 0)
        {
            GUI.Label(new Rect(Screen.width / 2 - 80, Screen.height / 2 - 100, 100, 100), "游戏结束", titleStyle);
            GUI.Label(new Rect(Screen.width / 2 - 78, Screen.height / 2 - 98, 100, 100), "游戏结束", shadowStyle);
            if (GUI.Button(new Rect(Screen.width / 2 - 50, Screen.height / 2 , 100, 50), "重新开始"))
            {
                action.Restart();
                return;
            }
        }
        else if(action.getBabyNum() <= 0)
        {
            GUI.Label(new Rect(Screen.width / 2 - 80, Screen.height / 2 - 100, 100, 100), "恭喜胜利", titleStyle);
            GUI.Label(new Rect(Screen.width / 2 - 78, Screen.height / 2 - 98, 100, 100), "恭喜胜利", shadowStyle);
            if (GUI.Button(new Rect(Screen.width / 2 - 50, Screen.height / 2 , 100, 50), "重新开始"))
            {
                action.Restart();
                return;
            }
        }

        GUI.Button(new Rect(Screen.width / 2 - 50 ,10, 100, 50), new GUIContent("提示规则", "按WSAD或方向键移动\n按左Shift键进行加速\n成功躲避猛兽追捕加1分\n找到所有小狐狸即可获胜\n鼠标右键实现视角转动"));
        GUI.Label(new Rect(Screen.width / 2 - 80 ,80, 150, 120), GUI.tooltip, tipStyle);
    }

}
```



### 小结

* 学会了动画控制器的使用；
* 理解了订阅/发布模式；
* 了解到了碰撞抖动、IMGUI的悬浮提示做法等。

* Player与一个被拾取物体的碰撞按道理只会触发一次。碰撞很偶尔会出现两次的情况，没有解决这个bug。
* 巡逻兵没有加变速功能，且探测范围设置较小，游戏难度比较低。



> 2022.12.19			Cauchy.