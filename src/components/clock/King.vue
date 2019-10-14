<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>出勤信息</el-breadcrumb-item>
      <el-breadcrumb-item>员工打卡记录表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="cloDialogVisible = true">开始上班补卡</el-button>
        </el-col>
      </el-row>
    </el-card>
    <!-- 开始上班补卡对话框 -->
    <el-dialog title="上班补卡" :visible.sync="cloDialogVisible" width="50%" @close="cloDialogClosed">
      <el-form :model="clockForm" :rules="clockFormRules" ref="clockFormRef" label-width="100px">
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="clockForm.phone"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="clockForm.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cloDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cloDia">确 定</el-button>
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
      cloDialogVisible: false,
      clockForm: {},
      clockFormRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validateMobilePhone }
        ],
        date: [
          {
            type: 'date',
            required: true,
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {},
  methods: {
    cloDialogClosed() {
      this.$refs.clockFormRef.resetFields()
    },
    cloDia() {
      this.$refs.clockFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'checkingclock1',
          this.clockForm
        )
        console.log(res)
        console.log(this.clockForm)
      })
    }
  }
}
</script>

<style lang="less" scoped>
</style>