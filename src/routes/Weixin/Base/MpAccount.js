import React from 'react';
import {
  Form,
  Card,
  Button,
  Divider,
  Popconfirm,
  Badge,
  Modal,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import { getUserId } from '../../../utils/global';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const TextArea = Input.TextArea;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 },
  },
};

@connect(({ mpAccount, loading }) => ({
  mpAccount,
  loading: loading.models.mpAccount,
}))
@Form.create()
export default class MpAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
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
      type: 'mpAccount/fetch',
      payload: Object.assign({}, { userId: this.state.userId }, params),
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
          type: 'mpAccount/save',
          payload: Object.assign({}, { userId: this.state.userId }, values),
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

  // 删除
  handlerDelete = id => {
    this.props.dispatch({
      type: 'mpAccount/remove',
      payload: Object.assign({}, { userId: this.state.userId }, { id }),
      callback: this.handleSubmitResult,
    });
  };

  render() {
    const { modalVisible, selectedRows } = this.state;
    const {
      form: { getFieldDecorator },
      mpAccount: { data },
      loading,
    } = this.props;
    const columns = [
      { title: '公众号名称', dataIndex: 'mpName', key: 'mpName' },
      { title: '微信号', dataIndex: 'mpWxName', key: 'wxId' },
      {
        title: '类型',
        dataIndex: 'mpType',
        key: 'mpType',
        render: (val, record) => (val === 'SUBSCRIPTION' ? '订阅号' : '服务号'),
      },
      { title: 'AppId', dataIndex: 'mpAppId', key: 'mpAppId' },
      {
        title: '认证状态',
        dataIndex: 'auth',
        key: 'auth',
        render: (val, record) =>
          val ? <Badge status="success" text="已认证" /> : <Badge status="error" text="未认证" />,
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
            <Divider type="vertical" />
            <Button size="small" onClick={() => this.handleAddOrEdit(record)}>
              查看管理员
            </Button>
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
                  创建公众账号
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
          width={800}
        >
          <Form>
            {getFieldDecorator('id')(<Input type="hidden" />)}
            <FormItem label="公众号名称" {...formItemLayout}>
              {getFieldDecorator('mpName', {
                rules: [{ required: true, message: '请填写公众号名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="公众号微信号" {...formItemLayout}>
              {getFieldDecorator('mpWxName', {
                rules: [{ required: true, message: '请填写公众号公众号微信号', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="公众号类型" {...formItemLayout}>
              {getFieldDecorator('mpType', {
                initialValue: 'SUBSCRIPTION',
              })(
                <RadioGroup>
                  <Radio value="SUBSCRIPTION">订阅号</Radio>
                  <Radio value="SERVICE">服务号</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="公众号TOKEN" {...formItemLayout}>
              {getFieldDecorator('mpToken', {
                initialValue: 'cdcsqx',
                rules: [
                  { required: true, message: '请填写公众号TOKEN', whitespace: true },
                  { min: 6, message: 'TOKEN长度最少6位' },
                ],
              })(<Input autoComplete="off" placeholder="允许自定义TOKEN" />)}
            </FormItem>
            <FormItem label="AppId" {...formItemLayout}>
              {getFieldDecorator('mpAppId', {
                rules: [{ required: true, message: '请填写公众号AppId', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="AppSecret" {...formItemLayout}>
              {getFieldDecorator('mpAppSecret', {
                rules: [{ required: true, message: '请填写公众号AppSecret', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="公众号邮箱:" {...formItemLayout}>
              {getFieldDecorator('mpEmail', {
                rules: [{ type: 'email', message: '请填写正确的邮箱' }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="原始ID:" {...formItemLayout}>
              {getFieldDecorator('mpOriginId', {
                rules: [{ required: true, message: '请填写公众号原始ID', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="是否认证" {...formItemLayout}>
              {getFieldDecorator('auth', {
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={true}>已认证</Radio>
                  <Radio value={false}>未认证</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="是否默认" {...formItemLayout}>
              {getFieldDecorator('selected', {
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </RadioGroup>
              )}
            </FormItem>
            <FormItem label="描述" {...formItemLayout}>
              {getFieldDecorator('mpDesc', {
                rules: [{ max: 250, message: '描述长度最大250个字符' }],
              })(<TextArea />)}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
