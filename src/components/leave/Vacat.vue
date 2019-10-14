<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>请假条</el-breadcrumb-item>
      <el-breadcrumb-item>请假安排</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加用户区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" size @click="addDialogVisible=true">添加假期</el-button>
        </el-col>
      </el-row>
      <!-- 请假信息展示区域 -->
      <el-table height="500" :data="holiday" border stripe>
        <el-table-column label="id" type="index"></el-table-column>
        <el-table-column  header-align="center" align="center" label="时间" prop="date">
          <template slot-scope="scope">{{ scope.row.date +'-'+ scope.row.day }}</template>
        </el-table-column>
        <el-table-column  header-align="center" align="center" label="假期说明" prop="remarks"></el-table-column>
      </el-table>
    </el-card>

    <el-dialog title="添加假期" :visible.sync="addDialogVisible" width="50%">
      <!-- 添加用户对话框 -->
      <el-form :model="sizeFrom" ref="sizeFrom" :rules="addFormRules" label-width="80px" size="mini">
        <el-form-item label="假期名称" prop="remarks">
          <el-input v-model="sizeFrom.remarks"></el-input>
        </el-form-item>
        <el-form-item label="假期时间" prop="date">
          <el-date-picker type="dates" v-model="sizeFrom.date" placeholder="选择一个或多个日期"></el-date-picker>
        </el-form-item>

        <el-form-item size="large">
          <el-button type="primary" @click="onSubmit()">创建假期</el-button>
          <el-button @click="resetForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Vacat",
  data() {
    return {
      holiday: [],
      day: "",
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      //   添加用户的表单区域
      sizeFrom: {
        remarks: "",
        date: []
      },
      // 添加表单的验证规则对象
      addFormRules: {
        remarks: [
          { required: true, message: "请输入假期类型", trigger: "blur" }
        ],
        date: [{ required: true, message: "请选择日期", trigger: "blur" }]
      }
    };
  },
  created() {
    this.holidayList();
  },
  methods: {
    //获取假期安排
    async holidayList() { 
      const { data: res } = await this.$http.get("vacationsele");
      if (res.code === "404") {
        this.$message({
          showClose: true,
          message: res.msg,
          type: "warning"
        });
        return;
      } else {
        this.holiday = res.data;
      }
    },
    //提交假期安排
    async onSubmit() {
    if(this.sizeFrom.remarks === "") {
       this.$message({
          showClose: true,
          message: '所填内容不能为空',
          type: "warning"
        });
        return
    }
        await this.$http
        .post("vacationinse", {
          remarks: this.sizeFrom.remarks,
          date: this.sizeFrom.date
        })
        .then(res => {
          if (res.data.code === "200") {
            (this.addDialogVisible = false),
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: "success"
              });
              this.holidayList()
            this.sizeFrom = {};
            return;
          }else if(res.data.code === "404"){
             this.$message({
                showClose: true,
                message: res.data.msg,
                type: "warning"
              });
          }
          else{
           this.$message({
                showClose: true,
                message: res.data.msg,
                type: "danger"
              });
          }
        });
    },
    //重置表单
     resetForm() {
        this.sizeFrom = {}
      }
  }
};
</script>

<style lang="less" scoped>
</style>