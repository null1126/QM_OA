<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工薪资</el-breadcrumb-item>
      <el-breadcrumb-item>薪资记录</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <!-- 添加区域 -->
        <el-col :span="6">
          <el-button type="primary" size @click="showAddCateDialog">添加工资提成</el-button>
        </el-col>
        <!-- 薪资记录列表 -->
        <el-table :data="wagelist" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="基本工资" prop="basic"></el-table-column>
          <el-table-column label="项目提成" prop="pjtmoney"></el-table-column>
          <el-table-column label="报销记录" prop="bxmoney"></el-table-column>
          <el-table-column label="补贴记录" prop="btmoney"></el-table-column>
          <el-table-column label="奖励记录" prop="jlmoney"></el-table-column>
          <el-table-column label="惩罚记录" prop="cfmoney"></el-table-column>
          <el-table-column label="工作时间" prop="start"></el-table-column>
          <el-table-column label="工作时间" prop="end"></el-table-column>
          <el-table-column label="操作">
            <!-- <template slot-scope="scope"> -->
              <el-button type="primary" icon="el-icon-plus" size="mini" @click="showWage"></el-button>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- </template> -->
          </el-table-column>
        </el-table>
        <!-- 添加工资的对话框 -->
        <el-dialog
          title="添加提成"
          :visible.sync="addCateDialogVisible"
          width="50%"
          @close="addDialogClose"
        >
          <!-- 添加工资的表单 -->
          <el-form
            :model="addCateForm"
            :rules="addCateFormRules"
            ref="addCateFormRef"
            label-width="100px"
          >
            <el-form-item label="员工姓名" prop="name">
              <el-input v-model="addCateForm.name"></el-input>
            </el-form-item>
            <el-form-item label="项目名称" prop="pjtname">
              <el-input v-model="addCateForm.pjtname"></el-input>
            </el-form-item>
            <el-form-item label="工作开始时间" prop="start">
              <el-date-picker v-model="addCateForm.start" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="工作结束时间" prop="end">
              <el-date-picker v-model="addCateForm.end" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="项目资金" prop="pjtmoney">
              <el-input v-model="addCateForm.pjtmoney"></el-input>
            </el-form-item>
            <el-form-item label="项目备注" prop="pjtcont">
              <el-input type="textarea" v-model="addCateForm.pjtcont"></el-input>
            </el-form-item>
            <el-form-item label="报销资金" prop="bxmoney">
              <el-input v-model="addCateForm.bxmoney"></el-input>
            </el-form-item>
            <el-form-item label="补贴资金" prop="btmoney">
              <el-input v-model="addCateForm.btmoney"></el-input>
            </el-form-item>
            <el-form-item label="补贴备注" prop="btcont">
              <el-input type="textarea" v-model="addCateForm.btcont"></el-input>
            </el-form-item>
            <el-form-item label="奖励金" prop="jlmoney">
              <el-input v-model="addCateForm.jlmoney"></el-input>
            </el-form-item>
            <el-form-item label="奖励金备注" prop="jlcont">
              <el-input type="textarea" v-model="addCateForm.jlcont"></el-input>
            </el-form-item>
            <el-form-item label="惩罚金额" prop="cfmoney">
              <el-input v-model="addCateForm.cfmoney"></el-input>
            </el-form-item>
            <el-form-item label="惩罚备注" prop="cfcont">
              <el-input type="textarea" v-model="addCateForm.cfcont"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addWage">确 定</el-button>
          </span>
        </el-dialog>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      wagelist: [],
      // 控制添加工资对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加工资的表单数据
      addCateForm: {
        name: '',
        pjtmoney: '',
        bxmoney: '',
        btmoney: '',
        jlmoney: '',
        cfmoney: '',
        start: '',
        end: '',
        basic: ''
      },
      // 校验规则
      addCateFormRules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        pjtname: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        start: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        end: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
        pjtmoney: [
          { required: true, message: '请输入项目资金', trigger: 'blur' }
        ],
        bxmoney: [
          { required: true, message: '请输入报销资金', trigger: 'blur' }
        ],
        btmoney: [
          { required: true, message: '请输入补贴资金', trigger: 'blur' }
        ],
        jlmoney: [
          { required: true, message: '请输入奖励金额', trigger: 'blur' }
        ],
        cfmoney: [
          { required: true, message: '请输入惩罚金额', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getWageList()
  },
  methods: {
    async getWageList() {
      const { data: res } = await this.$http.get('wages')
      console.log(res)
      this.wagelist = res
    },
    // 点击按钮展示添加对话框
    showAddCateDialog() {
      this.addCateDialogVisible = true
    },
    addDialogClose() {
      this.$refs.addCateFormRef.resetFields()
    },
    addWage() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('wgdoadd')
        if (res.code !== '200') {
          this.$message.error('添加失败！')
        }
        this.$message.success('添加成功！')
        this.addCateDialogVisible = false
        this.getWageList()
      })
    },
    async showWage() {
      const { data: res } = await this.$http.post(
        'wgjiesuan' + this.addCateForm
      )
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-bottom: 15px !important;
}
</style>