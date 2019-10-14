<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <!-- 添加用户区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" size @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 管理员信息区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="user"></el-table-column>
        <el-table-column label="密码" prop="pwd"></el-table-column>
        <el-table-column label="角色" prop="level"></el-table-column>
        <el-table-column label="状态" prop="status">
          <!-- <template slot-scope="scope">
            <el-switch v-model="scope.row.status"></el-switch>
          </template>-->
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="管理员名称" prop="user">
          <el-input v-model="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="pwd">
          <el-input v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态" prop="status">
          <el-input v-model="addForm.status"></el-input>
        </el-form-item>
        <el-form-item label="管理员等级" prop="level">
          <el-input v-model="addForm.level"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="管理员名称">
          <el-input v-if="editForm.admin" v-model="editForm.admin.user"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码">
          <el-input v-if="editForm.admin" v-model="editForm.admin.pwd"></el-input>
        </el-form-item>
        <el-form-item label="管理员角色">
          <el-input v-if="editForm.admin" v-model="editForm.admin.level"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态">
          <el-input v-if="editForm.admin" v-model="editForm.admin.status"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUaerInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      //   添加用户的表单区域
      addForm: {
        user: '',
        pwd: '',
        status: '',
        level: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        user: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '管理员名称长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        pwd: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          {
            min: 6,
            max: 8,
            message: '管理员名称长度在 6 到 8 个字符',
            trigger: 'blur'
          }
        ],
        level: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          {
            min: 0,
            max: 1,
            message: '管理员等级介于0或1个两个数字之间',
            trigger: 'blur'
          }
        ]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {},
      editFormRef: {}
    }
  },
  created() {
    this.ptUserList()
  },
  methods: {
    async ptUserList() {
      const { data: res } = await this.$http.get('admin')
      console.log(res)
      res.forEach(element => {
        if (element.level == 0) {
          element.level = '超级管理员'
        } else {
          element.level = '普通管理员'
        }
      })
      res.forEach(element => {
        if (element.status == 0) {
          element.status = '可用'
        } else {
          element.status = '禁用'
        }
      })
      this.userlist = res
    },
    // 添加用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('doadd', this.addForm)
        if (res.code !== '200') return this.$message.error('更新数据失败！')
        
        this.addDialogVisible = false
        this.ptUserList()
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.post('upduser/', { id: id })
      console.log(res)
      this.editForm = res
      this.editDialogVisible = true
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      console.log(id)
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('deluser/', { id: id })
      console.log(res)
      if (res.code !== '200') {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.ptUserList()
    },
    // 修改用户信息
    editUaerInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if(!valid) return
        const { data: res } = await this.$http.post('doupd' + this.addForm)
        console.log(res)

        if(res.code !== "200") {
          return this.$message.error('修改管理员信息失败！')
        }
        this.editDialogVisible = false
        this.ptUserList()
        this.$message.success('修改管理员信息成功！')
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>