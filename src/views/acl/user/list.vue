<template>
  <div class="app-container">
    <!-- 头部 -->
    <el-form inline>
      <!-- 表单元素 行内表单-->
      <el-form-item style="margin-top: 20px">
        <el-input v-model="tempSearchObj.username" placeholder="用户名" />
      </el-form-item>
      <!-- 查询与清空的按钮 -->
      <el-button
        type="primary"
        icon="el-icon-search"
        style="margin-top: 20px"
        @click="search"
        >查询</el-button
      >
      <el-button type="default" style="margin-top: 20px" @click="resetSearch"
        >清空</el-button
      >
    </el-form>
    <!-- 按钮区域 -->
    <div style="margin-bottom: 20px">
      <!-- 添加与批量添加按钮 -->
      <el-button type="primary" @click="showAddUser">添加用户</el-button>
      <el-button
        type="danger"
        :disabled="selectedIds.length === 0"
        @click="revomveUsers"
        >批量删除</el-button
      >
    </div>

    <!-- table表格：展示用户信息的地方 -->
    <el-table
      v-loading="listLoading"
      border
      stripe
      :data="users"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column type="index" label="序号" width="80" align="center" />

      <el-table-column prop="username" label="用户名" width="150" />
      <el-table-column prop="nickName" label="用户昵称" />
      <el-table-column prop="roleName" label="权限列表" />

      <el-table-column prop="gmtCreate" label="创建时间" width="180" />
      <el-table-column prop="gmtModified" label="更新时间" width="180" />

      <el-table-column label="操作" width="230" align="center">
        <template slot-scope="{ row }">
          <HintButton
            type="info"
            size="mini"
            icon="el-icon-user-solid"
            title="分配角色"
            @click="showAssignRole(row)"
          />
          <HintButton
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
            @click="showUpdateUser(row)"
          />
          <!-- 删除确定框 -->
          <el-popconfirm
            :title="`确定删除 ${row.username} 吗?`"
            @onConfirm="removeUser(row.id)"
          >
            <HintButton
              slot="reference"
              style="margin-left: 10px"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[3, 10, 20]"
      style="padding: 20px 0; text-align: center"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
    <!-- 添加| 修改用户的对话框的结构 -->
    <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogUserVisible"
    >
      <el-form
        ref="userForm"
        :model="user"
        :rules="userRules"
        label-width="120px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username" />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName" />
        </el-form-item>
        <el-form-item v-if="!user.id" label="用户密码" prop="password">
          <el-input v-model="user.password" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="addOrUpdate"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 分配角色的对话框的结构 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogRoleVisible"
      :before-close="resetRoleData"
    >
      <el-form label-width="80px">
        <!-- 用户名文本框，默认不可用 -->
        <el-form-item label="用户名">
          <el-input disabled :value="user.username" />
        </el-form-item>

        <el-form-item label="角色列表">
          <!-- 全选框 -->
          <el-checkbox
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <!-- 复选框数据 -->
          <el-checkbox-group
            v-model="userRoleIds"
            @change="handleCheckedChange"
          >
            <!-- 遍历所有角色列表生成多个复选框 -->
            <el-checkbox
              v-for="role in allRoles"
              :key="role.id"
              :label="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer">
        <el-button :loading="loading" type="primary" @click="assignRole"
          >保存</el-button
        >
        <el-button @click="resetRoleData">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'AclUserList',

  data() {
    return {
      listLoading: false, // 是否显示列表加载的提示
      searchObj: {
        // 包含请求搜索条件数据的对象
        username: '',
      },
      tempSearchObj: {
        // 收集搜索条件输入的对象
        username: '',
      },
      selectedIds: [], // 所有选择的user的id的数组
      users: [], // 当前页的用户列表
      page: 1, // 当前页码
      limit: 3, // 每页数量
      total: 0, // 总数量
      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      userRules: {
        // 用户添加/修改表单的校验规则
        username: [
          { required: true, message: '用户名必须输入' },
          { min: 4, message: '用户名不能小于4位' },
        ],
        password: [{ required: true, validator: this.validatePassword }],
      },
      loading: false, // 是否正在提交请求中
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 只要有角色被选中就会选中，但只有全部勾选才能全选
      checkAll: false, // 是否全选
    }
  },

  // 发请求一般情况下，我们都是在mounted去发，但是也可以在created内部去发
  created() {
    this.getUsers()
  },

  methods: {
    // 获取分页列表
    async getUsers(page = 1) {
      // page默认是1，有新值用新的值
      this.page = page
      const { limit, searchObj } = this
      // 发请求前显示loading效果
      this.listLoading = true
      const result = await this.$API.user.getPageList(page, limit, searchObj)
      // 请求返回结果loading结束
      this.listLoading = false
      const { items, total } = result.data
      // 过滤掉超级管理员
      this.users = items.filter((item) => item.username !== 'admin')
      // 总数减1
      this.total = total - 1
      // 清空选择的user的id
      this.selectedIds = []
    },
    // 头部搜索按钮的回调，根据输入的内容进行搜索
    search() {
      // 浅拷贝放置数据较多，还没查看完用户重新输入文字导致后面的数据无法查看，不让两者互相影响，用一个新的变量进行接收
      this.searchObj = { ...this.tempSearchObj }
      this.getUsers()
    },

    // 清空输入后搜索
    resetSearch() {
      // 搜索对象清空
      this.searchObj = {
        username: '',
      }
      // 点击查询的对象清空
      // this.tempSearchObj = {
      //   username: '',
      // }
      // 重新获取用户数据
      this.getUsers()
    },

    // 显示添加用户的界面
    showAddUser() {
      // 清空解决数据回显问题
      this.user = {}
      // 让对话框显示
      this.dialogUserVisible = true
      // 发请求-移除该表单项的校验结果
      this.$nextTick(() => this.$refs.userForm.clearValidate())
    },

    // 删除所有选中的用户
    revomveUsers() {
      this.$confirm('确定删除吗?')
        .then(async () => {
          // 发请求删除
          await this.$API.user.removeUsers(this.selectedIds)
          // 提示删除成功
          this.$message.success('删除成功')
          this.getUsers()
        })
        .catch(() => {
          this.$message.info('取消删除')
        })
    },
    // 显示指定角色的界面
    showAssignRole(user) {
      this.user = user
      this.dialogRoleVisible = true
      this.getRoles()
    },

    // 全选勾选状态发生改变的监听
    handleCheckAllChange(value) {
      // value 当前勾选状态true/false
      // 如果当前全选, userRoleIds就是所有角色id的数组, 否则是空数组
      this.userRoleIds = value ? this.allRoles.map((item) => item.id) : []
      // 如果当前不是全选也不全不选时, 指定为false
      this.isIndeterminate = false
    },

    /*
    异步获取用户的角色列表
    */
    async getRoles() {
      const result = await this.$API.user.getRoles(this.user.id)
      console.log(result, 111111111111)
      const { allRolesList, assignRoles } = result.data
      this.allRoles = allRolesList
      this.userRoleIds = assignRoles.map((item) => item.id)

      this.checkAll = allRolesList.length === assignRoles.length
      this.isIndeterminate =
        assignRoles.length > 0 && assignRoles.length < allRolesList.length
    },

    /*
    角色列表选中项发生改变的监听
    */
    handleCheckedChange(value) {
      // 用户的角色ID的列表和全部角色列表
      const { userRoleIds, allRoles } = this
      // 当两者相等且长度大于0时默认全选
      this.checkAll =
        userRoleIds.length === allRoles.length && allRoles.length > 0
      // 当全部角色的数据大于用户且用户选中的大于0，则复选框为选中状态但不是全选
      this.isIndeterminate =
        userRoleIds.length > 0 && userRoleIds.length < allRoles.length
    },

    /*
    请求给用户进行角色授权
    */
    async assignRole() {
      const userId = this.user.id
      const roleIds = this.userRoleIds.join(',')
      this.loading = true
      const result = await this.$API.user.assignRoles(userId, roleIds)
      this.loading = false
      this.$message.success(result.message || '分配角色成功')
      // 清空数据，解决快速点击下一个时候出现数据回显，当前用户选中的角色在下一个用户那看到
      this.resetRoleData()

      // console.log(this.$store.getters.name, this.user)
      if (this.$store.getters.name === this.user.username) {
        window.location.reload()
      }
    },

    /*
    重置用户角色的数据
    */
    resetRoleData() {
      // 关闭对话框
      this.dialogRoleVisible = false
      this.allRoles = []
      this.userRoleIds = []
      this.isIndeterminate = false
      this.checkAll = false
    },

    /*
    自定义密码校验
    */
    validatePassword(rule, value, callback) {
      if (!value) {
        callback('密码必须输入')
      } else if (!value || value.length < 6) {
        callback('密码不能小于6位')
      } else {
        callback()
      }
    },

    /*
    列表选中状态发生改变的监听回调
    */
    handleSelectionChange(selection) {
      console.log(selection)
      // 收集的是最后选中的所有数据的用户名
      this.selectedIds = selection.map((item) => item.id)
      console.log(this.selectedIds)
    },

    /*
    显示更新用户的界面
    */
    showUpdateUser(user) {
      this.user = cloneDeep(user)
      this.dialogUserVisible = true
    },

    /*
    删除某个用户
    */
    async removeUser(id) {
      await this.$API.user.removeById(id)
      this.$message.success('删除成功')
      this.getUsers(this.users.length === 1 ? this.page - 1 : this.page)
    },

    /*
    处理pageSize发生改变的监听回调
    */
    handleSizeChange(pageSize) {
      this.limit = pageSize
      this.getUsers()
    },

    /*
    取消用户的保存或更新
    */
    cancel() {
      this.dialogUserVisible = false
      this.user = {}
    },

    /*
    保存或者更新用户
    */
    addOrUpdate() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          const { user } = this
          this.loading = true
          this.$API.user[user.id ? 'update' : 'add'](user).then((result) => {
            this.loading = false
            this.$message.success('保存成功!')
            this.getUsers(user.id ? this.page : 1)
            this.user = {}
            this.dialogUserVisible = false
          })
        }
      })
    },
  },
}
</script>
