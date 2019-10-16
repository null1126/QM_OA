<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="name" clearable @clear="showSta(name)">
            <el-button slot="append" icon="el-icon-search" @click="showSta(name)"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true">添加员工用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="getStalist.data" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="性别" prop="sex">
          <template slot-scope="scope">
            <span>{{scope.row.sex=='0'?'男':'女'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号码" prop="phone"></el-table-column>
        <el-table-column label="职位" prop="zhiwei"></el-table-column>
        <el-table-column label="员工号" prop="yid"></el-table-column>
        <el-table-column label="入职时间" prop="start"></el-table-column>
        <el-table-column label="基本工资" prop="money"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRightById(scope.row.id)"
            ></el-button>
            <el-button type="primary" size="mini" @click="retesDialog(scope.row.id)">重置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog title="修改员工信息" :visible.sync="editDialogVisible" width="50%">
      <el-form :model="showForm" label-width="90px">
        <el-form-item label="姓名">
          <el-input v-model="showForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="showForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="员工工号">
          <el-input
            v-model="showForm.yid"
            :disabled="true"
            onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
          ></el-input>
        </el-form-item>
        <el-form-item label="入职时间">
          <el-input v-model="showForm.start" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位">
          <template>
            <el-select v-model="showForm.position_id" placeholder="请选择">
              <el-option
                v-for="item in getPolist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="基本工资">
          <el-input v-model="postMoney" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加对话框 -->
    <el-dialog title="添加员工" :visible.sync="addDialogVisible" width="50%">
      <el-form :model="addFotm" :rules="addFotmRules" ref="addFotmRef" label-width="100px">
        <el-form-item label="员工姓名" prop="name">
          <el-input v-model="addFotm.name"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="addFotm.phone"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position_id">
          <template>
            <el-select v-model="addFotm.position_id" placeholder="请选择">
              <el-option
                v-for="item in getPolist"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </template>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <template>
            <el-radio v-model="addFotm.sex" label="0">男</el-radio>
            <el-radio v-model="addFotm.sex" label="1">女</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="基本工资" prop="money">
          <el-input v-model="addFotm.money"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRight()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
var validateMobilePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('手机号不可为空'))
  } else {
    if (value !== '') {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的手机号码'))
      }
    }
    callback()
  }
}
export default {
  data() {
    return {
      getStalist: [],
      name: '',
      id: '',
      position_id: '',
      money: '',
      postMoney: '', //修改员工信息弹窗————上传到后台的基本工资
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      showForm: {},
      getPolist: [],
      addDialogVisible: false,
      addFotm: {
        name: '',
        phone: '',
        position_id: '',
        sex: '',
        money: ''
      },
      addFotmRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [{ required: true, message: '选择性别', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateMobilePhone }
        ],
        position_id: [
          { required: true, message: '请选择职位', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getStaList()
    this.getPoList()
  },
  methods: {
    // 获取列表数据
    async getStaList() {
      const { data: res } = await this.$http.get('staff')
      console.log(res)
      this.getStalist = res
    },
    // 搜索
    async showSta(name) {
      const { data: res } = await this.$http.post('staffsele/', { name: name })
      console.log(res)
      if (res.code !== '200') {
        return this.$message.error('查询数据失败！')
      }
      this.$message.success('查询数据成功！')
      this.getStalist = res
    },
    // 修改
    async showDialog(id) {
      const { data: res } = await this.$http.post('staffsele/', { id: id })
      console.log(res,'info')
      this.showForm = res.data[0]
      this.editDialogVisible = true
    },
    // 删除
    async removeRightById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该员工信息, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.post('staffdimission/', { id: id })
      if (res.code !== '200') {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getStaList()
    },
    async getPoList() {
      const { data: res } = await this.$http.get('position')
      this.getPolist = res
      console.log(this.getPolist)
    },
    async showInfo() {
      let parmas = {
        id: this.showForm.id,
        position_id: this.showForm.position_id,
        money: this.postMoney,
        phone:this.showForm.phone
      }
      const { data: res } = await this.$http.post('staffupda', parmas)
      console.log(res)
      if (res.code !== '200') {
        return this.$message.error('修改失败！')
      }
      this.editDialogVisible = false
      this.getStaList()
      this.$message.success('修改成功！')
    },
    async addRight() {
      this.$refs.addFotmRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('staffinse', this.addFotm)
        if (res.code == '404') return this.$message.error(res.msg)
        this.addDialogVisible = false
        this.getStaList()
      })
    },
    async retesDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.post('staffreset/', { id: id })
      console.log(res)
      if (res.code == '404') {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    }
  }
}
</script>

<style lang="less" scoped>
</style>