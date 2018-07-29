import React from 'react';
import {
  Form,
  Card,
  Button,
  Divider,
  Switch,
  Popconfirm,
  Avatar,
  Modal,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import ImgUpload from '../../components/Upload/ImgUpload';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedRows: [],
      modalVisible: false,
      isAdd: false,
      searchValues: {},
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = params => {
    this.props.dispatch({
      type: 'account/fetch',
      payload: params,
    });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: flag });
  };

  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    const {
      form: { setFieldsValue, resetFields },
    } = this.props;
    if (!record) {
      // 新增
      resetFields();
      this.setState({ isAdd: true });
    } else {
      // 编辑
      record.password = '';
      setFieldsValue(record);
      this.setState({ isAdd: false });
    }
    this.handleModalVisible(true);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/save',
          payload: Object.assign({}, values),
          callback: this.handleSubmitResult,
        });
      }
    });
  };

  // 增删改成功后的处理
  handleSubmitResult = () => {
    this.handleModalVisible(false);
    this.fetchData();
  };

  // 删除
  handlerDelete = id => {
    this.props.dispatch({
      type: 'account/remove',
      payload: { id },
      callback: this.handleSubmitResult,
    });
  };

  handleChangeStatus = record => {
    this.props.dispatch({
      type: 'account/changeStatus',
      payload: { id: record.id },
      callback: this.handleSubmitResult,
    });
  };

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { searchValues } = this.state;

    const params = {
      current: pagination.current,
      size: pagination.pageSize,
      ...searchValues,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    this.fetchData(params);
  };

  handleSearch = (field, value) => {
    const { searchValues } = this.state;
    searchValues[field] = value;
    this.setState({ searchValues });
    this.fetchData(searchValues);
  };

  render() {
    const { modalVisible, selectedRows, isAdd } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const {
      account: { data },
      loading,
    } = this.props;
    const columns = [
      {
        title: '头像',
        dataIndex: 'avatar',
        key: 'avatar',
        render: val => (val ? <Avatar src={val} /> : <Avatar icon="user" />),
      },
      { title: '手机', dataIndex: 'mobile', key: 'mobile' },
      { title: '昵称', dataIndex: 'nickname', key: 'nickname' },
      { title: '邮箱', dataIndex: 'email', key: 'email' },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (val, record) => (
          <Switch checked={val} onChange={() => this.handleChangeStatus(record)} />
        ),
      },
      { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button size="small" onClick={() => this.handleAddOrEdit(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title="你确定要删除吗？" onConfirm={() => this.handlerDelete(record.id)}>
              <Button type="danger" size="small">
                删除
              </Button>
            </Popconfirm>
          </span>
        ),
      },
    ];
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div style={{ marginBottom: '20px' }}>
            <Row>
              <Col span={20}>
                <Button icon="plus" type="primary" onClick={() => this.handleAddOrEdit()}>
                  新建
                </Button>
              </Col>
              <Col span={4}>
                <Search
                  placeholder="请输入手机号码"
                  onSearch={value => this.handleSearch('mobile', value)}
                />
              </Col>
            </Row>
          </div>
          <StandardTable
            loading={loading}
            selectedRows={selectedRows}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>

        <Modal
          title="新增/编辑"
          visible={modalVisible}
          onCancel={() => this.handleModalVisible(false)}
          onOk={this.handleSubmit}
          confirmLoading={loading}
          width={600}
        >
          <Form>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <FormItem label="头像" {...formItemLayout}>
              {getFieldDecorator('avatar', {
                getValueFromEvent: res => {
                  return res.msg;
                },
              })(<ImgUpload />)}
            </FormItem>
            <FormItem label="昵称" {...formItemLayout}>
              {getFieldDecorator('nickname', {
                rules: [{ required: true, message: '请填写用户昵称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="手机" {...formItemLayout}>
              {getFieldDecorator('mobile', {
                rules: [
                  { pattern: /^1[0-9]{10}$/, message: '请填写正确的手机号码' },
                  { required: true, message: '请填写手机号码', whitespace: true },
                ],
              })(<Input autoComplete="off" />)}
            </FormItem>
            {isAdd ? (
              <FormItem label="密码" {...formItemLayout}>
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请填写用户密码', whitespace: true },
                    { min: 6, message: '密码长度最少6位' },
                  ],
                })(<Input type="password" />)}
              </FormItem>
            ) : (
              <FormItem label="密码" {...formItemLayout}>
                {getFieldDecorator('password')(<Input type="password" />)}
              </FormItem>
            )}
            <FormItem label="邮箱" {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [{ type: 'email', message: '请填写正确的邮箱' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="状态" {...formItemLayout}>
              {getFieldDecorator('status', {
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={true}>启用</Radio>
                  <Radio value={false}>禁用</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
