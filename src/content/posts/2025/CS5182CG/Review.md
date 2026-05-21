---
title: "CG-Review"
published: 2025-05-06
pinned: false
description: CG 复习
tags: [CS5182, 计算机图形学]
category: 课程
draft: false
---

> 有一份复习课的PPT，主要按照上面列出的点来复习。痛快地背单词及考默写阶段。期末考完没有骂，估计是考到复习的内容了。



> Understanding of **basic algorithms and operations** introduced in the lecture. (~27%) 
>
> 2 questions about **transformation** requiring very simple calculations. (~33%) 
>
> **Ray tracing, illumination model, aliasing** (~40%)
>
> 比较重要的是[CG-02], [CG-03], [CG-04], [CG-06], [CG-07]



## 1 Three type of Rendering

* Rasterization based rendering pipeline 光栅化 
* Ray tracing and radiosity 光线追踪、辐射 
* Real-time Rendering 实时渲染 



## 2 Rasterization based rendering pipeline

### 2.1 Object Modeling 对象建模

* 2D drawing - line, circle 2D绘图——直线、圆
    * 直线绘制
        - 使用算法（如Bresenham算法）优化像素选择，通过整数运算高效绘制直线。
        - 判断线段与像素的接近程度，选择最接近的像素进行着色。
    * 圆形绘制
        - 通过对称性减少计算量，逐步绘制圆的像素。

* Representations of 3D object (8种)
    * 3D Point Clouds 点云
    * Polygon Meshes 多边形网格（可定向/不可定向，欧拉公式）
        * 不可定向 - 莫比乌斯环、克莱因瓶
    * Subdivision Surfaces 细分曲面
    * Implicit Surfaces 隐式曲面
    * Parametric Surfaces 参数曲面
    * Voxel Representation 体素
    * Constructive Solid Geometry (CSG) 构造实体几何
    * Fractals 分形

### 2.2 [Transformation]⭐

* Homogeneous coordinates 齐次坐标
* 2D transformations 2D变换
    * Translation 平移
    * Scaling 缩放
        * uniform/non-uniform, simple/general case 均匀/非均匀，简单/一般情况
    * Rotation 旋转
        * rotation orientation, simple/general case, three-step trick: move to origin point 旋转方向，简单/一般，三步法技巧
    * Shearing 错切
* 3D transformations 3D变换
    * Translation, scaling, rotation around x, y and z-axis 平移，缩放，旋转
* Inverse transformation 逆变换
* The order of transformation 变换顺序

### 2.3 Projection 投影

* The elements of projections 投影元素
    * COP, projector, projection plane 摄影中心、投影体、投影平面
* Parallel projection平行投影 
    * Orthographic projection and the corresponding projection 正交投影及对应投影矩阵
    * Oblique projection 斜投影
* Perspective projection 透视投影
    * Vanish point 消失点
    * One/two/three-point perspectibe projection 一点/两点/三点透视投影

#### Perspective Transformation 透视变换

* After the transformation, the z coordinates keep unchanged **变换后z坐标保持不变**
* **Its advantages (2):** 
    * **make clipping easy**
    * 深度值 z 被保留，用于后续的深度测试（如隐藏面去除）
* The transformation matrix

Relationship btw xx projection and pesp transfmt

### 2.4 Hidden/Back Surface Removal 隐面/背面移除（算法理解）

* Object space algorithm 对象空间算法
    * Back-face culling 背面剔除算分
* Image spcae algorithm 图像空间算法
    * Depth-sorting (or Painter's) , limitation (overlap problem) 深度排序（画家算法）重叠问题
    * Z/Depth-Buffering Z缓冲算法

#### After the perspective transformation

* Using the z componet of the normal vector of a typical face 利用典型面的法向量的z分量

### 2.5 Clipping 裁剪（算法理解）

* The Cohen-Sutherland line-clipping 线段裁剪（期中考了三维的）
* The Sutherland Hodgman polygon-clipping 多边形裁剪

#### After the perspective transformation

* The 6 clipping planes become parallel to the 3 axises, making the clipping easier. 6个裁剪平面与三轴平行，简化裁剪

### 2.6 Rasterization 光栅化

* The process of taking a primitive and figuring out which pixels it covers 处理基元，确定覆盖哪些像素

### 2.7 Aliasing 锯齿效应

* Spatical aliasing 空间锯齿
* Temporal alisaing 时间锯齿
    * Introduced by spactical aliasing 由空间锯齿导致
    * Understanding in the time domain 时间采样不足

### 2.8 Anti-aliasing 抗锯齿技术

* Supersampling 超采样
* Accumulation buffer 累积缓冲区
* Stochastic sampling 随机采样
* Catmull's algorithm Catmull算法
* The A-buffer method A-缓冲方法

### 2.9 Illumination model 光照模型

* Light sources 光源
    * Ambient/point/area/spotlight 环境光/点光源/面积光/聚光灯
* Phone illumination model Phong光照模型
    * Ambient reflection 环境反射
    * Diffuse reflection 漫反射
    * Specular reflection 镜面反射

### 2.10 Shading method 着色方法

* Flat shading 平面着色
* Smooth shading 平滑着色
    * Gouraud shading
    * Phong shading

### 2.11 Ray Tracing 光线追踪

* The process 过程
* How to calculate the color of a pixel 计算像素颜色
* The advantages and disavantages 优缺点
* Acceleration 加速技巧
    * Bounding volumes 包围体
    * Space subdivision 空间细分

### 2.12 Radiosity 辐射度

* The process 过程
* The advantages and disavantages 优缺点



## 3 Real-Time Rendering 实时渲染

* Progressive rending technique 渐进式渲染技术

    * Discrete LoD 离散细节层次（LoD）
    * Progressive mesh 渐进网格
        * Edge collapse 边坍塌
        * Vertex split 顶点分裂
    * Selective refinement 选择性细化
* Ways to estimate the visual quality and rendering cost 视觉质量与渲染成本估计方法
* Shadows 阴影

    * Hard shadows 硬阴影
        * Shadow volume and shadow map 阴影体和阴影贴图
    * Soft shadows 软阴影



## 4 GPU and Animation GPU与动画

### 4.1 GPU

* CPU vs GPU

    * **data-intensive tasks** 控制密集型任务 vs **control-heavy tasks** 数据密集型任务

* Efficient computation: Data-level parallelism and task-level parallelism 高效计算：数据级并行和任务级并行

    * GPU支持**数据级并行**（同一操作作用于不同数据子集）和**任务级并行**（多个独立阶段流水线处理）

* Efficient communication 高效通信

    * **CPU与GPU之间通信**是性能瓶颈，优化策略包括批量传输数据流、应用管线化设计、深度流水线来隐藏数据访问延迟

* GPU architecture GPU架构

    * Traditional hardware graphics pipeline 传统硬件图形流水线

    * Advanced hardware graphics pipeline 进阶硬件图形流水线

        (Programmable vertex processer, rasterizer, programmable fragment processors (which processor performs which tasks?)) 可编程顶点处理器、光栅器、可编程片段处理器

### 4.2 Computer animation 计算机动画

* Key frame 关键帧
* Procedure 过程动画
* Motion capture 动作捕捉



## 5 Point Cloud Processing 【不考】

The irregular structure of point cloud data makes it challenging to design 
