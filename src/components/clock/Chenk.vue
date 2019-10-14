<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>出勤信息</el-breadcrumb-item>
      <el-breadcrumb-item>下月打卡记录表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加用户区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="dateDialogVisible = true">生成下月打卡表</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 添加生成区域 -->
    <el-dialog title="生成打卡表" :visible.sync="dateDialogVisible" width="40%">
      <el-form label-width="80px">
        <el-form-item label="年份" prop="year">
          <el-input v-model="year" placeholder="请输入打卡表年份"></el-input>
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-input v-model="month" placeholder="请输入打卡表月份"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDate(year,month)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dateDialogVisible: false,
      year: '',
      month: ''
    }
  },
  methods: {
    async showDate(year, month) {
      const { data: res } = await this.$http.post('checkinginse/', {
        month: month,
        year: year
      })
      console.log(res)
      if (res.code == '404') {
        return this.$message.warning('该月打卡记录表已经存在，无需重复生成!')
      }
      this.$message.success('生成成功！')
      this.dateDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
</style>