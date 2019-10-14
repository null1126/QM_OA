<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工薪资</el-breadcrumb-item>
      <el-breadcrumb-item>员工奖励</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button size="mini" type="primary" @click="alertaddAward ()">添加奖励</el-button>
      <!-- 奖励渲染 -->
      <el-table height="500" :data="awardList" border stripe>
        <el-table-column header-align="center" align="center" label="id" type="index"></el-table-column>
        <el-table-column header-align="center" align="center" label="员工工号" prop="uid"></el-table-column>
        <el-table-column header-align="center" align="center" label="员工姓名" prop="name"></el-table-column>
        <el-table-column header-align="center" align="center" label="电话" prop="phone"></el-table-column>
        <el-table-column header-align="center" align="center" label="奖励金额" prop="money">
          <template slot-scope="scope">{{ scope.row.money +" 元"}}</template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="奖励原因" prop="describe"></el-table-column>
        <el-table-column header-align="center" align="center" label="奖励时间" prop="time"></el-table-column>
        <el-table-column header-align="center" align="center" label="添加时间" prop="times"></el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="alertamendAward (scope.row.id)">修改</el-button>
            <el-button size="mini" type="danger" @click="alertDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加奖励弹框 -->
    <el-dialog title="添加奖励" :visible.sync="isaddAward" width="50%">
      <el-form :model="Form" :rules="rules" ref="Form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="员工电话" prop="phone">
          <el-input v-model="Form.phone" placeholder="请输入11位的电话号码"></el-input>
        </el-form-item>
        <el-form-item label="奖励原因" prop="describe">
          <el-input v-model="Form.describe" placeholder="请输入奖励原因"></el-input>
        </el-form-item>
        <el-form-item label="奖励金额" prop="money">
          <el-input v-model="Form.money" placeholder="请输入奖励金额"></el-input>
        </el-form-item>
        <el-form-item label="产生时间" prop="date">
          <el-date-picker v-model="Form.date" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="addsubmitForm ('Form')">确认</el-button>
          <el-button size="mini" type="warning" @click="resetAward('Form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 修改奖励弹框 -->
    <el-dialog title="修改奖励" :visible.sync="isamendAward" width="50%">
      <el-form :model="Form1" :rules="rules" ref="Form1" label-width="100px" class="demo-ruleForm">
        <el-form-item label="员工电话" prop="phone">
          <el-input v-model="Form1.phone"></el-input>
        </el-form-item>
        <el-form-item label="奖励理由" prop="describe">
          <el-input v-model="Form1.describe"></el-input>
        </el-form-item>
        <el-form-item label="奖励金额" prop="money">
          <el-input v-model="Form1.money"></el-input>
        </el-form-item>
        <el-form-item label="产生时间" prop="date">
          <el-date-picker v-model="Form1.date" type="date"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="amendsubmitForm ('Form1',Form1.id)">确认</el-button>
          <el-button size="mini" type="warning" @click="cancelAward()">取消修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Award",
  data() {
     let verifyphone = (rule, phone, callback) => {
        if (!(/^1[3456789]\d{9}$/.test(phone))) {
          callback(new Error('请输入合法的电话号码'));
        }else {
          callback();
        }
      };
    return {
      awardList: [],
      isaddAward: false,
      isamendAward: false,    
      rules: {
        phone: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: "blur"
          },
          {validator: verifyphone} 
        ],
        describe: [
          { required: true, message: "请输入报销理由", trigger: "change" }
        ],
        money: [
          { required: true, message: "请输入奖励金额", trigger: "change" },
        ],
        date: [{ required: true, message: "请选择报销时间", trigger: "change" }]
      },
      Form: {
        phone: "",
        describe: "",
        money: "",
        date: ""
      },
      Form1: {
        phone: "",
        describe: "",
        money: "",
        date: ""
      }
    };
  },
  created() {
    this.allawardList();
  },
  methods: {
    //获取奖励数据
    allawardList() {
      this.$http.get("rewardssele1").then(res => {
        if (res.data.code === "200") {
          this.awardList = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: "暂时没有奖励数据哦",
            type: "error"
          });
        }
      });
    },
    //添加奖励弹窗
    alertaddAward() {
      this.isaddAward = true;
    },
    //添加奖励表单验证
    addsubmitForm(Form) {
      this.$refs[Form].validate(valid => {
        if (valid) {
          this.addAward(Form);
        } else {
          this.$message({
            showClose: true,
            message: "请将表单输入完整",
            type: "error"
          });
          return false;
        }
      });
    },
    //添加奖励
    addAward(Form) {
      this.$http
        .post("rewardsinse", {
          phone: this.Form.phone,
          status: 0,
          describe: this.Form.describe,
          money: this.Form.money,
          date: this.Form.date
        })
        .then(res => {
          if (res.data.code === "200") {
            (this.isaddAward = false),
            this.resetAward(Form),  //清空表单数据
             this.allawardList();
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
    },
    //修改奖励弹窗
    alertamendAward(Form1,id) {
      this.isamendAward = true;
      this.backAward(Form1,id);
    },
    //获取回填数据
    backAward(id) {
      this.$http.post("rewardsfin", { id: id }).then(res => {
        if (res.data.code === "200") {
          this.Form1 = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //修改奖励表单验证
    amendsubmitForm(Form1,id) {
      this.$refs[Form1].validate(valid => {
        if (valid) {
          this.amendAward(id);
        } else {
          this.$message({
            showClose: true,
            message: "请将表单输入完整",
            type: "error"
          });
          return false;
        }
      });
    },
    //修改奖励
    amendAward(id) {
      this.$http
        .post("rewardsupda", {
          id: id,
          phone: this.Form1.phone,
          status: 0,
          describe: this.Form1.describe,
          money: this.Form1.money,
          date: this.Form1.date
        })
        .then(res => {
          if (res.data.code === "200") {
            this.allawardList();
            this.isamendAward = false;
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
          console.log(res);
        });
    },
    //取消修改
    cancelAward(){
      this.isamendAward = false;
    },
    //删除提示框
    alertDelete(id){
     this.$confirm('您确定要删除这条奖励吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAward(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //删除奖励
    deleteAward(id) {
      this.$http.post('rewardsdele',{id:id})
      .then( res =>{
        if ( res.data.code === '200') {
          this.allawardList();
          this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
        } else {
           this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
        }
      })
    },

    //重置表单
    resetAward(Form) {
      this.$refs[Form].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
</style>