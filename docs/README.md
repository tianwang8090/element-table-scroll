---
title: Using 使用
order: 1
---

A directive for **Element(Vue@2.x)** el-table to scroll on the table header.

用于生成 el-table 的表头横向滚动按钮，实现在表头点击可以横向滚动。

![demo](../scroll-demo.gif)

## Usage 使用

1. Install 安装

    ```sh
    npm i element-table-scroll
    ```

2. Register 注册指令

    ```js
    import ElTableScroll from 'element-table-scroll';
    Vue.directive('table-scroll', ElTableScroll);
    ```

3. Using 使用

    ```vue
    <el-table
      v-table-scroll
      ...
    >
    ...
    </el-table>
    ```
