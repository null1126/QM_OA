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
        <el-table-column label="权限" prop="rname"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'可用':'禁用'}}</span>
          </template>
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
            <el-button type="primary" size="mini" @click="removeEditById(scope.row.id)">修改密码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="管理员名称" prop="user">
          <el-input v-model="addForm.user"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="pwd">
          <el-input v-model="addForm.pwd"></el-input>
        </el-form-item>
        <el-form-item label="管理员状态" prop="status">
          <template>
            <el-radio v-model="addForm.status" label="0">可用</el-radio>
            <el-radio v-model="addForm.status" label="1">禁用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="管理员权限" prop="rname">
          <template>
            <el-select v-model="addForm.rname" placeholder="请选择">
              <el-option
                v-for="item in getleslist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
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
        <el-form-item label="管理员名称" prop="user">
          <el-input v-model="editForm.user"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码">
          <el-input v-model="editForm.pwd" disabled></el-input>
        </el-form-item>
        <el-form-item label="管理员权限" prop="rid">
          <template>
            <el-select v-model="editForm.rid" placeholder="请选择">
              <el-option
                v-for="item in getleslist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="管理员状态" prop="status">
          <template>
            <el-radio-group v-model="editForm.status">
              <el-radio :label="0">可用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUaerInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码对话框 -->
    <el-dialog title="修改用户" :visible.sync="edit1DialogVisible" width="50%">
      <el-form :model="edit1Form" :rules="edit1FormRules" ref="edit1FormRef" label-width="100px">
        <el-form-item label="修改密码" prop="pwd">
          <el-input v-model="edit1Form.pwd"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="edit1DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="edit1Dia">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userlist: [],
      getleslist: [],
      // 控制对话框的显示与隐藏
      addDialogVisible: false,
      //   添加用户的表单区域
      addForm: {
        user: '',
        pwd: '',
        status: '',
        rname: ''
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
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        rname: [{ required: true, message: '请选择权限', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        user: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          {
            min: 3,
            max: 5,
            message: '管理员名称长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        rid: [{ required: true, message: '请选择权限', trigger: 'blur' }]
      },
      editFormRef: {},
      edit1DialogVisible: false,
      edit1Form: {},
      edit1FormRules: {
        pwd: [
          { required: true, message: '请输入管理员密码', trigger: 'blur' },
          {
            min: 6,
            max: 8,
            message: '管理员名称长度在 6 到 8 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.ptUserList()
    this.getLesList()
  },
  methods: {
    async ptUserList() {
      const { data: res } = await this.$http.get('admin')
      // res.forEach(element => {
      //   if (element.status == 0) {
      //     element.status = '可用'
      //   } else {
      //     element.status = '禁用'
      //   }
      // })
      this.userlist = res
    },
    addClosed() {
      this.$refs.addFormRef.resetFields()
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
      this.editForm = res.data
      this.editDialogVisible = true
    },
    async removeEditById(id) {
      const { data: res } = await this.$http.post('finpwd/', { id: id })
      this.edit1Form = res.data
      this.edit1DialogVisible = true
    },
    // 修改密码
    edit1Dia() {
      this.$refs.edit1FormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('updapwd', this.edit1Form)
        console.log(this.edit1Form)
        if (res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.edit1DialogVisible = false
        this.ptUserList()
        this.$message.success(res.msg)
      })
    },
    async getLesList() {
      const { data: res } = await this.$http.get('rolesele')
      this.getleslist = res.data
    },
    // 根据id删除用户信息
    async removeUserById(id) {
      const { data: res } = await this.$http.post('deluser/', { id: id })
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.ptUserList()
    },
    // 修改用户信息
    editUaerInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('doupd', this.editForm)
        if (res.code !== '200') {
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