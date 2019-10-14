<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>请假条</el-breadcrumb-item>
      <el-breadcrumb-item>员工请假记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="6">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="getlealist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="员工ID" prop="uid"></el-table-column>
        <el-table-column label="假期类型" prop="choice"></el-table-column>
        <el-table-column label="起始时间" prop="start"></el-table-column>
        <el-table-column label="截止时间" prop="end"></el-table-column>
        <el-table-column label="天数" prop="day"></el-table-column>
        <el-table-column label="状态" prop="status"></el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getlealist: []
    }
  },
  created() {
    this.getLeaList()
  },
  methods: {
    async getLeaList() {
      const { data: res } = await this.$http.get('leave')
      console.log(res)
      res.forEach(element => {
        if (element.choice == "0") {
          element.choice = '事假'
        } else if(element.choice == "1") {
          element.choice = '病假'
        } else {
            element.choice = '调休'
        }
      })
      res.forEach(element => {
        if (element.status == "0") {
          element.status = '待审核'
        } else if(element.status == "1") {
          element.status = '已通过'
        } else {
            element.status = '未通过'
        }
      })
      this.getlealist = res
    }
  }
}
</script>

<style lang="less" scoped>
</style>