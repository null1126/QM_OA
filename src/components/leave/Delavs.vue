<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>请假条</el-breadcrumb-item>
      <el-breadcrumb-item>员工请假审核拒绝</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="getdeavlist.data" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="员工姓名" prop="name"></el-table-column>
        <el-table-column label="员工电话" prop="phone"></el-table-column>
        <el-table-column label="请假日期" prop="date">
          <template slot-scope="scope">{{scope.row.date + '-' +scope.row.day}}</template>
        </el-table-column>
        <el-table-column label="请假类型" prop="status">
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'请假':'调休'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假理由" prop="reason"></el-table-column>
        <el-table-column label="拒绝理由" prop="audit_reason"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            getdeavlist: []
        }
    },
    created() {
        this.getDleavaList()
    },
    methods: {
        async getDleavaList() {
            const { data: res } = await this.$http.get('applyaudit2')
            if(res.code !== '200') {
                return this.$message.warning(res.msg)
            }
            this.getdeavlist = res
        }
    }
}
</script>

<style lang="less" scoped>
</style>