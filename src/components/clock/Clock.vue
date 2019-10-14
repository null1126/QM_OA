<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>出勤信息</el-breadcrumb-item>
      <el-breadcrumb-item>员工出勤列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="4">
          <el-input placeholder="请输入内容" v-model="name">
            <el-button slot="append" icon="el-icon-search" @click="puSear"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 员工出勤列表区域 -->
      <el-table :data="clocklist" border stripe>
        <el-table-column label="#" prop="xuhao"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="上班时间" prop="onwork"></el-table-column>
        <el-table-column label="下班时间" prop="afterwork"></el-table-column>
        <el-table-column label="午休时间" prop="onnoon"></el-table-column>
        <el-table-column label="午休结束时间" prop="afternoon"></el-table-column>
        <el-table-column label="迟到时间" prop="latetime"></el-table-column>
        <el-table-column label="上班时长" prop="yourhour"></el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[10]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      clocklist: [],
      page: 1,
      name: '',
      pages:0,
    }
  },
  created() {
    // this.puClockList(), 
    this.puPage()
  },
  methods: {
    // 分页
    async puPage(page) {
      const { data: res1 } = await this.$http.get('clock')
      this.pages=res1.length
      // console.log(res1)
      const { data: res } = await this.$http.post('clockpage/', {page:page})
      console.log(res)
      this.clocklist = res
      // this.puClockList()
    },
    // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      this.page = newPage
      this.puPage()
    },
    // 搜索
    async puSear() {
      const { data: res } = await this.$http.post('clocksearch'+ this.clocklist)
      console.log(res)
      this.puPage()
    }
  }
}
</script>

<style lang="stylus" scoped></style>