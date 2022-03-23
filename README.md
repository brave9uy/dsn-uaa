
- [简介](#简介)
  - [概述](#概述)
  - [目录结构](#目录结构) 
- [启动](#启动)
- [组件说明](#组件说明)
  - [表格](#表格)
     - [分页表格](#分页表格)
     - [树型表格](#树型表格)
     - [滚动表格](#滚动表格)
     - [表格自适应](#表格自适应)
  - [树型选择](#树型选择)
  - [滚动弹窗/图标选择器](#滚动弹窗/图标选择器)

# 简介

这一年经历了许多的困难，庆幸的是许多人对我伸出援手让我度过难关。基于于助人为乐，以及对自身技术的总结提高，我决定把这几年来专注于管理系统的开发经验，整理成一个方案，并将其前端的绝大部分代码开源出来。

## 概述

DSN-UI是基于Vue3 + Typescript + Vue Router 4 + Pinia + Element Plus再封装的前端方案，它能够让你更快速地搭建自己的后台管理系统，避免花过多的时间编写一些组件和后台的基础页面。同时它没有使用Element Plus自带的icon库，而是选择了Font Awesome 5作为icon库。

目前DSN-UI并没有完全实现用户登录等具体的业务，需要使用者自己进行对接。

由于需要请求数据，才能说明一些组件的用法，因此通过Koa搭建后端，模拟出提供数据的api以供使用。

DSN-UI有可以满足一定的自适应(Responsive)需求。

<b>组件说明</b>会说明一些重要以及方便的组件，剩余的一些小组件需要使用者自己根据例子研究源码。

![intro1.png](https://s2.loli.net/2022/03/23/5iRQuYBd98vH6q1.png)

![intro2.png](https://s2.loli.net/2022/03/23/182tFeyY7iO9nzP.png)

## 目录结构

![dir1.png](https://s2.loli.net/2022/03/23/b9icyvwKgIPNJ8r.png)

# 启动

打开终端，进入uaa-ui目录，安装依赖后执行`npm run serve`即可启动dsn-ui  
打开终端，进入uaa-serve目录，安装依赖后执行`npm run serve`即可启动Koa后端

# 组件说明

## 表格

![menu.png](https://s2.loli.net/2022/03/23/orPYjvQSMc5FlkU.png)

不同的功能节点分别展示了三个不同的表格组件，源码当中展示了组件的用法。

![dir2.png](https://s2.loli.net/2022/03/23/3gVJWsdxcuXwyfn.png)

因为是基于ts,列配置的参数可以参考接口的属性。

![column.png](https://s2.loli.net/2022/03/23/bHQuDjrgfJM91da.png)

### 分页表格

![pageable-table.png](https://s2.loli.net/2022/03/23/2jghucMSpt5n37B.png)

### 树型表格

![tree-table1.png](https://s2.loli.net/2022/03/23/AX5HJsMw6lR4heF.png)

![tree-table2.png](https://s2.loli.net/2022/03/23/awS2tlvIhHPNFoJ.png)

### 滚动表格

![scrollable-table1.png](https://s2.loli.net/2022/03/23/FjAZmwikXxP3Qbf.png)

![scrollable-table2.png](https://s2.loli.net/2022/03/23/XSyKxwCz65bVfjW.png)

![scrollable-table3.png](https://s2.loli.net/2022/03/23/uXwBrKqeckJ9UOz.png)

![scrollable-table4.png](https://s2.loli.net/2022/03/23/q7ZUhkfElnXAgIp.png)

### 表格自适应

![responsive1.png](https://s2.loli.net/2022/03/23/qyWE3fpbgTr9JQN.png)

![responsive2.png](https://s2.loli.net/2022/03/23/Hpis9cPrqExJZ5l.png)

## 树型选择

点击权限的修改按钮，进入权限的详情页

![select-tree1.png](https://s2.loli.net/2022/03/23/p5UftWMeVZ1cXar.png)

简单代码即可使用

![select-tree2.png](https://s2.loli.net/2022/03/23/uV2oSjRCl8dmOpL.png)

![select-tree3.png](https://s2.loli.net/2022/03/23/qYdU7crRKDQaseV.png)

![select-tree4.png](https://s2.loli.net/2022/03/23/P5bDr2Nl7YfBJ64.png)

## 滚动弹窗/图标选择器

![icon-select1.png](https://s2.loli.net/2022/03/23/hDVXgYc2fLyeMAa.png)

![icon-select2.png](https://s2.loli.net/2022/03/23/ymr1htTIK2HDZMz.png)

![icon-select3.png](https://s2.loli.net/2022/03/23/fxkpLqyaXIiEYBH.png)

