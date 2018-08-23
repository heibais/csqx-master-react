import React from 'react';
import {
  Form,
  Card,
  Button,
  Divider,
  Popconfirm,
  Badge,
  Select,
  Modal,
  Input,
  Radio,
  Row,
  Col,
} from 'antd';
import { connect } from 'dva';
import StandardTable from '../../../components/StandardTable';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import {getUserId} from "../../../utils/global";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Search = Input.Search;
const TextArea = Input.TextArea;
const Option = Select.Option;

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
      selectedRows: [],
      modalVisible: false,
      isAdd: false,
      defaultMenuType: 1,
    }
  }

  componentDidMount() {

  }

  handleModalVisible = flag => {
    this.setState({ modalVisible: flag });
  };

  // 点击编辑或者新增按钮
  handleAddOrEdit = record => {
    const {form: { setFieldsValue, resetFields }} = this.props;
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

  render() {
    const { modalVisible, selectedRows, defaultMenuType } = this.state;
    const {
      form: { getFieldDecorator },
      customMenu: { data },
      loading,
    } = this.props;
    const columns = [
      { title: '微信菜单名称 ', dataIndex: 'menuName', key: 'menuName' },
      { title: '微信菜单类型', dataIndex: 'menuType', key: 'menuType' },
      { title: '微信菜单位置', dataIndex: 'menuPosition', key: 'menuPosition' },
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
                  创建公众账号
                </Button>
              </Col>
              <Col span={4} />
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
            <FormItem label="菜单名称" {...formItemLayout}>
              {getFieldDecorator('menuName', {
                rules: [{ required: true, message: '请填写菜单名称', whitespace: true }],
              })(<Input autoComplete="off" />)}
            </FormItem>
            <FormItem label="菜单类型" {...formItemLayout}>
              {getFieldDecorator('menuType', {
                initialValue: defaultMenuType,
              })(
                <Select onChange={(value) => this.setState({defaultMenuType: value})}>
                  <Option value={1}>消息触发类</Option>
                  <Option value={2}>网页链接类</Option>
                  <Option value={3}>小程序类</Option>
                </Select>
              )}
            </FormItem>
            {defaultMenuType === 1 &&
              <div>
                <FormItem label="消息类型" {...formItemLayout}>
                  {getFieldDecorator('messageType', {
                    rules: [{required: true, message: '请填写菜单类型', whitespace: true}],
                    initialValue: 2,
                  })(
                    <RadioGroup>
                      <Radio value={1}>文本</Radio>
                      <Radio value={2}>图文</Radio>
                      <Radio value={3}>音频</Radio>
                      <Radio value={4}>视频</Radio>
                      <Radio value={5}>图片</Radio>
                      <Radio value={6}>扩展</Radio>
                      <Radio value={7}>链接</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem label="选择模板" {...formItemLayout}>
                  {getFieldDecorator('menuTemplate', {
                    rules: [{ required: true, message: '请填写菜单类型', whitespace: true }],
                  })(<Input autoComplete="off" />)}
                </FormItem>
              </div>
            }
            {defaultMenuType === 2 &&
              <FormItem label="URL" {...formItemLayout}>
                {getFieldDecorator('URL', {
                  rules: [
                    { required: true, message: '请填写URL地址', whitespace: true },
                    { type: true, message: '请填写正确URL地址' },
                  ],
                })(<Input autoComplete="off" />)}
              </FormItem>
            }
            {defaultMenuType === 3 &&
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
            <FormItem label="位置" {...formItemLayout}>
              {getFieldDecorator('menuPosition', {
                initialValue: true,
              })(
                <RadioGroup>
                  <Radio value={true}>已认证</Radio>
                  <Radio value={false}>未认证</Radio>
                </RadioGroup>
              )}
            </FormItem>
          </Form>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
