---
layout: post
title:  "HW6: 物理系统与碰撞"
date:   2022-12-04 14:00:00 +0800
tags: 
- unity
- rigidbody
categories: Game
subtitle: '物理系统与碰撞'

---

> 作业简介：
>
> 1. 打靶游戏（涉及刚体物理学、碰撞）

<!--more-->

:racehorse:

## 打靶游戏

* 靶对象为5环，按环记分；
* 箭对象，射中后要插在靶上；射中后，箭对象产生颤抖效果，到下一次射击或1秒以后；
* 游戏仅一轮，无限trials；添加一个风向和强度标志，提高难度。



**项目地址：**

[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw6/Assets][link]

[link]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw6/Assets



**效果展示图：**

![1](/img/2022/Homework6/1.gif)



**代码框架图：**

![射箭游戏](/img/2022/Homework6/射箭游戏.png)



#### 1、预制件制作

* 靶子

1个空对象作为父对象，包含5个圆柱体(Cylinder)。通过前后位置的摆放，可以在正面形成环状视觉效果。

![2](/img/2022/Homework6/2.png)

空对象上只挂载刚体组件rigidbody，碰撞检测选择连续的Continus。

![4](/img/2022/Homework6/4.png)

圆柱子对象则挂载MeshCollider，并勾选Convex和其下的Is Trigger让其有碰撞检测功能。

![3](/img/2022/Homework6/3.png)

* 箭

1个空对象作为父对象，包含1个长方体(Cube)箭头、1个圆柱体(Cylinder)箭身、3个长方体(Cube)箭尾。

![5](/img/2022/Homework6/5.png)

空对象同样只挂载刚体组件rigidbody，注意勾选使用重力Use Gravity及使用动力学Is Kinematic。碰撞检测选择动态连续Continuous Dynamic。

![6](/img/2022/Homework6/6.png)

子对象只在箭头挂载碰撞器与箭头脚本。**注意：**如果箭头长度太短，又配合高速运动的话，碰撞检测很有可能会出现异常，比如一次性检测到多个或者少检测到几个。

![7](/img/2022/Homework6/7.png)



这样，主要的预制件就做好了。这里还做了一个背景板的预制件，附带了碰撞器效果，使射出靶范围的箭能停在“墙”上。



#### 2、部分代码解析

* arrowScript

箭头脚本：检测箭与靶子的碰撞。

这里利用靶子的圆柱组件Tag来识别打到哪个环，从而计分。为避免多次碰撞，加入cnt计数限制只计分一次碰撞。碰撞完成后，将箭的空对象的刚体属性更改为is Kinematic，且速度归零；箭的tag改为”Hit“，用于触发抖动运动。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class arrowScript : MonoBehaviour
{
    public int cnt = 0;
    private string ColliderTag;
    private ScoreController scoreController;

    void OnTriggerEnter(Collider tar) {
        cnt++;
        if(cnt>1) return;
        ColliderTag = tar.gameObject.tag;
        Rigidbody parent = this.gameObject.transform.parent.gameObject.GetComponent<Rigidbody>();
        parent.isKinematic = true;
        parent.velocity = Vector3.zero;
        parent.gameObject.tag = "Hit";
        scoreController.Record(ColliderTag);
    }

    public void reset(){
        cnt = 0;
    }

    void Awake(){
        scoreController = (ScoreController)FindObjectOfType(typeof(ScoreController));
    }
}

```



* CCFlyAction

箭飞行运动：传入wind和force参数，来控制箭上施加的物理学的力。rot参数根据wind参数，增加自旋效果。为确保Tremble抖动运动值运行一次，这里加入了isTrem判断。只有运行完飞行运动且Tag为"Hit"的物体才会发生抖动。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CCFlyAction : SSAction
{
    public Vector3 force;
    public Vector3 wind;
    private Vector3 rot = new Vector3(0,0,0);
    private bool isTrem = false;

    public static CCFlyAction GetCCFlyAction(Vector3 _wind, Vector3 _force){
        CCFlyAction action = ScriptableObject.CreateInstance<CCFlyAction>();
        action.force = _force;
        action.wind = _wind;
        action.rot.z = _wind.x;
        return action;
    }

    public override void Start(){
        isTrem = false;
        gameObject.transform.LookAt(force);
		gameObject.GetComponent<Rigidbody>().isKinematic = false;
		gameObject.GetComponent<Rigidbody>().AddForce(force, ForceMode.Impulse);
		gameObject.GetComponent<Rigidbody>().velocity = Vector3.zero;
		gameObject.GetComponent<Rigidbody>().AddForce(force + wind, ForceMode.Impulse);
        gameObject.GetComponent<Rigidbody>().angularVelocity = rot;
    }

    public override void Update(){}

    public override void FixedUpdate()
    {
        this.gameObject.GetComponent<Rigidbody>().AddForce(wind, ForceMode.Force);
        if (this.gameObject.tag == "Hit" && isTrem == false){
            this.callback.SSActionEvent(this, this.gameObject);
            isTrem = true;
        }
        if (transform.position.y < -10 || transform.position.z > -6.7) {
            this.destroy = true;
        }
    }

}


```



* CCTrembleAction

箭抖动运动：抖动时间为0.5秒，通过箭的轻微上下运动来模拟抖动效果。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CCTrembleAction : SSAction
{
    float radian = 0;
	float per_radian = 3f;
	float radius = 0.01f;
	Vector3 old_pos;
	public float left_time = 0.5f;

	public override void Start(){
        old_pos = transform.position;
    }
	public static CCTrembleAction GetSSAction(){
		CCTrembleAction tremble = CreateInstance<CCTrembleAction>();
		return tremble;
	}
	public override void Update(){
		left_time -= Time.deltaTime;
		if (left_time <= 0){
			transform.position = old_pos;
			this.destroy = true;
			this.callback.SSActionEvent(this);
		}
		radian += per_radian;
		float dy = Mathf.Cos(radian) * radius; 
		transform.position = old_pos + new Vector3(0, dy, 0);
	}
	public override void FixedUpdate(){}

}
```



* ArrowFactory

箭工厂：用于生成与回收箭。这里是相当于最多生成10支箭，用完了则回收最先用的箭来用。生成箭或利用回收的箭时，记得恢复箭的初始属性。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ArrowFactory : MonoBehaviour
{
    public GameObject arrow = null;
    List<GameObject> used;
    Queue<GameObject> free;


    void Start()
    {
        used = new List<GameObject>();
        free = new Queue<GameObject>();
        
    }

    public GameObject GetArrow(){
        if(free.Count == 0){
            arrow = Instantiate(Resources.Load<GameObject>("Prefabs/arrow"));
        }
        else{
            arrow = free.Dequeue();
            arrow.gameObject.SetActive(true);
            arrow.gameObject.tag = "Untagged";
            arrow.gameObject.transform.Find("head").gameObject.SetActive(true);
            arrow.gameObject.transform.Find("body").gameObject.SetActive(true);
            arrow.gameObject.transform.Find("head").GetComponent<arrowScript>().reset();
        }
        arrow.transform.position = new Vector3(0, 2.5f, -12.5F);
        used.Add(arrow);
        return arrow; 
    }


    public void FreeArrow(){
        if(used.Count<=10)
            return;
        for(int i=0; i<used.Count; i++){
            if(used[i].gameObject.transform.position.y <= -10 || used[i].gameObject.transform.position.z >= -5 || used[i].gameObject.tag == "Hit"){
                used[i].GetComponent<Rigidbody>().isKinematic = true;
                used[i].gameObject.SetActive(false);
                used[i].transform.position =  new Vector3 (0, 2.5f, -12.5f);
                free.Enqueue(used[i]);
                used.Remove(used[i]);
                break;
            }
        }
    }
}
```



* RoundController

场景控制器：加载资源（靶子、墙体等），生成风，移动箭等的功能实现。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class RoundController : MonoBehaviour, ISceneController, IUserAction
{
    ArrowFactory factory;
    public CCActionManager actionManager;
    public ScoreController scoreController;
    public myUserGUI userGUI;

    public GameObject target;
    public GameObject arrow;
    public bool isStart = false;
    public string windTag = "";

    private float wind_directX;     
	private float wind_directY; 

    void Start()
    {   
        Director director = Director.getInstance();
        director.currentSceneController = this;
        gameObject.AddComponent<ArrowFactory>();
        factory = Singleton<ArrowFactory>.Instance;
        actionManager = gameObject.AddComponent<CCActionManager>() as CCActionManager;
        scoreController = gameObject.AddComponent<ScoreController>() as ScoreController;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;
        LoadResource();
    }
    
    public void LoadResource()
    {
        target = GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/target"));
        GameObject.Instantiate<GameObject>(Resources.Load<GameObject>("Prefabs/wall"));

    }

    void Update()
    {
        if(isStart) {
            factory.FreeArrow();
        }
    }

    public void Init(){
        if(arrow == null){
            wind_directX = Random.Range(-4, 4);
			wind_directY = Random.Range(-4, 4);
            CreateWind();
            arrow = factory.GetArrow();
        }
    }

    public void moveBow(Vector3 mousePos){
        if(!isStart)
            return;
        arrow.transform.LookAt(mousePos * 30);
    }

    public void shootArrow(Vector3 force){
        if(isStart)
		{
			Vector3 wind = new Vector3(wind_directX, wind_directY, 0);
			actionManager.MoveArrow(arrow, wind, force * 10);
			arrow = null;
		}
    }
    public bool GetStart(){
        return isStart;
    }

    public string GetWind()
    {
        return windTag;
    }


    public void Begin()
    {
        isStart = true;
    }

    public int GetScore()
    {
        return scoreController.score;
    }

    public void CreateWind(){
        string Horizontal = "", Vertical = "", level = "";
        if (wind_directX > 0) {
            Horizontal = "西";
        } else if (wind_directX <= 0) {
            Horizontal = "东";
        }
        if (wind_directY > 0) {
            Vertical = "南";
        } else if (wind_directY <= 0) {
            Vertical = "北";
        }
        if ((wind_directX + wind_directY) / 2 > -1 && (wind_directX + wind_directY) / 2 < 1)
		{
			level = "1 级";
		}
		else if ((wind_directX + wind_directY) / 2 > -2 && (wind_directX + wind_directY) / 2 < 2)
		{
			level = "2 级";
		}
		else if ((wind_directX + wind_directY) / 2 > -3 && (wind_directX + wind_directY) / 2 < 3)
		{
			level = "3 级";
		}
		else if ((wind_directX + wind_directY) / 2 > -5 && (wind_directX + wind_directY) / 2 < 5)
		{
			level = "4 级";
		}
        windTag = Horizontal + Vertical + "风" + " " + level;
    
    }

    public bool isArrowNull(){
        return (arrow != null);
    }

    
}

```



* ScoreController

计分器：利用靶子上带有碰撞器的物体的tag来计分。

```c#
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ScoreController : MonoBehaviour
{
    public int score;

    public void Start(){
        score = 0;
    }

    public void Record(string ColliderTag){
        if(ColliderTag == "10"){
            score+=10;
        }
        else if(ColliderTag == "8"){
            score+=8;
        }
        else if(ColliderTag == "6"){
            score+=6;
        }
        else if(ColliderTag == "4"){
            score+=4;
        }
        else if(ColliderTag == "2"){
            score+=2;
        }
                
    }

    public void Reset(){
        score = 0;
    }
}

```



#### 3、小结

* 要区分物理学与运动学，Rigidbody与isKinematic等的使用。
* 要区分各种碰撞检测模式，Discrete、Continus、Continus Dynamic等，有性能上的差异。
* 碰撞异常要思考：物体是否启用碰撞器、碰撞检测模式是否正确、物体运动是否过于高速、物体碰撞器体积是否过小等。
* 熟悉Rigidbody的一些属性与使用，方便实现物理运动效果。



> Cauchy        2022.12.04