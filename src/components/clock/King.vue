<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>出勤信息</el-breadcrumb-item>
      <el-breadcrumb-item>员工打卡记录表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card v-if="this.showOrHide">
      <el-row :gutter="0">
        <el-col :span="3">
          <el-button type="primary" @click="cloDialogVisible = true">开始上班补卡</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="clo1DialogVisible = true">开始午休补卡</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="clo2DialogVisible = true">结束午休补卡</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="clo3DialogVisible = true">下班补卡</el-button>
        </el-col>
      </el-row>
      <el-table :data="postCheclist.data" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="电话号码" prop="phone"></el-table-column>
        <el-table-column label="正常打卡次数" prop="normal"></el-table-column>
        <el-table-column label="缺卡次数" prop="lack"></el-table-column>
        <el-table-column label="请假次数" prop="leave"></el-table-column>
        <el-table-column label="未签到次数" prop="non-arrival"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showChe(scope.row.ygid)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 开始上班补卡对话框 -->
    <el-dialog title="上班补卡" :visible.sync="cloDialogVisible" width="30%" @close="cloDialogClosed">
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
    <!-- 开始午休补卡对话框 -->
    <el-dialog title="午休补卡" :visible.sync="clo1DialogVisible" width="30%" @close="clo1DialogClosed">
      <el-form :model="clock1Form" :rules="clock1FormRules" ref="clock1FormRef" label-width="100px">
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="clock1Form.phone"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="clock1Form.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clo1DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cloDia1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 结束午休补卡对话框 -->
    <el-dialog title="午休结束补卡" :visible.sync="clo2DialogVisible" width="30%" @close="clo2DialogClosed">
      <el-form :model="clock2Form" :rules="clock2FormRules" ref="clock2FormRef" label-width="100px">
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="clock2Form.phone"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="clock2Form.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clo2DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cloDia2">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 下班补卡对话框 -->
    <el-dialog title="下班补卡" :visible.sync="clo3DialogVisible" width="30%" @close="clo3DialogClosed">
      <el-form :model="clock3Form" :rules="clock3FormRules" ref="clock3FormRef" label-width="100px">
        <el-form-item label="电话号码" prop="phone">
          <el-input v-model="clock3Form.phone"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="date">
          <el-date-picker v-model="clock3Form.date" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clo3DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="cloDia3">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 获取详情的数据表格 -->
    <el-button @click="returnCard()" v-if="!this.showOrHide">返回</el-button>
    <el-table :data="chelist" border stripe v-if="!this.showOrHide" v-loading="loading">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="日期" prop="date"></el-table-column>
      <el-table-column label="状态" prop="status"></el-table-column>
      <el-table-column label="上班情况" prop="checking_status"></el-table-column>
      <el-table-column label="工作时长" prop="working_time"></el-table-column>
    </el-table>
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
      },
      clo1DialogVisible: false,
      clock1Form: {},
      clock1FormRules: {
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
      },
      clo2DialogVisible: false,
      clock2Form: {},
      clock2FormRules: {
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
      },
      clo3DialogVisible: false,
      clock3Form: {},
      clock3FormRules: {
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
      },
      postCheclist: [],
      // 获取详情数据列表
      chelist: [],
      loading: false,
      showOrHide: true
    }
  },
  created() {
    this.pstCkeck()
  },
  watch: {
    chelist: {
      immediate: false,
      handler: function() {
        if (this.chelist == '') {
          this.showOrHide = true
        } else {
          this.showOrHide = false
        }
      }
    }
  },
  methods: {
    cloDialogClosed() {
      this.$refs.clockFormRef.resetFields()
    },
    clo1DialogClosed() {
      this.$refs.clock1FormRef.resetFields()
    },
    clo2DialogClosed() {
      this.$refs.clock2FormRef.resetFields()
    },
    clo3DialogClosed() {
      this.$refs.clock3FormRef.resetFields()
    },
    cloDia() {
      this.$refs.clockFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'checkingclock1',
          this.clockForm
        )
        if(res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.cloDialogVisible = false
      })
    },
    cloDia1() {
      this.$refs.clock1FormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'checkingclock2',
          this.clock1Form
        )
        if(res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.clo1DialogVisible = false
      })
    },
    cloDia2() {
      this.$refs.clock2FormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'checkingclock3',
          this.clock2Form
        )
        if(res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.clo2DialogVisible = false
      })
    },
    cloDia3() {
      this.$refs.clock3FormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'checkingclock4',
          this.clock3Form
        )
        if(res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.clo3DialogVisible = false
      })
    },
    async pstCkeck() {
      const { data: res } = await this.$http.post('checkingsele')
      this.postCheclist = res
    },
    // 详情
    async showChe(ygid) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.8)'
      })
      await this.$http
        .post('checkingfin/', {
          ygid: ygid
        })
        .then(res => {
          this.chelist = res.data.data
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    returnCard() {
      this.showOrHide = true
      this.chelist = []
    }
  }
}
</script>

<style lang="less" scoped>
</style>