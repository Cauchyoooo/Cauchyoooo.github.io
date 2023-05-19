---
layout: post
title:  "HW2: 离散仿真引擎基础"
date:   2022-10-04 14:00:00 +0800
tags: 
    - unity
    - IMGUI
categories: Game
subtitle: '离散仿真引擎基础'
---

> 作业简介：
> 1.简答题（涉及GameObject, Transform, Assets, Prefabs, Component, MonoBehaviour等）
> 2.编程实践（仅允许使用IMGUI构建UI，训练数据-控制分离的编程思维）
> 3.思考题（涉及游戏设计模式）

<!--more-->

:rainbow:

### 一、简答题

1. 解释游戏对象(**GameObjects**)和资源(**Assets**)的区别与联系

    **GameObjects**：是 Unity 中的基础对象，表示角色、道具和景物。它们本身并没有取得多大作为，但它们充当组件(Component)的容器，而组件可实现功能。

    ![](/img/2022/Homework2/02.jpg)

    我们可以看到GameObject列表下有各种属性的对象，包括空属性对象、3D对象、效果、灯光等

    

    **Assets**：表示 Unity 项目中用来创建游戏或应用的任何项；也可以代表项目中的视觉或音频元素，例如 3D 模型、纹理、精灵、音效或音乐；还可以表示更抽象的项目，例如任何用途的颜色渐变、动画遮罩或任意文本或数字数据。

    ![](/img/2022/Homework2/03.jpg)

    我们可以看到Assets创建下有很多类型的资源，如C#脚本，着色器，预制件等。

    

    简单地理解，游戏对象是真正加入到游戏场景里的实体，类似一个空盒子，需要向里面添加各种组件来实功能。资源是创建或外导入的各种数据，可以应用到不同游戏对象身上，可以只是存储在项目里，不一定会使用到当前的游戏场景中。

    ![](/img/2022/Homework2/01.jpg)

    

2. 下载几个游戏案列，分别总结资源、对象组织和结构（指资源的目录组织结构与游戏对象树的层次结构）

     这里用作展示的是官方的游戏教程里的资源与对象的组织和结构。

     ![](/img/2022/Homework2/04.jpg)

     我们可以看到**资源**一般是按**用途**来分的，不同的文件夹存放不同类别的资源，包括音频、角色、环境、脚本、预制件、场景等，这里还可以看到模型资源里的环境精灵是按颜色来分类的，脚本里面按使用场景分类。

     

     ![](/img/2022/Homework2/05.jpg)

     ![](/img/2022/Homework2/06.jpg)

     **游戏对象**主要是根据**功能**不同分类的，可以看到第一个游戏对象树有UI画布、摄像机、角色、格子、敌人等分支，第二个游戏对象树则是利用空对象来写分割线区分结构。

     养成合理分类资源与游戏对象的好习惯，能让我们更高效地制作游戏。

     

3. 编写一个代码，使用 debug 语句来验证 `MonoBehaviour` 基本行为或事件触发的条件

    * 基本行为包括 `Awake()` `Start()` `Update()` `FixedUpdate()` `LateUpdate()`
    * 常用事件包括 `OnGUI()` `OnDisable()` `OnEnable()`

    *"MonoBehaviour 类是一个基类，所有 Unity 脚本都默认派生自该类。MonoBehaviour 类允许您启动、停止和管理协程。MonoBehaviour 类提供对大量事件消息的访问，允许您根据项目中当前发生的情况执行代码。"*

    **MonoBehaviour 方法简介**

    * `Awake`：在加载脚本实例时调用，无论该脚本是否启用，初始化脚本时都会调用。其在 Start 前调用
    * `Start`：在首次调用任何 Update 方法之前启用脚本时，在帧上调用
    * `Update`：如果启用了 MonoBehaviour，则每帧调用 Update
    * `FixedUpdate`：具有物理系统的频率；每个固定帧率帧调用该函数；在 FixedUpdate之后，进行Physics系统计算。帧率可以通过 Time.fixedDeltaTime 来访问。与Update相互独立。
    * `LateUpdate`：如果启用了 Behaviour（指可启用或禁用的组件），则每帧在Update调用后调用 LateUpdate，对于安排脚本的执行顺序很有用。
    * `OnGUI`：系统调用 OnGUI 来渲染和处理 GUI 事件，是唯一可以实现**“即时模式”GUI (IMGUI)**系统来渲染和处理 GUI 事件的函数。OnGUI 实现可以每帧调用多次（每个事件调用一次），若MonoBehaviour 的 enabled 属性设置为 false，则不会调用 OnGUI()。
    * `OnDisable`：该函数在行为被禁用时调用。当对象销毁时也会调用该函数，它可用于任何清理代码。 当编译完成后重新加载脚本时，将调用 OnDisable，并在加载脚本后调用 OnEnable。      
    * `OnEnable`：该函数在对象变为启用和激活状态时调用。

    代码验证：

    ```c#
    public class Hello : MonoBehaviour
    {
        void Awake() {Debug.Log("Awake");}
        
        void Start() {Debug.Log("Start");}
    
        void Update() {Debug.Log("Update");}
    
        void FixedUpdate() {Debug.Log("Fixed");}
    
        void OnGUI() {Debug.Log("OnGUI");}
    
        void OnEnable() {Debug.Log("Enabled");}
    
        void OnDisable() {Debug.Log("Disabled");}
    }
    ```

    ![](/img/2022/Homework2/07.jpg)

    

    

4. 查找脚本手册，了解 GameObjects, Transform, Component 对象

    * 分别翻译官方对三个对象的描述(Description)
    * 描述下图中 table 对象(实体)的属性、table 的 Transform 的属性、table 的部件
    * 用UML图描述三者的关系

    **官方描述**

    * **GameObject** 是 Unity 中的基础对象，表示角色、道具和景物，可以被用来表示所有可以存在于场景中的事物。它是Unity中场景的建筑块，可作为决定GameObject外观功能的功能组件的容器。在脚本中，GameObject类提供了一个可以在代码中使用的方法集合，包括查找、建立连接和在它们 之间发送消息，以及添加或移除附加到 GameObject 的组件和设置它们在场景中与状态有关的值。  

    * **Transform** 用于存储游戏对象的位置、旋转、缩放和父子化状态。每个游戏对象始终附加一个变换组件，无法删除变换组件或创建没有变换组件的游戏对象。 

    * **Component** 是每个GameObject的功能部分，它包含一些可编辑的属性，可以通过编辑这些属性来定义GameObject的行为。

    **图**

    ![](/img/2022/Homework2/08.jpg)

    Table的GameObject属性包含Tag(标签)、Layer(层)、Static(是否静态)、勾选框(是否活动)、属性名；
    Table的Transform属性包含Position(坐标)、Rotation(旋转角)、Scale(大小)；
    Table的Component属性包括Cube(Mesh Filter)、Mesh Renderer、Box Collider、RIgidbody、Hello(Script)、Red(Material)。

    **UML图**

    ![](/img/2022/Homework2/09.jpg)

     

5. 资源预设(**Prefabs**)与对象克隆(**clone**)

   * 预设(Prefabs)有什么好处?
   
       Unity 的**Prenfabs**系统允许创建、配置和存储游戏对象及其所有组件、属性值和子游戏对象作为可重用资源。预制件资源充当模板，在此模板的基础之上可以在场景中创建新的预制件实例。这可以避免重复制作的无用功，提高资源复用率，节省资源空间。
   
   * 预设与对象克隆(clone or copy or Instantiate of Unity Object)关系?
   
       预设本身不需要有实例化的游戏对象，而克隆需要复制实例化的游戏对象。预设也更方便进行批量修改。
   
   * 制作table预制，写一段代码将table预制资源实例化成游戏对象
   
       ```c#
       public class hello:MonoBehaviour
       {
       	void Start()
       	{
       		GameObject table = (GameObject)Resources.Load("table");
       		table = Instantiate(table);
       	
       		table.transform.parent = this.transform;
       		table.transform.position = new Vector3(0,0,0);
       	}
       }
       ```
   

:cake:

### 二、编程实践

源码地址：[https://github.com/Cauchyoooo/3DGameDesign/blob/main/hw2/MineGame.cs][ydm]

[ydm]:https://github.com/Cauchyoooo/3DGameDesign/blob/main/hw2/MineGame.cs

这里是利用IMGUI做了一个扫雷小游戏。运行窗口大小为Full HD(1920x1080)

实现的效果如下图

![](/img/2022/Homework2/win.gif)

**数据定义部分代码：**

```c#
 // Data
    private int[,] control_arr = new int[16,20]; //用于记录雷和数字 -1是雷 0是空 其他是周围的雷数
    private int[,] show_arr = new int[16,20]; //用于记录格子可见性 0是可见 1是不可见
    private int[,] mark_arr = new int[16,20]; //用于玩家标记雷 标记雷为1 此时按钮不可点击
    
    private int mine_num = 60; //用于记录剩余雷数
    private int wrong = 0; //用于记录标错的雷数
    private int time = 0; //用于记录用时
    private float tmptime = 0; //用于记录上一帧时间(不会重复初始化)
    private int state = 0; //0为挖矿模式，1为标记模式 输了为-1，赢了为-2

    // Controls Style
    GUIStyle smileStyle = new GUIStyle();
    GUIStyle mineStyle = new GUIStyle();
    GUIStyle[] numStyle = new GUIStyle[8]; //记录数字1-8的格式
    GUIStyle state0 = new GUIStyle();
    GUIStyle state1 = new GUIStyle();
    GUIStyle worl = new GUIStyle();
    GUIStyle txt = new GUIStyle();
```

由于不是很想利用Texture2D导入图片素材，这里用的是IMGUI里简陋的`GUIStyle()`，配合可显示的Unicode符号食用。



**数据初始启动部分代码：**

```c#
void Start () {
        // 对图标格式的初始化
        smileStyle.fontSize=50;
        smileStyle.normal.textColor=Color.yellow;
        smileStyle.alignment=TextAnchor.MiddleCenter;

        mineStyle.fontSize=20;
        mineStyle.normal.textColor=Color.red;
        mineStyle.alignment=TextAnchor.MiddleCenter;

        state0.fontSize=20;
        state0.normal.textColor=Color.red;
        state0.alignment=TextAnchor.MiddleCenter;

        state1.fontSize=20;
        state1.normal.textColor=Color.black;
        state1.alignment=TextAnchor.MiddleCenter;

        worl.fontSize = 50;
        worl.normal.textColor = Color.red; //win=red / lose=blue
        worl.alignment=TextAnchor.MiddleCenter;

        txt.fontSize = 30;
        txt.normal.textColor=Color.white;
        txt.alignment=TextAnchor.MiddleCenter;
         
        for(int i=0;i<8;i++){
            numStyle[i] = new GUIStyle();
            numStyle[i].fontSize = 20;
            numStyle[i].alignment = TextAnchor.MiddleCenter;
        }
        numStyle[0].normal.textColor=Color.blue; //数字1红色
        numStyle[1].normal.textColor=Color.green; //数字2蓝色
        numStyle[2].normal.textColor=Color.red; //数字3蓝色
        numStyle[3].normal.textColor=new Color(1.00f,0.84f,0.00f,1.00f); //数字4蓝色
        numStyle[4].normal.textColor=new Color(0.63f,0.13f,0.94f,1.00f); //数字5紫色
        numStyle[5].normal.textColor=new Color(1.00f,0.38f,0.00f,1.00f); //数字6橙色
        numStyle[6].normal.textColor=new Color(1.00f,0.75f,0.80f,1.00f); //数字7粉色
        numStyle[7].normal.textColor=Color.black; //数字8黑色

        Init(); //游戏参数初始化
    }
```

由于GUIStyle在游戏过程中，基本不会有何变化，就放在Start()函数调用初始化。



**游戏参数初始化代码：**

```c#
void Init() {
        // 时间，雷数等参数初始化
        time = 0;
        mine_num = 60;
        wrong = 0;
        state = 0;
        
        for(int i=0;i<16;i++){
            for(int j=0;j<20;j++){
                // 格子可见性初始化
                show_arr[i,j] = 0;
            }
        }

        // 雷区初始化
        clearMine();
        InitMine();
    }
```

每局新游戏开始前的初始化函数，要把各种参数归零，并重新随机生成雷区。



**雷区初始化代码：**

```c#
void InitMine(){
        //初始化数字和雷区
        int num=0;
        while (num<60)
        {
            int x=Random.Range(0,16);
            int y=Random.Range(0,20);
            if(control_arr[x,y]==0){
                control_arr[x,y] = -1;
                num++;
            }
        }

        for(int i=0;i<16;i++){
            for(int j=0;j<20;j++){
                if(control_arr[i,j]>-1){
                    //左边
                    if(i>0 && control_arr[i-1,j]==-1)
                        control_arr[i,j]++;
                    //右边
                    if(i<15 && control_arr[i+1,j]==-1)
                        control_arr[i,j]++;
                    //上方
                    if(j>0 && control_arr[i,j-1]==-1)
                        control_arr[i,j]++;
                    //下方
                    if(j<19 && control_arr[i,j+1]==-1)
                        control_arr[i,j]++;
                    //左上角
                    if(i>0 && j>0 && control_arr[i-1,j-1]==-1)
                        control_arr[i,j]++;
                    //右下角
                    if(i<15 && j<19 && control_arr[i+1,j+1]==-1)
                        control_arr[i,j]++;
                    //右上角
                    if(i<15 && j>0 && control_arr[i+1,j-1]==-1)
                        control_arr[i,j]++;
                    //左下角
                    if(i>0 && j<19 && control_arr[i-1,j+1]==-1)
                        control_arr[i,j]++;
                }
            }
        }
    }

    void clearMine(){
        for(int i=0;i<16;i++){
            for(int j=0;j<20;j++){
                control_arr[i,j]=0;
                mark_arr[i,j]=0;  
            }
        }
    }
```

`clearMine()`函数会把上一局的标记去除，雷全部清除，且格子值全部设为0，配合生成雷的函数`InitMine()`，`InitMine()`初始化雷的位置(值为-1)后，会通过循环得出每个格子的数字（周围一圈的雷数）。



**OnGUI()循环代码：**

```c#
void OnGUI() {
        GUI.Box(new Rect(720,180,480,720),"");
            // 生成smile按钮 for restart
            if(GUI.Button(new Rect(935,220,50,50), "☺",smileStyle)){
                Debug.Log("Push Smile");
                if(state>=0)
                    Init();             
            }
            // 生成挖雷按钮
            if(GUI.Button(new Rect(1000,200,50,50), "挖",state0)){
                state = 0;
                state0.normal.textColor=Color.red;
                state1.normal.textColor=Color.black;

            }

            // 生成标记按钮
            if(GUI.Button(new Rect(1000,240,50,50), "标",state1)){
                state = 1;
                state0.normal.textColor=Color.black;
                state1.normal.textColor=Color.red;

            }
            //显示剩余雷数
            GUI.Button(new Rect(736,220,160,60), "剩余雷数:"+mine_num.ToString());

            //显示时间
            GUI.Button(new Rect(1050,220,130,60), "用时(s):"+time.ToString());

            // 每个大小28*28
            // 生成可点击扫雷按钮
            for(int i=0;i<16;i++){
                for(int j=0;j<20;j++){
                    if(show_arr[i,j]==1)    continue;
                    // 标记的格子可取消标记
                    if(mark_arr[i,j]==1){
                        if(GUI.Button(new Rect(736+i*28,300+j*28,28,28),"✯")){
                            if(state == 1){
                                mark_arr[i,j] = 0;
                                mine_num++;
                                if (control_arr[i,j]<0)
                                    wrong--;
                            }
                        }
                        continue;
                    }

                    if(GUI.Button(new Rect(736+i*28,300+j*28,28,28),"")){
                        // 按下按钮的行为
                        if(state == 1){
                            mark_arr[i,j] = 1;
                            mine_num--;
                            if (control_arr[i,j]>-1)
                                wrong++;
                            if (mine_num==0)
                            {
                                if(wrong>0){
                                    showAllMine();
                                    state = -1; //lose
                                }
                                else{    
                                    state = -2; //win
                                }
                                
                            }
                        }
                        else{
                            if(mark_arr[i,j]==0){
                                show_arr[i,j]=1;
                                if(control_arr[i,j]==0)
                                    showEmpty(i,j);
                                if(control_arr[i,j]<0){
                                    showAllMine();
                                    state = -1; //lose
                                }
                            }
                        }
                    }
                }
            }
            // 显示数字和雷    
            for(int i=0;i<16;i++){
                for(int j=0;j<20;j++){
                    if(show_arr[i,j]==0)    continue; //
                    int ctlnum = control_arr[i,j];
                    if(ctlnum==0){
                        GUI.Label(new Rect(736+i*28,300+j*28,28,28)," ");
                    }
                    else if(ctlnum>0){
                        GUI.Label(new Rect(736+i*28,300+j*28,28,28),ctlnum.ToString(),numStyle[ctlnum-1]);
                    }
                    else{
                        GUI.Label(new Rect(736+i*28,300+j*28,28,28),"✵",mineStyle);
                    }
                }
            }

        if(state<0){
            GUI.Box(new Rect(810,420,300,240),"");
            if(GUI.Button(new Rect(910,630,100,20), "Restart"))
                Init();
            if(state == -1){
                worl.normal.textColor =  Color.blue;
                GUI.Label(new Rect(910,440,100,50), "LOSE", worl);
            }
            else{
                worl.normal.textColor =  Color.red;
                GUI.Label(new Rect(910,440,100,50), "WIN", worl);
            }  
            int endnum = 60 - mine_num - wrong;
            GUI.Label(new Rect(910,510,100,50), "扫雷数："+endnum.ToString(), txt);
            GUI.Label(new Rect(910,560,100,50), "总用时："+time.ToString(), txt);

            tmptime = Mathf.Floor(Time.fixedTime);
        }
        else{
            //计时
            if(Mathf.Floor(Time.fixedTime)-tmptime==1){
                tmptime = Mathf.Floor(Time.fixedTime);
                time++;
            }
        }

    }
```

由于IMGUI的控件部分只能在`OnGUI()`函数使用，因此这里会写的比较冗杂，嵌套也比较多。这里利用Time类来辅助我们计时。



**其他相关代码：**

```c#
void showAllMine(){
        for(int i=0;i<16;i++){
            for(int j=0;j<20;j++){
                if(control_arr[i,j]==-1){
                    show_arr[i,j]=1;
                }  
            }
        }
    }

    // 递归显示无雷区域
    void showEmpty(int i,int j){
        // 遇到被标记的非雷 直接翻开
        if(mark_arr[i,j]==1){
            mark_arr[i,j]=0;
            mine_num++;
        }            
        show_arr[i,j]=1;
        if(control_arr[i,j]>0)
            return;
   
        if(i>0 && show_arr[i-1,j]==0)
            showEmpty(i-1,j);
        if(i<15 && show_arr[i+1,j]==0)
            showEmpty(i+1,j);
        if(j>0 && show_arr[i,j-1]==0)
            showEmpty(i,j-1);
        if(j<19 && show_arr[i,j+1]==0)
            showEmpty(i,j+1);
        if(i>0 && j>0 && show_arr[i-1,j-1]==0)
            showEmpty(i-1,j-1);
        if(i<15 && j<19 && show_arr[i+1,j+1]==0)
            showEmpty(i+1,j+1);
        if(i<15 && j>0 && show_arr[i+1,j-1]==0)
            showEmpty(i+1,j-1);
        if(i>0 && j<19 && show_arr[i-1,j+1]==0)
            showEmpty(i-1,j+1);
        
    }
```

`showAllMine()`函数是使用在踩雷情况，把剩下的雷也显示出来；`showEmpty()`函数是在扫雷过程中，如果遇到一个连续空白无雷区，会把没有数字(周围一圈没有雷)的区域及围绕它们的数字显示出来。



**小结**

* 在写控件Style的时候，感觉这也不太好设置，那也不太好设置，默认的Style风格又不太适用，整体看起来勉强过得去，有的按钮周围没有边框(比如“标”和“挖”)，就是皮肤设置的问题，做不出想要的风格，多少有点痛苦。可能还是乖乖导入Texture2D会更美观一些，但也要耗费时间去找合适的素材。
* 制作计时器的时候，因为OnGUI()调用频率，以及Time可以获取从游戏启动的时间，就想到了这个先floor()，再比较有无变化的这个方法计时。其他的一些协程或是延时调用的方法看起来都比较复杂，不太好实现。
* 关于利用Button按钮控件的“标”和“挖”来实现标雷和挖格子。似乎是在IMGUI中没能找到控件比较广泛的按键功能，只能监听到按钮被点击，无法监听是被左键或是右键点击又或是按键按下或松开这种，因此实现起来有点怪怪的并且有些麻烦。
* 利用自定义状态值`state`来表示不同的游戏状态，能帮助更好地实现这个游戏功能。

:sailboat:

### 三、思考题

* 微软XNA引擎的Game对象屏蔽了游戏循环的细节，并使用一组虚方法让继承者完成它们，我们称这种设计为“模板方法模式”。

    * 为什么是“模板方法”模式而不是“策略模式”呢？

        **模板方法模式：**一个抽象类公开定义了执行它的方法的方式/模板。它的子类可以按需要重写方法实现，但调用将以抽象类中定义的方式进行。

        **策略模式：**是针对一组算法，将每一个算法封装到具有共同接口的独立的类中，从而使得它们可以相互替换。

        -- 微软XNA引擎的Game对象屏蔽了游戏循环的细节，用虚方法让继承者完成它们，更强调继承重写，明显更符合模板方法模式。

        

* 将优先对象组成树形结构，每个节点都是游戏对象（或数）。

    * 尝试解释组合模式(Composite Pattern /一种设计模式)。

        *将对象组合成树形结构以表示"部分-整体"的层次结构。组合模式使得用户对单个对象和组合对象的使用具有一致性。*

    * 使用 BroadcastMessage() 方法，向子对象发送消息。写出 BroadcastMessage() 的伪代码。

        ![](/img/2022/Homework2/10.jpg)
        ![](/img/2022/Homework2/11.jpg)
        ![](/img/2022/Homework2/12.jpg)

        ```c#
        public class BcM : MonoBehaviour
        {
          public GameObject pobject;
          void Update () {
        		pobject.BroadcastMessage("dbug","inputstr",SendMessageOptions.RequireReceiver);
        	}
        }
        
        public class c1 : MonoBehaviour
        {
            void dbug(){
                Debug.Log("c1");
            }
        }
        
        public class c2 : MonoBehaviour
        {
            void dbug(string str){
                Debug.Log("c2:"+str);
            }
        }
        ```

        ![](/img/2022/Homework2/13.jpg)

        

* 一个游戏对象用于许多部件描述不同方面的特征。我们设计坦克游戏对象不是继承于 GameObject 对象，而是 GameObject 添加一组行为部件(Component)。

    * 这是什么设计模式？

        装饰器模式?

    * 为什么不用继承设计特殊的游戏对象？

        由于继承为类引入静态特征，并且随着扩展功能的增多，子类会很膨胀。使用继承的话，扩展不够灵活。



参考资料：[策略模式][lin1]，[模板模式][lin2]，[组合模式][lin3]，[装饰器模式][lin4]，[桥接模式][lin5]，[u3d计时器][lin6]，[IMGUI][lin7]

[lin1]:https://www.runoob.com/design-pattern/strategy-pattern.html
[lin2]:https://www.runoob.com/design-pattern/template-pattern.html
[lin3]:https://juejin.cn/post/7031727773613817893
[lin4]:https://www.runoob.com/design-pattern/decorator-pattern.html
[lin5]:https://www.runoob.com/design-pattern/bridge-pattern.html
[lin6]:https://blog.csdn.net/xiumang/article/details/88750110
[lin7]:https://docs.unity.cn/cn/2021.3/Manual/gui-Basics.html



> Cauchy    2022.10.04