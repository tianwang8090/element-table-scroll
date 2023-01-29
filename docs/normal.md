---
title: 普通表格
order: 1
---

## 普通表格

::: demo

``` vue
<template>
  <el-table
    v-table-scroll
    :data="tableData"
    border
    style="width: 600px;"
  >
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
  </el-table>
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
