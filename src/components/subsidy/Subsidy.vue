<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>后台补贴</el-breadcrumb-item>
      <el-breadcrumb-item>补贴内容</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-button size="mini" type="primary" @click="alterAdd ()">添加补贴</el-button>
      <!-- 管理员信息区域 -->
      <el-table height="500" :data="subsidyList" border stripe :v-loading="falg">
        <el-table-column header-align="center" align="center" label="id" type="index"></el-table-column>
        <el-table-column header-align="center" align="center" label="固定补贴项目名" prop="name"></el-table-column>
        <el-table-column header-align="center" align="center" label="补贴金额" prop="money">
          <template slot-scope="scope">{{ scope.row.money +' 元' }}</template>
        </el-table-column>
        <el-table-column header-align="center" align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="alterMend(scope.row.id)">修改补贴</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 点击添加按钮时显示的弹窗 -->
    <el-dialog title="添加报销" :visible.sync="isaddSub" width="50%">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="报销项目" prop="name">
          <el-input v-model="form.name"  placeholder="请输入报销项目"></el-input>
        </el-form-item>
        <el-form-item label="报销金额" prop="money">
          <el-input v-model="form.money" placeholder="请输入报销金额"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="verifyForm('form')">确认</el-button>
          <el-button type="warning" @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 点击修改按钮时显示的弹窗 -->
    <el-dialog title="修改报销" :visible.sync="isamendSub" width="50%">
      <el-form ref="form1" :rules="rules" :model="form1" label-width="80px">
        <el-form-item label="报销项目" prop="name">
          <el-input v-model="form1.name"></el-input>
        </el-form-item>
        <el-form-item label="报销金额" prop="money">
          <el-input v-model="form1.money"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="verifySub('form1',form1.id)">确认</el-button>
          <el-button type="warning" @click="cancel()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "Cancel",
  data() {
    return {
      subsidyList: [],
      isaddSub: false,
      isamendSub: false,
      falg: true,
      form: {
        name: "",
        money: ""
      },
      form1: {
        name: "",
        money: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入报销名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 8 个字符", trigger: "blur" }
        ],
        money: [
          { required: true, message: "请输入报销金额", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.allList();
  },
  methods: {
    //获取所有补贴信息
    allList() {
      this.$http.get("subsidysele").then(res => {
        if ((res.data.code = "200")) {
          this.subsidyList = res.data.data;
          this.falg = false;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //开启添加项目弹窗
    alterAdd() {
      this.isaddSub = true;
    },
    //添加报销项目
    addSub() {
      this.$http
        .post("subsidyinse", { name: this.form.name, money: this.form.money })
        .then(res => {
          if ((res.data.code = "200")) {
            this.isaddSub = false;
            this.allList();
            this.$message({
              showClose: true,
              message: "添加报销成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "添加报销失败",
              type: "error"
            });
          }
        });
    },
    //验证报销数据
    verifyForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addSub()
          } else {
             this.$message({
              showClose: true,
              message: "请输入正确的报销数据",
              type: "error"
            });
            return false;
          }
        });
      },
    //开启修改报销项目弹窗
    alterMend(id) {
      this.isamendSub = true;
      this.$http.post("subsidyfin", { id: id }).then(res => {
        if ((res.data.code = "200")) {
          this.form1 = res.data.data;
        } else {
          this.$message({
            showClose: true,
            message: "加载失败",
            type: "error"
          });
        }
      });
    },
    //修改报销项目
    amendSubsidy(id) {
      this.$http
        .post("subsidyupda", {
          id: id,
          name: this.form1.name,
          money: this.form1.money
        })
        .then(res => {
          if ((res.data.code = "200")) {
            this.isamendSub = false;
            this.allList();
            this.$message({
              showClose: true,
              message: "修改项目成功",
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: "修改项目失败",
              type: "error"
            });
          }
        });
    },
    //验证修改报销数据
    verifySub(formName,id) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.amendSubsidy(id)
          } else {
             this.$message({
              showClose: true,
              message: "请输入正确的报销金额",
              type: "error"
            });
            return false;
          }
        });
      },
    //取消弹窗
    cancel() {
      this.isaddSub = false;
      this.isamendSub = false;
    }
  }
};
</script>

<style scoped>
</style>