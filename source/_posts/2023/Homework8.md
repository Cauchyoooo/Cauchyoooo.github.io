---
layout: post
title:  "Final: 粒子系统与流动效果"
date:   2023-01-05 20:00:00 +0800
tags: 
- unity 
- particle
categories: Game
subtitle: '粒子系统与流动效果'
---

> 作业简介：
>
> 1. 粒子效果制作(Particle System)
>
>     ps: 多图警告！加载时间可能较长，有加速器会快一些，思维导图可新建页面打开图片看大图。

<!--more-->


## 粒子效果制作

### 一、设计要求

* 粒子效果制作，必须带一个控制组件，控制粒子呈现效果。





### 二、项目地址

[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw8/Assets][link]

[link]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw8/Assets





### 三、效果展示图

![show](/img/2023/Homework8/show.gif)





### 四、写在前面

​		Unity实现特效的方式多种多样，这里主要使用的是内置粒子系统(Particle System)。还有一种更高级的Visual Effect Graph(VFX Graph) 。课上听和做对粒子系统有初步的了解。课后又对每个模块仔细地再阅读，跟着一些视频实践了一番，增加了不少的理解。感觉还是有自己的理解后，才能更好地制作自己的五毛特效。特效这方面感觉和美术更相关，搭配好的素材能制作出更丰富的东西。

​		这个特效，暂且称之为“雨云弹”特效吧。制作的灵感来源于《Splatoon 3》的大招墨雨云，因为做得不咋像就不放图了。用的是默认素材，真的是有手就能做。代码部分参考了之前做的射箭部分，主要用于获取并抛掷球体。当球体与地面碰撞时，触发该特效并销毁球体，也算是有一个控制组件呈现粒子特效啦^-^。

​		那让我们开始吧。





### 五、粒子系统模块简介

:lollipop:

####  模块总结图

![ParticleSystem](/img/2023/Homework8/ParticleSystem.png)

* 打“√”的模块是初始粒子系统默认勾选的，也是基本必须模块；打<u>下划线</u>的模块是“雨云弹”所用到的。
* 这些模块都可以通过脚本 [`ParticleSystem.xx `][linkapi] 来访问使用。事实上，这里没有用脚本访问使用粒子系统，因为初始就直观地设定好了粒子效果，也无需在过程中修改它。

[linkapi]:https://docs.unity.cn/cn/2021.3/ScriptReference/ParticleSystem.html

:feet: 

#### 部分模块使用方法

如果能看懂英文的，可以通过鼠标在英文上悬停以了解功能介绍。这里只介绍部分常用的。

* 仿真执行控制窗口

    用于控制粒子系统在场景的播放演示，可以看到场景中的粒子属性如粒子数量、速度区间等。

    ![win](/img/2023/Homework8/win.png)

    * Play - 播放；Restart - 重置；Stop - 停止播放；Playback Speed - 播放速度；Playback Time - 已播放时间；

        Resimulate - 勾选后，粒子效果的更新会同步到仿真窗口；

    

* Main 模块

    ![main](/img/2023/Homework8/main.png)

    * 右边有三角形的都是下拉列表，可以更改选项或模式。右上角的"＋"号，可以选择显示所有模块或勾选的模块。

    * Duration - 粒子一次发射多久(若是循环模式，则为每轮发射时长)；Looping - 是否循环播放；

        Start Delay - 延迟多久发射；Start Lifetime - 粒子生命周期(存活多久)；Start Speed - 初始速度；

        Start Size - 初始大小；Start Rotation - 初始旋转角度；Start Color - 初始颜色；

        Stop Action - 当粒子效果结束时，可以选择使该对象自动销毁等

    

* Curve 面板

    当进行“大小数值”设置时，选择带有Curve的模式就会出现一条线，如果高亮该线就可以在Curve面板编辑它，不高亮时不代表没有应用，只是没有显示在面板里。

    ![curve](/img/2023/Homework8/curve.png)

    * 最下方是一些系统预设，可通过实践来理解变化趋势。
    * 面板左上角的数值是峰值。
    * 在线上右键可以Add Key(新建关键帧)，右键Key可以编辑它的比例（如峰值是10，Edit Key的Value为0.3，则数值大小为3）。

    

* Gradient Editor 线性编辑器

    当进行颜色设置，选择“Gradient”模式时，点击色条可打开编辑。

    ![gradient](/img/2023/Homework8/gradient.png)

    * Mode可以选择Blend或者Fixed，这个两端选择不同颜色，自己尝试一下就知道区别，一般使用Blend模式，过渡比较自然。

    * 在色条上方或下方左键即可创建一个帧(小箭头)，点击它可编辑颜色或透明度。

    * 色条上方的帧用于设置透明度，越黑表示越透明，Alpha为透明度数值(RGBA的A)，A越接近0越透明，Location表示在色条处于什么位置。

    * 色条下方的帧用于设置颜色，经典的颜色面板，一看就懂。

    * Presets 有个 New，可以把当前的set保存为预设，方便重复使用。

        

* Emission 模块

    粒子发射大致有3种方式，随时间发射、随距离变化发射、特定时间点发射，这三种模式可叠加使用。

    ![emission](/img/2023/Homework8/emission.png)

    * Rate over Time 为每秒发射的粒子数量。

    * Rate over Distance 为每发生单位距离变化发射的粒子数量。尾迹的制作很常用。

    * Burst模块可控制特定时间点(Time)发射的粒子数量(Count)，Cycles表示发射轮次，Interval表示轮次间隔时间，Probability表示发射的可能概率。

        

* Shape 模块

    Shape 用于描述发射器的形状，即粒子沿着什么样的形状发射出去的。不同的shape会有不同的属性设置，在Texture上方的那部分。这里给出一些自己的理解例子。

    ![shape](/img/2023/Homework8/shape.png)

    * 默认的Shape是Cone(圆锥)，将其Angle设为0就是圆柱，修改Thickness可以呈现环状。
    * Sphere是球状发射，Hemisphere是半球状发射，可用于一些需要中心向外发散的3d效果。
    * Box是盒装发射，也比较常用。修改Scale形成一定范围，粒子速度设为很小，在体积发射时，可以营造类似萤火虫等氛围感。
    * Circle圆、Edge边都是二维图形，也常用。圆可以作中心向外发散的2d效果，边可以作一些刀锋效果。

    

* Trails 模块

    如果会用GameObject的Trail，这个是相通的。可以用于制作拖尾效果。本人对这个也是初步了解状态，只会做很简陋的效果。

    ![trail](/img/2023/Homework8/trail.png)

    * Mode模式选择：Particles是对每个粒子单独使用；Ribbon是通过粒子间连接形成。
    * Paricles模式：Ratio表示粒子会应用Trail的百分比；Lifetime为Trail的生命周期；Die with Particles表示是否随粒子销毁而销毁。
    * Ribbon模式：Ribbon count表示连线的数量，注意这个数量不要超过粒子发射的数量。

其他模块就不做介绍了，大多数看手册都能理解的。





### 六、“雨云弹”制作

​		由于写详细教程会使篇幅太长，此处只放出相关参数图片。

​		个人通用的制作思路是：整体形状->发射的时间、数量及速度->主要效果->颜色调整。

##### “雨云弹”结构图

“雨云弹”分为四个部分：①上升雾，②云，③雨，④雨滴溅射。

![对象结构图](/img/2023/Homework8/对象结构图.png)

**注**：

* Transform 组件参数放进模块参数图里供作参考。
* 每个效果都不需要更改默认的Renderer渲染模块，勾上就行。

:foggy:

#### 1 上升雾

##### 设计要点

* 整体呈圆柱状上升喷射；
* 向上喷射速度快时间短，要有”嘭“的感觉；
* 有雾的绵密感。

##### 效果图

![up](/img/2023/Homework8/up.png)

##### 模块参数图

* Transform

    ![1transform](/img/2023/Homework8/1transform.png)

* Main

    ![1main](/img/2023/Homework8/1main.png)

* Emission

    ![1emission](/img/2023/Homework8/1emission.png)

* Shape

    ![1shape](/img/2023/Homework8/1shape.png)

* Color over Lifetime

    ![1color](/img/2023/Homework8/1color.png)



---

:cloud:

#### 2 云

##### 设计要点

* 整体呈中心水平向外扩散；
* 云的消散有渐隐效果；
* 云的运动有波动感。

##### 效果图

![cloud](/img/2023/Homework8/cloud.png)

##### 模块参数图

* Transform

    ![2transform](/img/2023/Homework8/2transform.png)

* Main

    ![2main](/img/2023/Homework8/2main.png)

* Emission

    ![2emission](/img/2023/Homework8/2emission.png)

* Shape

    ![2shape](/img/2023/Homework8/2shape.png)

* Velocity over Lifetime

    ![2velocity](/img/2023/Homework8/2velocity.png)

* Color over Lifetime

    ![2color](/img/2023/Homework8/2color.png)

* Size over Lifetime

    ![2size](/img/2023/Homework8/2size.png)



---

:cloud_with_rain:

#### 3 雨

##### 设计要点

* 整体呈圆柱形向下喷射；
* 雨的下落要迅速，呈线状；
* 雨碰撞地面触发雨滴溅射效果。

##### 效果图

![down](/img/2023/Homework8/down.png)

##### 模块参数图

* Transform

    ![3transform](/img/2023/Homework8/3transform.png)

* Main

    ![3main](/img/2023/Homework8/3main.png)

* Emission

    ![3emission](/img/2023/Homework8/3emission.png)

* Shape

    ![3shape](/img/2023/Homework8/3shape.png)

* Size over Lifetime

    ![3size](/img/2023/Homework8/3size.png)

* Collision

    ![3collision](/img/2023/Homework8/3collision.png)

* Sub Emitters

    需做好“**4 雨滴溅射**”部分再勾选修改该模块。

    ![3sub](/img/2023/Homework8/3sub.png)

* Trails

    ![3trail](/img/2023/Homework8/3trail.png)



---

:watermelon:

#### 4 雨滴溅射

##### 设计要点

* 整体呈中心斜向上向外溅射；
* 雨滴溅射碰撞地面有反弹效果，营造动感。

##### 效果图

![circle](/img/2023/Homework8/circle.png)



##### 模块参数图

* Transform

    ![4transform](/img/2023/Homework8/4transform.png)

* Main

    ![4main](/img/2023/Homework8/4main.png)

* Emission

    ![4emission](/img/2023/Homework8/4emission.png)

* Shape

    ![4shape](/img/2023/Homework8/4shape.png)

* Color over Lifetime

    ![4color](/img/2023/Homework8/4color.png)

* Size over Lifetime

    ![4size](/img/2023/Homework8/4size.png)

* Noise

    ![4noise](/img/2023/Homework8/4noise.png)

* Collision

    ![4collision](/img/2023/Homework8/4collision.png)



---

:star:

**注**：

还有一件事，因为我在Rain空对象挂了一个只用Main的ParticleSystem组件，修改了生命周期，并将Stop Action设置为Destroy，效果类似于这个粒子播放xx时长，结束了这个对象就会自动销毁。因为在粒子系统触发脚本(ParticleTrigger)中，当球体与地面碰撞，这个粒子系统会作为预制件实例化，每撞一次就会实例化一次，如果不及时销毁就会一直在那里，但其实它播放一次就不再用了。

当然，如果不带这个组件，处理方式也可以修改为，一开始就在场景初始化这个粒子系统，并设置不播放，每检测碰撞，就对这个空对象下挂载的三个粒子系统进行同时播放一次。我觉得比较麻烦，就采取了第一种方法，这在性能方面可能有所增加。

![5main](/img/2023/Homework8/5main.png)





### 七、其他部分制作

#### 1 背景

​		由5个带上黑色材质球的Plane简单拼凑组成，注意Plane的朝向并检查是否带有碰撞器。用于粒子系统碰撞及颜色衬托。

![bg](/img/2023/Homework8/bg.png)



#### 2 球体

* 一个带有Trail子对象的球体，组件勾上碰撞器，加入刚体和碰撞检测的脚本，设置如下图。

    ![ball](/img/2023/Homework8/ball.png)

* 球体的Trail拖尾效果做得比较简陋，设置如下图。

    ![btrail](/img/2023/Homework8/btrail.png)



#### 3 相机

​		新建Camera，通过`ctrl+shift+f`将当前场景的视角作为Camera的视角，这里添加了俯视DownCamera和仰视UpCamera的视角。通过脚本添加预制件及视角切换。





### 八、部分代码

代码部分参考了之前做的射箭部分，主要用于获取并抛掷球体，也不是主要部分。

设计模式采用课堂上的设计模式，参考的UML图如下。画的很好了，这里就不重新画了。

![design](/img/2023/Homework8/design.png)



#### 代码结构图

日常上代码结构图，dddd。

![Scripts](/img/2023/Homework8/Scripts.png)



#### ParticleTrigger

粒子系统触发脚本。在球体碰撞的位置实例化粒子系统预制件Rain，它会自动播放的。

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ParticleTrigger : MonoBehaviour
{
    void OnCollisionEnter(Collision other)
    {
        GameObject Rain = GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/Rain"));
        Rain.transform.position = new Vector3(this.transform.position.x,0,this.transform.position.z);
        this.gameObject.tag = "Finish";
    }
}

```



#### BallFlyAction

球体飞行运动。在初始给一个瞬间的力以添加初速度，然后给一个持续向下的力模拟重力。模拟一个斜向上抛体运动。

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BallFlyAction : SSAction
{
    private Vector3 force = new Vector3(0,80f,30f);
    private Vector3 gravity = new Vector3(0,-0.3f,0);
    // public float speed;
    public static BallFlyAction GetBallFlyAction(){
        BallFlyAction action = ScriptableObject.CreateInstance<BallFlyAction>();
        return action;
    }

    public override void Start(){
        
        gameObject.GetComponent<Rigidbody>().isKinematic = false;
        gameObject.GetComponent<Rigidbody>().velocity = Vector3.zero;
        gameObject.GetComponent<Rigidbody>().AddForce(force,ForceMode.Impulse);
    }

    public override void Update()
    {   
        if (this.gameObject.tag == "Finish"){
            this.destroy = true;
        }  
        gameObject.GetComponent<Rigidbody>().AddForce(gravity,ForceMode.Impulse);
    }

}
```



#### Interface

包括`IUserController`与`ISceneController`,分别对应用户操作接口与场景行为接口。

Init是获取球体，Shoot是发射球体，ChangeView用于切换视角，IsBallNull用于判断是否获取了球体；

LoadResource是实例化背景及相机。

```csharp
public interface IUserAction
{
    void Init();
    void Shoot();
    void ChangeView(char c);
    bool IsBallNull();
}

public interface ISceneController
{
    void LoadResource();
}
```



#### SceneController

场景控制器。用于控制整个场景，实现用户操作接口与场景行为接口。

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SceneController : MonoBehaviour, IUserAction, ISceneController
{
    BallFactory factory;
    public BallActionManager actionManager;
    public myUserGUI userGUI;
    public GameObject ball = null;
    public Camera mainCamera;
    public Camera upCamera;
    public Camera downCamera;

    void Start()
    {
        Director director = Director.getInstance();
        director.currentSceneController = this;
        gameObject.AddComponent<BallFactory>();
        factory = Singleton<BallFactory>.Instance;
        actionManager = gameObject.AddComponent<BallActionManager>() as BallActionManager;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;
        mainCamera = Camera.main;
        LoadResource();
    }

    public void LoadResource()
    {
        GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/Background"));
        upCamera = GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/UpCamera")).GetComponent<Camera>();
        downCamera = GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/DownCamera")).GetComponent<Camera>();
        ChangeView('z');
    }
    
    public void ChangeView(char c)
    {
        if(c == 'z'){
            mainCamera.enabled = true;
            upCamera.enabled = false;
            downCamera.enabled = false;
        }
        else if(c == 'x'){
            mainCamera.enabled = false;
            upCamera.enabled = true;
            downCamera.enabled = false;
        }
        else{
            mainCamera.enabled = false;
            upCamera.enabled = false;
            downCamera.enabled = true;
        }
    }

    public void Init()
    {
        if(ball == null){
            ball = factory.GetBall();
        }
    }

    public void Shoot()
    {
        actionManager.MoveBall(ball);
        ball = null;
    }

    public void Update()
    {
        factory.FreeBall();
    }

    public bool IsBallNull(){
        return (ball == null);
    }
}
```



#### myUserGUI

用户界面。用于监测按键及控制说明。按`z`,`x`,`c`可以切换视角，`space`可以获取球体，`j`可以发射球体。

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class myUserGUI : MonoBehaviour
{
    private IUserAction action;
    GUIStyle titleStyle = new GUIStyle();
    GUIStyle textStyle = new GUIStyle();
    void Start(){
        action = Director.getInstance().currentSceneController as IUserAction;

        titleStyle.normal.textColor = new Color(0.9f, 0.65f, 0.99f, 1);
        titleStyle.normal.background = null;
        titleStyle.fontSize = 30;
        titleStyle.alignment = TextAnchor.MiddleCenter;

        textStyle.normal.textColor = Color.white;
        textStyle.normal.background = null;
        textStyle.fontSize = 20;
    }
    void Update(){
        if(!action.IsBallNull()){
            if (Input.GetKeyDown(KeyCode.J)) action.Shoot();
        }
        if (Input.GetKeyDown(KeyCode.Space)) action.Init();
        if (Input.GetKeyDown(KeyCode.Z)) action.ChangeView('z');
        if (Input.GetKeyDown(KeyCode.X)) action.ChangeView('x');
        if (Input.GetKeyDown(KeyCode.C)) action.ChangeView('c');
    }

    void OnGUI() {
        GUI.Label(new Rect(Screen.width-200, 5, 200, 50), "粒子效果展示", titleStyle);
        GUI.Label(new Rect(12, 12, 200, 50), "视角切换：z, x, c", textStyle);   
        GUI.Label(new Rect(12, 42, 200, 50), "取物：space", textStyle);
        GUI.Label(new Rect(12, 72, 200, 50), "发射：j", textStyle);    
    }
}
```



### 九、小结

* 做粒子特效，除了灵感，理解也很重要，即使是默认素材，也能作出很多花样。
* 内置粒子系统还可用于做粒子流编程，作出一些流体效果，这里没有深入研究。
* 主要是学习了模块面板的使用，没怎么用api控制粒子系统，对api还不太熟悉。



### 十、参考

* [Unity官方手册ParticleSystem][link2]
* [bilibili-梦小天幼的粒子系统详解系列视频][link3]
* [bilibili-Unity官方的粒子效果制作教学][link4]

[link2]:https://docs.unity.cn/cn/2021.3/Manual/ParticleSystemModules.html
[link3]:https://www.bilibili.com/video/BV17V4y1K7Cn/?spm_id_from=333.999.0.0&vd_source=e218f5ce60f09f4f0dc35f89ecd9b4f5
[link4]:https://www.bilibili.com/video/BV1yy4y1B7ir/?from=search&seid=976722035306074353&spm_id_from=333.337.0.0&vd_source=e218f5ce60f09f4f0dc35f89ecd9b4f5



> 2023.01.06			Cauchy.

