import Vue from 'vue'
import { Button, Loading, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, Dialog, Radio, MessageBox, Pagination, DatePicker, Option, Select, CheckboxGroup, Checkbox, TimePicker } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(Radio)
Vue.use(Pagination)
Vue.use(DatePicker)
Vue.use(Option)
Vue.use(Select)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(TimePicker)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$loading = Loading.service