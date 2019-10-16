<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>请假条</el-breadcrumb-item>
      <el-breadcrumb-item>员工请假待审核</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="getlealist.data" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="员工姓名" prop="name"></el-table-column>
        <el-table-column label="员工电话" prop="phone"></el-table-column>
        <el-table-column label="请假类型" prop="status">
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'请假':'调休'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假理由" prop="reason"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="Fusr(scope.row.id)">拒绝</el-button>
            <el-button type="primary" size="mini" @click="Agree(scope.row.id)">同意</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="拒绝申请" :visible.sync="FusesDialogVisible" width="50%" @close="fuesFormClosed">
      <el-form :model="fuesForm" :rules="fuesFormRules" ref="fuesFormRef" label-width="100px">
        <el-form-item label="拒绝理由" prop="audit_reason">
          <el-input v-model="fuesForm.audit_reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="FusesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="FusesDia()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getlealist: [],
      FusesDialogVisible: false,
      fuesForm: {},
      fuesFormRules: {
        audit_reason: [
          { required: true, message: '请输入拒绝请假理由', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getLeaList()
  },
  methods: {
    async getLeaList() {
      const { data: res } = await this.$http.get('applyaudit1')
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      }
      this.getlealist = res
    },
    fuesFormClosed() {
      this.$refs.fuesFormRef.resetFields()
    },
    async Fusr(id) {
      const { data: res } = await this.$http.post('applyfinid', { id: id })
      this.fuesForm = res.data
      this.FusesDialogVisible = true
    },
    // 拒绝
    async FusesDia() {
      const { data: res } = await this.$http.post('applyrefuse', this.fuesForm)
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      }
      this.FusesDialogVisible = false
      this.getlealist = res
      this.$message.success(res.msg)
    },
    async Agree(id) {
      const { data: res } = await this.$http.post('applyconsent',{id:id})
      if(res.code !== '200') {
        return this.$message.error(res.msg)
      }
      
      this.getlealist = res
    }
  }
}
</script>

<style lang="less" scoped>
</style>