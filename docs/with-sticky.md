---
title: 表头固定
order: 3
---

## 与element-table-sticky一起用

[element-table-sticky | a directive for Element to sticky el-table when scrolling](https://tianwang8090.github.io/element-table-sticky/)

::: demo

```vue
<template>
  <div style="height: 600px; overflow: auto;">
    <div style="height: 200px; background: lightblue;">height: 200px</div>
    <el-table
      v-table-scroll
      v-table-sticky
      :data="tableData"
      border
      style="width: 100%;"
    >
      <el-table-column
        fixed
        type="selection"
        width="50"
      />
      <el-table-column
        label="日期"
        width="200"
        prop="date"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="200"
      />
      <el-table-column
        prop="address"
        label="地址"
        width="500"
        show-overflow-tooltip
      />
      <el-table-column
        fixed="right"
        label="操作"
        split-buttons
        width="120"
      >
        <template>
          <el-button type="text" size="small">
            查看
          </el-button>
          <el-button type="text" size="small">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height: 200px; background: lightblue;">height: 200px</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  mounted() {
    // 由于table组件原因，在指令 bind 时，固定列还未渲染。
    // 直接在data 中写静态数据，会使滚动按钮位置偏移。异步数据无影响。
    this.$nextTick(() => {
      this.tableData = [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }];
    });
  }
};
</script>
<style>
table {
  margin: 0;
}
</style>
```

:::
