<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>员工职位列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加用户区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="ItiDialogVisible = true">添加员工职位</el-button>
        </el-col>
      </el-row>
      <el-table :data="getPosilist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="职位名" prop="name"></el-table-column>
        <el-table-column label="项目提成" prop="commission">
          <template slot-scope="scope">
            <span>{{scope.row.commission==0?'无':'有'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目百分比" prop="percentage"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="shpufin(scope.row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="showFin(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加区域 -->
      <el-dialog title="添加职位" :visible.sync="ItiDialogVisible" width="50%" @close="ItiDialogClosed">
        <el-form :model="ltionForm" :rules="ltionFormRules" ref="ltionFormRef" label-width="100px">
          <el-form-item label="职位名" prop="name">
            <el-input v-model="ltionForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目提成" prop="commission">
            <template>
              <el-radio v-model="ltionForm.commission" label="0">无</el-radio>
              <el-radio v-model="ltionForm.commission" label="1">有</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="提成百分比" prop="percentage">
            <el-input v-model.number="ltionForm.percentage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="ItiDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="ItiDial">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改区域 -->
      <el-dialog title="修改职位" :visible.sync="FinDialogVisible" width="50%" @close="FinDialogClosed">
        <el-form :model="finForm" :rules="finFormRules" ref="finFormRef" label-width="100px">
          <el-form-item label="职位名">
            <el-input v-model="finForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目提成">
            <template>
              <el-radio v-model="finForm.commission" label="0">无</el-radio>
              <el-radio v-model="finForm.commission" label="1">有</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="项目百分比">
            <el-input v-model="finForm.percentage"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="FinDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="FinDia">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getPosilist: [],
      ItiDialogVisible: false,
      ltionForm: {
        name: '',
        commission: '',
        percentage: ''
      },
      // 添加表单验证规则
      ltionFormRules: {
        name: [{ required: true, message: '请输入职位名', trigger: 'blur' }],
        commission: [
          { required: true, message: '请选择有无项目提成', trigger: 'blur' }
        ],
        percentage: [
          { required: true, message: '请输入提成数', trigger: 'blur' },
          { type: 'number', message: '提成数必须为数字值' }
        ]
      },
      FinDialogVisible: false,
      finForm: {},
      finFormRules: {}
    }
  },
  created() {
    this.getPosList()
  },
  methods: {
    // 获取数据
    async getPosList() {
      const { data: res } = await this.$http.get('position')
      this.getPosilist = res
    },
    ItiDialogClosed() {
      this.$refs.ltionFormRef.resetFields()
    },
    FinDialogClosed() {
      this.$refs.finFormRef.resetFields()
    },
    // 添加
    ItiDial() {
      this.$refs.ltionFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'positioninse',
          this.ltionForm
        )
        if (res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.ItiDialogVisible = false
        this.getPosList()
      })
    },
    async shpufin(id) {
      const { data: res } = await this.$http.post('positionfin/', { id: id })
      console.log(res)
      if (res.code !== '200') {
        return this.$message.error('查询数据失败！')
      }
      this.finForm = res.data
      this.FinDialogVisible = true
    },
    FinDia() {
      this.$refs.finFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'positionupda',
          this.finForm
        )
        if (res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.FinDialogVisible = false
        this.getPosList()
        this.$message.success(res.msg)
      })
    },
    async showFin(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该职位, 是否继续?',
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
      const { data: res } = await this.$http.post('positiondele/', { id: id })
      if (res.code !== '200') {
        return this.$message.error('删除失败！')
      }
      this.$message.success('删除成功！')
      this.getPosList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>