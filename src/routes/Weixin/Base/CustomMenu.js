import React from 'react';
import {
  Form,
  Card,
  Button,
  Divider,
  Popconfirm,
  Select,
  Modal,
  Input,
  Radio,
  Row,
  Col,
  InputNumber,
  Table,
  TreeSelect
} from 'antd';
import { connect } from 'dva';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getUserId, getEnums} from "../../../utils/global";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

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

@connect(({ customMenu, loading }) => ({
  customMenu,
  loading: loading.models.customMenu,
}))
@Form.create()
export default class MpAccount extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: getUserId(),
      enums: getEnums(),
      selectedRows: [],
      modalVisible: false,
      isAdd: false,
      defaultMenuType: 'CLICK',
      treeData: [{ label: '顶级菜单', value: '0', key: 0 }]
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = params => {
    this.props.dispatch({
      type: 'customMenu/fetch',
      payload: Object.assign({}, { userId: this.state.userId }, params),
    });
  };

  handleModalVisible = flag => {
    this.setState({ modalVisible: flag });
  };

  formatTreeSelect = () => {
    let { customMenu: {data} } = this.props;
    function format(data) {
      let treeData = [];
      data.map((item, index) => {
        let obj = {};
        obj['label'] = item.menuName;
        obj['value'] = item.id + '';
        obj['key'] = item.key;
        treeData[index] = obj;
      });
      return treeData;
    }
    let formatTreeData = format(data);
    formatTreeData.unshift(this.state.treeData[0]);
    this.setState({ treeData: formatTreeData });
  };

  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    const {form: { setFieldsValue, resetFields }} = this.props;
    this.formatTreeSelect();
    if (!record) {
      // 新增
      resetFields();
      this.setState({ isAdd: true });
    } else {
      // 编辑
      this.setState({isAdd: false, defaultMenuType: record.menuType }, () => {
        record.pid = record.pid.toString();
        setFieldsValue(record);
      });
    }
    this.handleModalVisible(true);
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'customMenu/save',
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

  // 删除
  handlerDelete = id => {
    this.props.dispatch({
      type: 'customMenu/remove',
      payload: Object.assign({}, { userId: this.state.userId }, { id }),
      callback: this.handleSubmitResult,
    });
  };

  // 同步到微信
  handlerAsync = () => {
    this.props.dispatch({
      type: 'customMenu/async2wx',
      payload: { userId: this.state.userId }
    });
  };

  render() {
    const { modalVisible, selectedRows, defaultMenuType, enums, treeData } = this.state;
    const {
      form: { getFieldDecorator },
      customMenu: { data },
      loading,
    } = this.props;
    const columns = [
      { title: '微信菜单名称 ', dataIndex: 'menuName', key: 'menuName' },
      {
        title: '微信菜单类型',
        dataIndex: 'menuType',
        key: 'menuType',
        render: (value) => {
          let result = "";
          enums['MpMenuTypeEnum'].forEach(item => {
            if (item.enumName === value) {
              result = item.enumDesc;
              return false;
            }
          });
          return result;
        }
      },
      { title: '排序', dataIndex: 'sort', key: 'sort' },
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
                  创建菜单
                </Button> &nbsp;&nbsp;
                <Button icon="to-top" type="default" onClick={() => this.handlerAsync()}>
                  菜单同步到微信
                </Button>
              </Col>
              <Col span={4} />
            </Row>
          </div>
          <Table
            loading={loading}
            dataSource={data}
            columns={columns}
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
            <FormItem label="菜单名称" {...formItemLayout}>
              {getFieldDecorator('menuName', {
                rules: [{ required: true, message: '请填写菜单名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem
              label="上级菜单"
              {...formItemLayout}
              extra="上级菜单（菜单位置）。一级菜单最多3个, 次级菜单最多5个"
            >
              {getFieldDecorator('pid', {
                rules: [{ required: true, message: '请选择菜单位置', whitespace: true }],
              })(<TreeSelect treeData={treeData} treeDefaultExpandAll />)}
            </FormItem>
            <FormItem label="菜单类型" {...formItemLayout}>
              {getFieldDecorator('menuType', {
                initialValue: defaultMenuType,
              })(
                <Select onChange={(value) => this.setState({defaultMenuType: value})}>
                  {enums['MpMenuTypeEnum'].map((item, index) => {
                    return <Option key={index} value={item.enumName}>{item.enumDesc}</Option>
                  })}
                </Select>
              )}
            </FormItem>
            {defaultMenuType === 'CLICK' &&
              <div>
                <FormItem label="消息类型" {...formItemLayout}>
                  {getFieldDecorator('messageType', {
                    rules: [{required: true, message: '请填写菜单类型', whitespace: true}],
                    initialValue: 'TEXT'
                  })(
                    <RadioGroup>
                      {enums['MpMessageTypeEnum'].map((item, index) => {
                        return <Radio key={index} value={item.enumName}>{item.enumDesc}</Radio>
                      })}
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="选择模板" {...formItemLayout}>
                  {getFieldDecorator('templateId', {
                    rules: [{ required: true, message: '请填写菜单类型', whitespace: true }],
                  })(<Input autoComplete="off" />)}
                </FormItem>
              </div>
            }
            {defaultMenuType === 'VIEW' &&
              <FormItem label="URL" {...formItemLayout}>
                {getFieldDecorator('url', {
                  rules: [
                    { required: true, message: '请填写URL地址', whitespace: true },
                    { type: 'url', message: '请填写正确URL地址' },
                  ],
                })(<Input autoComplete="off" />)}
              </FormItem>
            }
            {defaultMenuType === 'MINI_APP' &&
              <div>
                <FormItem label="小程序appId" {...formItemLayout}>
                  {getFieldDecorator('miniAppId', {
                    rules: [{ required: true, message: '请填写菜单类型', whitespace: true }],
                  })(<Input autoComplete="off" />)}
                </FormItem>
                <FormItem label="小程序页面路径" {...formItemLayout}>
                  {getFieldDecorator('miniPageUrl', {
                    rules: [{ required: true, message: '请填写菜单类型', whitespace: true }],
                  })(<Input autoComplete="off" />)}
                </FormItem>
              </div>
            }
            <FormItem
              label="排序"
              {...formItemLayout}
            >
              {getFieldDecorator('sort', {
                initialValue: 99,
              })(
                <InputNumber min={1} max={100} />
                )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
