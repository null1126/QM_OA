<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台报销</el-breadcrumb-item>
      <el-breadcrumb-item>审核待通过</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 报销待审核区域 -->
      <el-table height="500" :data="checkList" border stripe>
        <el-table-column header-align="center" align="center" label="id" type="index"></el-table-column>
        <el-table-column header-align="center" align="center" label="员工工号" prop="yid"></el-table-column>
        <el-table-column header-align="center" align="center" label="员工姓名" prop="ygname"></el-table-column>
        <el-table-column header-align="center" align="center" label="报销内容" prop="name"></el-table-column>
        <el-table-column header-align="center" align="center" label="报销金额" prop="cost_money"></el-table-column>
        <el-table-column header-align="center" align="center" label="产生日期" prop="time"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleDetails (scope.row.id)">详情页</el-button>
            <el-button size="mini" type="success" @click="alertEdit(scope.row.id)">通过审核</el-button>
            <br />
            <el-button
              style="margin-top:5px"
              size="mini"
              type="warning"
              @click="nopass(scope.row.id)"
            >不通过</el-button>
            <el-button size="mini" type="danger" @click="cancelfun(scope.row.id)">取消报销</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  <!-- 点击详情按钮显示的弹窗 -->
    <el-dialog title="报销详情" :visible.sync="addDialogVisible" width="50%">
      <el-form ref="form" :model="form.data" label-width="80px">
        <el-form-item label="员工工号" prop="yid">
          <el-input v-model="form.yid" disabled></el-input>
        </el-form-item>
        <el-form-item label="员工姓名">
          <el-input v-model="form.ygname" disabled></el-input>
        </el-form-item>
        <el-form-item label="报销内容">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="报销金额">
          <el-input v-model="form.cost_money" disabled></el-input>
        </el-form-item>
        <el-form-item label="产生日期">
          <el-input v-model="form.time" disabled></el-input>
        </el-form-item>
        <el-form-item label="报销凭证">
          <el-card class="box-card">
            <div v-for="o in 4" :key="o" class="text item">{{'报销凭证 ' + o }}</div>
          </el-card>
        </el-form-item>
        <!-- 详情底部按钮 -->
        <el-form-item>
            <el-button type="primary" @click="alertEdit()">通过审核</el-button>
            <el-button type="warning" @click="nopass()">不通过</el-button>
            <el-button type="danger" @click="cancelfun(form.id)">取消报销</el-button>
            <el-button type="info" @click="cancel()">关闭详情</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 点击通过按钮时显示的弹窗 -->
    <el-dialog title="提示" :visible.sync="isaddmoney" width="50%">
       <el-form :label-position="labelPosition" ref="forms" :model="form.data" label-width="80px">
        <el-form-item label="实际报销金额">
          <el-input v-model="form.cost_money"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleEdit(form.id)">确认</el-button>
            <el-button type="warning" @click="cancel()">取消</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>

   <!-- 点击不通过按钮时显示的弹窗 -->
    <el-dialog title="提示" :visible.sync="isaddcause" width="50%">
       <el-form :label-position="labelPosition" ref="forms" :model="form.data" label-width="80px">
        <el-form-item label="不通过原因">
          <el-input type="textarea" :rows="2" placeholder="请输入不通过原因" v-model="hint"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleNopass(form.id)">确认</el-button>
            <el-button type="warning" @click="cancel()">取消</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Apple",
  data() {
    return {
      addDialogVisible: false,  //控制详情弹窗
      isaddmoney:false,  //控制通过弹窗
      isaddcause:false,  //控制不通过弹窗
      labelPosition:'top',  
      hint:'',
      form: {
        uid: "",
        ygname: "",
        name: "",
        cost_money: "",
        time: "",
        picture1: ""
      },
      checkList: []
    };
  },
  created(){
   this.allApply()
  },
  methods: {
    //获取所有待审核数据
    allApply(){
      this.$http.get("costawait").then(res => {
      this.checkList = res.data.data;
    });
    },  
    //详情
    async handleDetails(id) {
      this.addDialogVisible = true;
      await this.$http.post("costfin", { id: id }).then(res => {
        this.form = res.data.data;
      });
    },
    //通过审核
   alertEdit() {
       this.isaddmoney = true;
    },
    async handleEdit(id){
     await this.$http.post("coststatus2", { id: id ,money:this.form.cost_money}).then(res => {
       if(res.data.code === "200"){
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: "success"
        });
        this.isaddmoney = false;
       this.addDialogVisible = false;
       this.allApply()
       return
       }else{
         this.$message({
          showClose: true,
          message: '操作失败',
          type: "error"
        });
       }    
     });
    },
    cancel(){
         this.isaddmoney = false; this.isaddcause = false;this.addDialogVisible = false;
    },
    //审核不通过
   nopass() {
      this.isaddcause = true
    },
   async handleNopass(id){
        await this.$http.post("coststatus1", { id: id ,hint:this.hint}).then(res => {
       if(res.data.code === "200"){
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: "success"
        });
        this.isaddcause = false;
       this.addDialogVisible = false;
       this.allApply()
       return
       }else{
         this.$message({
          showClose: true,
          message: '操作失败',
          type: "danger"
        });
       }    
     }); 
    },
    //取消报销
    cancelfun(id){
     this.$confirm('此操作将取消该人的报销资格, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleCancel(id)
          this.$message({
            type: 'success',
            message: '取消报销资格成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消报销资格失败'
          });          
        });
    },
    async handleCancel(id) {
      await this.$http.post("coststatus3",{id:id}).then(res => {
         console.log(res)
         if(res.data.code === "200"){
        this.$message({
          showClose: true,
          message: res.data.msg,
          type: "success"
        });
       this.allApply()
       return
       }else{
         this.$message({
          showClose: true,
          message: '操作失败',
          type: "danger"
        });
       }    
      })
      
    },
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  width: 100%;
}
</style>
