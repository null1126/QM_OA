<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <!-- <img src="../assets/qunmai.png" alt=""> -->
        <span>成都群迈科技 OA 系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 菜单侧边栏 -->
      <el-aside width="200px">
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#009ACC"
          text-color="#000"
          active-text-color="#fff"
          router
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-custom"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/users">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>管理员信息</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/rights">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/itions">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工职位列表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-marketing"></i>
              <span>出勤信息</span>
            </template>
            <el-menu-item index="/clock">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工出勤列表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/chenks">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>下月打卡记录表</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/king">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工打卡记录表</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>员工薪资</span>
            </template>
            <el-menu-item index="/wages">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>薪资记录</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/award">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工奖励</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/punish">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工惩罚</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>请假条</span>
            </template>
            <el-menu-item index="/leave">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>员工请假记录</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/vacat">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>假期安排</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>项目管理</span>
            </template>
            <el-menu-item index="/proje">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>项目信息</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="6">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>后台报销</span>
            </template>
            <el-menu-item index="/apply">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>报销待审核</span>
              </template>
            </el-menu-item>
            <el-menu-item index="/notpass">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>审核未通过</span>
              </template>
            </el-menu-item>
            <el-menu-item index="pass">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>审核通过</span>
              </template>
            </el-menu-item>
            <el-menu-item index="cancel">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>取消报销</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="7">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>后台补贴</span>
            </template>
            <el-menu-item index="/subsidy">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>补贴内容</span>
              </template>
            </el-menu-item>
          </el-submenu>

          <el-submenu index="8">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="/addpost">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>添加职位</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      activePath: ""
    };
  },
  created() {
    this.activePath = this.$route.fullPath;
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 保存连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #364a62;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #009acc;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>