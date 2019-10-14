<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
      <el-breadcrumb-item>项目信息</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加项目区域 -->
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="TselesDialogVisible = true">添加项目</el-button>
        </el-col>
      </el-row>
      <!-- 项目信息区域 -->
      <el-table :data="getTselelist.data" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="项目名" prop="name"></el-table-column>
        <el-table-column label="项目总金额" prop="total_money"></el-table-column>
        <el-table-column label="项目利润" prop="pure_profit"></el-table-column>
        <el-table-column label="项目预定完成时间" prop="scheduled_time"></el-table-column>
        <el-table-column label="项目开始时间" prop="start"></el-table-column>
        <el-table-column label="项目结束时间" prop="end"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span>{{scope.row.status==0?'未完成':scope.row.status==1?'已完成':'删除'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-more"
              size="mini"
              @click="infoDialog(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpdataDialog(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeDelerById(scope.row.id)"
              circle
            ></el-button>
            <el-button type="primary" size="mini" @click="removeTendById(scope.row.id)">完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加项目对话框 -->
    <el-dialog title="添加项目" :visible.sync="TselesDialogVisible" width="50%">
      <el-form ref="TinseFotmRef" :model="TinseForm" :rules="TinseFotmRules" label-width="120px">
        <el-form-item label="项目名" prop="name">
          <el-input v-model="TinseForm.name"></el-input>
        </el-form-item>
        <el-form-item label="项目总金额" prop="total_money">
          <el-input v-model="TinseForm.total_money"></el-input>
        </el-form-item>
        <el-form-item label="项目纯利润" prop="pure_profit">
          <el-input v-model="TinseForm.pure_profit"></el-input>
        </el-form-item>
        <el-form-item label="预定完成时间" prop="scheduled_time">
          <el-input v-model="TinseForm.scheduled_time"></el-input>
        </el-form-item>
        <el-form-item label="参与人员" prop="uid">
          <template>
            <el-checkbox-group v-model="TinseForm.uid">
              <el-checkbox
                :label="item.id"
                :value="item.id"
                v-for="item in getStalist.data"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="TselesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Tseles()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看项目详情对话框 -->
    <el-dialog title="项目详情" :visible.sync="TfinDialogVisible" width="50%">
      <el-form ref="formDataInfo" :model="formDataInfo" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="formDataInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="项目总金额">
          <el-input v-model="formDataInfo.total_money"></el-input>
        </el-form-item>
        <el-form-item label="项目利润">
          <el-input v-model="formDataInfo.pure_profit"></el-input>
        </el-form-item>
        <el-form-item label="预定完成时间">
          <el-input v-model="formDataInfo.scheduled_time"></el-input>
        </el-form-item>
        <el-form-item label="参与人员">
          <template>
            <el-checkbox-group v-model="formDataInfo.uid">
              <el-checkbox
                :label="item.id"
                :value="item.id"
                v-for="item in getStalist.data"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="项目开始时间">
          <el-input v-model="formDataInfo.start"></el-input>
        </el-form-item>
        <el-form-item label="项目结束时间">
          <el-input v-model="formDataInfo.end"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="formDataInfo.status"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="TfinDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改项目对话框 -->
    <el-dialog title="项目详情" :visible.sync="UpdaDialogVisible" width="50%">
      <el-form ref="formData" :model="formData" label-width="100px">
        <el-form-item label="项目名称">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="项目总金额">
          <el-input v-model="formData.total_money"></el-input>
        </el-form-item>
        <el-form-item label="项目利润">
          <el-input v-model="formData.pure_profit"></el-input>
        </el-form-item>
        <el-form-item label="预定完成时间">
          <el-input v-model="formData.scheduled_time"></el-input>
        </el-form-item>
        <el-form-item label="参与人员">
          <template>
            <el-checkbox-group v-model="formData.uid">
              <el-checkbox
                :label="item.id"
                :value="item.id"
                v-for="item in getStalist.data"
              >{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UpdaDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Upda()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      getTselelist: [],
      TselesDialogVisible: false,
      TinseForm: {
        name: '',
        total_money: '',
        pure_profit: '',
        scheduled_time: '',
        uid: []
      },
      getStalist: [],
      TinseFotmRules: {
        name: [{ required: true, message: '请输入项目名', trigger: 'blur' }],
        total_money: [
          { required: true, message: '请输入项目金额', trigger: 'blur' }
        ],
        pure_profit: [
          { required: true, message: '请输入项目利润', trigger: 'blur' }
        ],
        scheduled_time: [
          { required: true, message: '请输入预定完成时间', trigger: 'blur' }
        ],
        uid: [{ required: true, message: '请选择参与人员', trigger: 'blur' }]
      },
      formDataInfo: {},
      formData: {},
      TinseFotmRef: {},
      TfinDialogVisible: false,
      pstTilist: {},
      UpdaDialogVisible: false
    }
  },
  watch: {
    // TinseForm:{
    //     handler:function(val){
    //         console.log(this.TinseForm)
    //     },
    //     deep:true
    // }
  },
  created() {
    this.getTseleList()
    this.getStaList()
    this.postTifn()
  },
  methods: {
    // TfinDialogVisible = true
    infoDialog(id) {
      let jsonStr = JSON.stringify(this.getTselelist.data)
      let arr = JSON.parse(jsonStr)
      let result
      for (let j in arr) {
        if (arr[j].id == id) {
          let obj = arr[j].uid.split(',')
          let a = []
          for (let i in obj) {
            a.push(parseInt(obj[i]))
          }
          arr[j].uid = a
          result = arr[j]
        }
      }
      this.formDataInfo = result
      this.TfinDialogVisible = !this.TfinDialogVisible
    },
    showUpdataDialog(id) {
      let jsonStr = JSON.stringify(this.getTselelist.data)
      let arr = JSON.parse(jsonStr)
      let result
      for (let j in arr) {
        if (arr[j].id == id) {
          let obj = arr[j].uid.split(',')
          let a = []
          for (let i in obj) {
            a.push(parseInt(obj[i]))
          }
          arr[j].uid = a
          result = arr[j]
        }
      }
      this.formData = result
      this.UpdaDialogVisible = !this.UpdaDialogVisible
    },
    // 获取所有数据
    async getTseleList() {
      const { data: res } = await this.$http.get('projectsele')
      this.getTselelist = res
    },
    async getStaList() {
      const { data: res } = await this.$http.get('staff')
      console.log(res)
      this.getStalist = res
    },
    // 添加
    Tseles() {
      // 传参传这个this.TinseForm即可
      this.$refs.TinseFotmRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'projectinse',
          this.TinseForm
        )
        if (res.code !== '200') {
          return this.$message.error(res.msg)
        }
        this.$message.success(res.msg)
        this.TselesDialogVisible = false
        this.getTseleList()
      })
    },
    // 查看单个
    async postTifn() {
      const { data: res } = await this.$http.post('projectfin')
      console.log(res.data)
      this.pstTilist = res.data
    },
    // 修改
    async Upda() {
      const { data: res } = await this.$http.post('projectupda', this.formData)
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      }
      this.UpdaDialogVisible = false
      this.$message.success(res.msg)
      this.getTseleList()
    },
    async removeDelerById(id) {
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
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.post('projectdele/', { id: id })
      if (res.code !== '200') {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getTseleList()
    },
    async removeTendById(id) {
      const confirmResult = await this.$confirm(
        '此操作将确定项目完成, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消确定完成')
      }
      const { data: res } = await this.$http.post('projectend/', { id: id })
      if (res.code !== '200') {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
      this.getTseleList()
    }
  }
}
</script>

<style lang="stylus" scoped></style>