---
layout: post
title:  "HW3: 空间与运动"
date:   2022-10-23 14:00:00 +0800
tags:
- unity
- MVC
categories: Game
subtitle: '空间与运动-牧师与恶魔'
---

> 作业简介：
> 1.简答题（涉及游戏对象运动）
> 2.编程实践
>
> ps. GIF图片加载比较慢

<!--more-->

:owl:

### 一、简答题

* 游戏对象运动的本质是什么？

    游戏对象随着每一帧而发生的空间位置（相对的或绝对的）、旋转角度及缩放的变化。

* 用三种以上方法实现物体的抛物线运动。

    抛物线运动的实质是一个方向匀速运动，与其垂直的一个方向进行匀加速运动。

    效果图：

    ![parabola](/img/2022/Homework3/parabola.gif)

    * 法一：对transform.position分方向加变化值

        ```c#
        void Update()
            {
                if(frame<=60){  //运行60帧
                    //向下的方向 匀变速 
                    this.transform.position += Vector3.down * Time.deltaTime * v;
                    //向左的方向 匀速
                    this.transform.position += Vector3.left * Time.deltaTime * 2f;
                    
                    this.transform.Rotate(0f,0f,1f,Space.Self); //每帧旋转 1°
                    v+=0.1f; //加速度为0.1
                    frame++;
                }
            }
        ```

    * 法二：对transform.position整体方向加变化值

        ```c#
        void Update()
            {
                if(frame<=60){  //运行60帧      
                	// 注意正负区分方向
                    Vector3 change = new Vector3(-Time.deltaTime*2f, -Time.deltaTime *v, 0f);
                    this.transform.position += change;
                    
                    this.transform.Rotate(0f,0f,1f,Space.Self); //每帧旋转 1°
                    v+=0.1f;
                    frame++;
                }
            }
        ```

    * 法三：对transform.position应用transform.Translate函数

        ```c#
        void Update()
            {
                if(frame<=60){  //运行60帧
                    Vector3 change = new Vector3(-Time.deltaTime*2f, -Time.deltaTime *v, 0f);
                    this.transform.Translate(change,Space.World);
        
        			// transform.Translate默认是相对于变换的本地轴(Space.Self)来应用该移动
        			// 坐标变换有所区别，不是很好分辨方向
                    // Vector3 change = new Vector3(-Time.deltaTime *v,Time.deltaTime*2f,0f);
                    // this.transform.Translate(change);
        
                    this.transform.Rotate(0f,0f,1f,Space.Self); //每帧旋转 1°
                    v+=0.1f;
                    frame++;
                }
            }
        ```

        

* 写一个程序，实现完整的太阳系，其他星球围绕太阳的转速必须不一样，且不在一个法平面上。

  这里的实现方式是写了个脚本，将围绕太阳旋转的星球都加入这个脚本，然后手动设置不同星球的自传和公转的速度。
  
  ```c#
  using System.Collections;
  using System.Collections.Generic;
  using UnityEngine;
  
  public class planetAround : MonoBehaviour
  {
      public GameObject target;
      public float selfround = 1f; //自转速度
      public float pubaround = 1f; //公转速度
      
      void Update()
      {
          this.transform.Rotate(Vector3.up * Time.deltaTime *selfround);
          this.transform.RotateAround(target.transform.position, Vector3.up, 5 * pubaround * Time.deltaTime);
      }
  }
  
  ```
  
  实际效果：
  
    ![](/img/2022/Homework3/solar.gif)

:lollipop:

### 二、编程实践

![](/img/2022/Homework3/hw.jpg)

试玩游戏界面

![](/img/2022/Homework3/1.jpg)

**游戏规则：**

* 游戏开始时，在河岸的一边有3个牧师与3个魔鬼，他们都想过到河的另一边。
* 只有一艘小船，小船每次最多乘两个人，且必须有一个人船才能动。
* 玩家可以点击牧师或魔鬼让他们上下船，点击船来使船在两岸往返。
* 如果在某一河岸牧师的数量少于魔鬼的数量（包括停在岸边船上人的数量），牧师被杀死，游戏失败。
* 使牧师与魔鬼都到达对岸时，游戏胜利。



#### Object

| Object       | Num  |
| ------------ | ---- |
| 河岸(Coast)  | 2    |
| 河水(Water)  | 1    |
| 船(Boat)     | 1    |
| 牧师(Priest) | 3    |
| 恶魔(Devil)  | 3    |



#### UserAction

| Action       | Condition                       | Effect         |
| ------------ | ------------------------------- | -------------- |
| 点击岸上角色 | 船在相应的河岸，船上人数少于2人 | 角色上船       |
| 点击船上角色 | 无                              | 角色上岸       |
| 点击船       | 船上有至少一个角色              | 船移动到另一岸 |
| 点击Restart  | 游戏结束                        | 重新开始游戏   |



#### Prefabs

涉及的材质与部分预制来源于Assest Store。

河岸(Coast)

![](/img/2022/Homework3/Coast.jpg)

河水(Water)

![](/img/2022/Homework3/Water.jpg)

船(Boat)

![](/img/2022/Homework3/Boat.jpg)

牧师(Priest)

![](/img/2022/Homework3/Priest.jpg)

恶魔(Devil)

![](/img/2022/Homework3/Devil.jpg)



#### MVC框架

![Map](/img/2022/Homework3/Map.jpg)



#### 主要代码

项目地址：[https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw3/Assets][link]

[link]:https://github.com/Cauchyoooo/3DGameDesign/tree/main/hw3/Assets

##### Director

采用单例模式，在运行时才创建Director实例，若已创建该实例不会重复创建。

```c#
public class Director : System.Object
{
    private static Director _instance;

    public ISceneController currentSceneController { get; set;}

    public static Director getInstance()
    {
        if(_instance == null){
            _instance = new Director();
        }
        return _instance;
    }
}
```



##### ISceneController

场记接口，用于加载场景资源。

```c#
public interface ISceneController
{
	void LoadResources();
}
```



##### IUserAction

用户操作接口，用于记录可能的用户操作。这里将上述的4个行为转化为以下3个。

```c#
public interface IUserAction
{
    void ClickCharacter(myCharacterController charactorController);
    void moveBoat();
    void Restart();  
}
```



##### Moveable

可移动脚本，具有该组件的游戏对象才可以移动。

```c#
public class Moveable : MonoBehaviour
{
    readonly float moveSpeed = 20;
    /// 0->not moving 1->moving to middle 2->moving to destination
    int moveStatus;
    Vector3 destination;
    Vector3 middle;

    void Update() {
		if (moveStatus == 1) {
			transform.position = Vector3.MoveTowards (transform.position, middle, moveSpeed * Time.deltaTime);
			if (transform.position == middle) {
				moveStatus = 2;
			}
		} 
        else if (moveStatus == 2) {
			transform.position = Vector3.MoveTowards (transform.position, destination, moveSpeed * Time.deltaTime);
			if (transform.position == destination) {
				moveStatus = 0;
			}
		}
	}
	public void setDestination(Vector3 d) {
		destination = d;
		middle = d;
		/// Moving Boat
		if (d.y == transform.position.y) {	
			moveStatus = 2;
		}
		/// Move character from coast to boat
		else if (d.y < transform.position.y) {
			middle.y = transform.position.y;
		} 
		/// Move character from boat to coast
		else {
			middle.x = transform.position.x;
		}
		moveStatus = 1;
	}

	public void reset() {
		moveStatus = 0;
	}
}
```



##### CoastController

河岸控制器，用于创建河岸及涉及河岸的各种操作

```c#
public class CoastController 
{
	readonly GameObject coast;
	readonly Vector3 startPos = new Vector3(9,1,0);
	readonly Vector3 endPos = new Vector3(-9,1,0);
	readonly Vector3[] positions;
	/// direction : Start or End
	readonly string direction;	

	/// change frequently
	myCharacterController[] passengerPlaner;

	public CoastController(string direc) {
		positions = new Vector3[] {new Vector3(6.5F,2.0F,0), new Vector3(7.5F,2.0F,0), new Vector3(8.5F,2.0F,0), 
			new Vector3(9.5F,2.0F,0), new Vector3(10.5F,2.0F,0), new Vector3(11.5F,2.0F,0)};

		passengerPlaner = new myCharacterController[6];

		if (direc == "Start") {
			coast = Object.Instantiate (Resources.Load ("Prefabs/Coast", typeof(GameObject)), startPos, Quaternion.identity, null) as GameObject;
			coast.name = "Start";
            coast.tag = "Start";
			direction = "Start";
		} 
        else if(direc == "End"){
			coast = Object.Instantiate (Resources.Load ("Prefabs/Coast", typeof(GameObject)), endPos, Quaternion.identity, null) as GameObject;
			coast.name = "End";
            coast.tag = "End";
			direction = "End";
		}
	}

	public int getEmptyIndex() {
		for (int i = 0; i < passengerPlaner.Length; i++) {
			if (passengerPlaner [i] == null) {
				return i;
			}
		}
		return -1;
	}

	public Vector3 getEmptyPosition() {
		Vector3 pos = positions [getEmptyIndex ()];
        if(direction == "End")
            pos.x *= -1;
		return pos;
	}

	public void getOnCoast(myCharacterController cC) {
		int index = getEmptyIndex ();
		passengerPlaner [index] = cC;
	}
		
	public myCharacterController getOffCoast(string passengerName) {	
		for (int i = 0; i < passengerPlaner.Length; i++) {
			if (passengerPlaner [i] != null && passengerPlaner [i].getName () == passengerName) {
				myCharacterController cC = passengerPlaner [i];
				passengerPlaner [i] = null;
				return cC;
			}
		}
		return null;
	}

	public string getDirection() {
		return direction;
	}

	public int[] getNum() {
		int[] count = {0, 0};
		for (int i = 0; i < passengerPlaner.Length; i++) {
			if (passengerPlaner [i] == null)
				continue;
			/// 0->priest, 1->devil
			if (passengerPlaner [i].getType () == 0) {	
				count[0]++;
			} 
            else {
				count[1]++;
			}
		}
		return count;
	}

	public void reset() {
		passengerPlaner = new myCharacterController[6];
	}
}
```



##### BoatController

船控制器，用于创建船及涉及船的各种操作。

```c#
public class BoatController
{
    readonly GameObject boat;
	readonly Moveable moveScript;
	readonly Vector3 startPosition = new Vector3 (5, 1, 0);
	readonly Vector3 endPosition = new Vector3 (-5, 1, 0);
	readonly Vector3[] startPositions;
	readonly Vector3[] endPositions;
    
	/// change frequently
    string direction; 
	myCharacterController[] passenger = new myCharacterController[2];

	public BoatController() {
		direction = "Start";

		startPositions = new Vector3[] { new Vector3 (4.5F, 1.1F, 0), new Vector3 (5.5F, 1.1F, 0) };
		endPositions = new Vector3[] { new Vector3 (-5.5F, 1.1F, 0), new Vector3 (-4.5F, 1.1F, 0) };

		boat = Object.Instantiate (Resources.Load ("Prefabs/Boat", typeof(GameObject)), startPosition, Quaternion.identity, null) as GameObject;
		boat.name = "boat";
        boat.tag = "Boat";

		moveScript = boat.AddComponent (typeof(Moveable)) as Moveable;
		boat.AddComponent (typeof(Click));
	}

	public void Move() {
		if (direction == "End") {
			moveScript.setDestination(startPosition);
			direction = "Start";
		} 
		else {
			moveScript.setDestination(endPosition);
			direction = "End";
		}
	}

	public int getEmptyIndex() {
		for (int i = 0; i < passenger.Length; i++) {
			if (passenger [i] == null) {
				return i;
			}
		}
		return -1;
	}

	public bool isEmpty() {
		for (int i = 0; i < passenger.Length; i++) {
			if (passenger [i] != null) {
				return false;
			}
		}
		return true;
	}

	public Vector3 getEmptyPosition() {
		Vector3 pos;
		int emptyIndex = getEmptyIndex ();
		if (direction == "End") {
			pos = endPositions[emptyIndex];
		} 
		else {
			pos = startPositions[emptyIndex];
		}
		return pos;
	}

	public void getOnBoat(myCharacterController characterCtrl) {
		int index = getEmptyIndex ();
		passenger [index] = characterCtrl;
	}

	public myCharacterController getOffBoat(string passenger_name) {
		for (int i = 0; i < passenger.Length; i++) {
			if (passenger [i] != null && passenger [i].getName () == passenger_name) {
				myCharacterController charactorCtrl = passenger [i];
				passenger [i] = null;
				return charactorCtrl;
			}
		}
		return null;
	}

	public GameObject getGameobj() {
		return boat;
	}

	public string getDirection() {
		return direction;
	}

	public int[] getNum() {
		int[] count = {0, 0};
		for (int i = 0; i < passenger.Length; i++) {
			if (passenger [i] == null)
				continue;
			/// 0->priest, 1->devil
			if (passenger [i].getType () == 0) {	
				count[0]++;
			} 
			else {
				count[1]++;
			}
		}
		return count;
	}

	public void reset() {
		moveScript.reset ();
		if (direction == "End") {
			Move ();
		}
		passenger = new myCharacterController[2];
	}
}
```



##### myCharacterController

角色控制器，用于创建牧师(Priest)与魔鬼(Devil)，及涉及角色的各种操作。

```c#
public class myCharacterController
{
    readonly GameObject character;
	readonly Moveable moveScript;
	readonly Click click;
	/// 0->priest, 1->devil
	readonly int characterType;	
	/// change frequently
	bool _isOnBoat;
	CoastController coastController;

	public myCharacterController(string _character) {
		if (_character == "Priest") {
			character = Object.Instantiate (Resources.Load ("Prefabs/Priest", typeof(GameObject)), Vector3.zero, Quaternion.Euler(0, 180, 0), null) as GameObject;
			characterType = 0;
		} 
        else {
			character = Object.Instantiate (Resources.Load ("Prefabs/Devil", typeof(GameObject)), Vector3.zero, Quaternion.Euler(0, 180, 0), null) as GameObject;
			characterType = 1;
		}
		moveScript = character.AddComponent (typeof(Moveable)) as Moveable;

		click = character.AddComponent (typeof(Click)) as Click;
		click.setController (this);
	}

	public void setName(string name) {
		character.name = name;
	}

    public void setTag(string tag) {
		character.tag = tag;
	}

	public void setPosition(Vector3 pos) {
		character.transform.position = pos;
	}

	public void moveTo(Vector3 destination) {
		moveScript.setDestination(destination);
	}

	public int getType() {
		return characterType;
	}

	public string getName() {
		return character.name;
	}

    public string getTag() {
		return character.tag;
	}

	public void getOnBoat(BoatController boat) {
		coastController = null;
		character.transform.parent = boat.getGameobj().transform;
		_isOnBoat = true;
	}

	public void getOnCoast(CoastController coast) {
		coastController = coast;
		character.transform.parent = null;
		_isOnBoat = false;
	}

	public bool isOnBoat() {
		return _isOnBoat;
	}

	public CoastController getCoastController() {
		return coastController;
	}

	public void reset() {
		moveScript.reset ();
		coastController = (Director.getInstance ().currentSceneController as FirstControllor).startCoast;
		getOnCoast (coastController);
		setPosition (coastController.getEmptyPosition ());
		coastController.getOnCoast (this);
	}
}
```



##### FirstController

最高层控制器，实现场记接口、用户行动接口的功能。

```c#
public class FirstController : MonoBehaviour, ISceneController, IUserAction
{
    readonly Vector3 waterPos = new Vector3(0,0.5F,0);
    public CoastController startCoast;
    public CoastController endCoast;
    public BoatController boat;
    private myCharacterController[] characters;
    myUserGUI userGUI;

    void Start ()
    {
        Director director = Director.getInstance();
        director.currentSceneController = this;
        userGUI = gameObject.AddComponent<myUserGUI>() as myUserGUI;
        characters = new myCharacterController[6];
        LoadResources();
    }

    public void LoadResources(){
        GameObject water = Instantiate(Resources.Load("Prefabs/Water", typeof(GameObject)), waterPos, Quaternion.identity, null) as GameObject;
        water.name = "water";
        water.tag = "Water";

        startCoast = new CoastController("Start");
        endCoast = new CoastController("End");
        boat = new BoatController();

        for(int i=0;i<3;i++){
            myCharacterController priest = new myCharacterController("Priest");
            priest.setName("Priest "+i);
            priest.setTag("Priest");
            priest.setPosition(startCoast.getEmptyPosition());
            priest.getOnCoast(startCoast);
            startCoast.getOnCoast(priest);
            characters[i] = priest;
        }

        for(int i=0;i<3;i++){
            myCharacterController devil = new myCharacterController("Devil");
            devil.setName("Devil "+i);
            devil.setTag("Devil");
            devil.setPosition(startCoast.getEmptyPosition());
            devil.getOnCoast(startCoast);
            startCoast.getOnCoast(devil);
            characters[i+3] = devil;
        }
    }

    public void moveBoat(){
        if(boat.isEmpty())
            return;
        boat.Move();
        userGUI.status = checkGameOver();
    }

    public void ClickCharacter(myCharacterController cC){
        if(cC.isOnBoat()){
            CoastController coast;
            if(boat.getDirection()=="Start")
                coast = startCoast;
            else
                coast = endCoast;

            boat.getOffBoat(cC.getName());
            cC.moveTo(coast.getEmptyPosition());
            cC.getOnCoast(coast);
            coast.getOnCoast(cC);
        }
        else{
            CoastController coast = cC.getCoastController();
            if(boat.getEmptyIndex () == -1 || coast.getDirection() != boat.getDirection())
                return;
            coast.getOffCoast(cC.getName());
            cC.moveTo(boat.getEmptyPosition());
            cC.getOnBoat(boat);
            boat.getOnBoat(cC);
        }

        userGUI.status = checkGameOver();
    }

    /// -1->lose 0->unfinish 1->win
    int checkGameOver(){
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

        if(endDevil+endPriest ==6)
            return 1;
        
        int[] boatCount = boat.getNum();
        if(boat.getDirection() == "End"){
            endPriest += boatCount[0];
            endDevil += boatCount[1];
        }
        else{
            startPriest += boatCount[0];
            startDevil += boatCount[1];
        }

        if(startPriest<startDevil && startPriest>0)
            return -1;
        if(endPriest<endDevil && endPriest>0)
            return -1;
            
        return 0;
        

    }

    public void Restart(){
        boat.reset();
        startCoast.reset();
        endCoast.reset();
        for(int i=0;i<characters.Length;i++)
            characters[i].reset();
    }
}
```



##### Click

点击脚本，检测船和角色是否被点击，从而进行移动的操作。其中，角色和船必须含有碰撞体的组件，不然无法监听对象是否被点击。

```c#
public class Click : MonoBehaviour 
{
    IUserAction userAction;
    myCharacterController characterController;

    public void setController(myCharacterController cC){
        characterController = cC;
    }

    void Start(){
        userAction = Director.getInstance().currentSceneController as IUserAction;
    }

    void OnMouseDown(){
        if(gameObject.tag == "Boat")
            userAction.moveBoat();
        else if(gameObject.tag == "Priest" || gameObject.tag == "Devil")
            userAction.ClickCharacter(characterController);
        Debug.Log("Click");
    }
}

```



##### myUserGUI

游戏结束的界面设计。

```c#
public class myUserGUI : MonoBehaviour
{
    private IUserAction action;
    public int status = 0;
    GUIStyle style;
    GUIStyle buttonStyle;

    void Start(){
        action = Director.getInstance ().currentSceneController as IUserAction;

		style = new GUIStyle();
		style.fontSize = 40;
		style.alignment = TextAnchor.MiddleCenter;

		buttonStyle = new GUIStyle("button");
		buttonStyle.fontSize = 30;
    }

    void OnGUI() {
		if (status == -1) {
			GUI.Label(new Rect(Screen.width/2-50, Screen.height/2-85, 100, 50), "Gameover!", style);
			if (GUI.Button(new Rect(Screen.width/2-70, Screen.height/2, 140, 70), "Restart", buttonStyle)) {
				status = 0;
				action.Restart ();
			}
		} 
        else if(status == 1) {
			GUI.Label(new Rect(Screen.width/2-50, Screen.height/2-85, 100, 50), "You win!", style);
			if (GUI.Button(new Rect(Screen.width/2-70, Screen.height/2, 140, 70), "Restart", buttonStyle)) {
				status = 0;
				action.Restart ();
			}
		}
	}
}
```



##### 实现效果

![PandD](/img/2022/Homework3/PandD.gif)



##### 有待改进

* 没有添加角色行走的动画，及制作朝向
* 河水和船等动画也没有制作
* 没有加1min的倒计时
* 游戏失败没有等船到岸之后弹出来



> Cauchy       2022.10.23
