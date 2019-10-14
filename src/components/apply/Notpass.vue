<template>
    <div>
        <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
    
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台报销</el-breadcrumb-item>
      <el-breadcrumb-item>审核未通过</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 管理员信息区域 -->
      <el-table height="500" :data="checkList" border stripe>
        <el-table-column  header-align="center" align="center" label="id" type="index"></el-table-column>     
        <el-table-column  header-align="center" align="center" label="员工工号" prop="yid"></el-table-column>
        <el-table-column  header-align="center" align="center" label="员工姓名" prop="ygname"></el-table-column>
        <el-table-column  header-align="center" align="center" label="报销内容" prop="name"></el-table-column>
        <el-table-column  header-align="center" align="center" label="报销金额" prop="cost_money"></el-table-column>
        <el-table-column  header-align="center" align="center" label="产生费用日期" prop="time"></el-table-column>
        <el-table-column  header-align="center" align="center" label="未通过原因" prop="hint"></el-table-column>
      </el-table>
    </el-card>
    </div>
</template>
<script>
export default {
    name : 'Notpass',
    data(){
     return{
       checkList:[]
     } 
    },
    mounted() {
      this.$http.get('costawait1')
      .then(res =>{
        this.checkList = res.data.data
      })
    },
}
</script>

<style scoped>

</style>
