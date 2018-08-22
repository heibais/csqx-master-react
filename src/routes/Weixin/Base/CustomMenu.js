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
import {getUserId} from "../../../utils/global";

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
    }
  }

  componentDidMount() {

  }

  render() {
    const { modalVisible, selectedRows } = this.state;
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
      </PageHeaderLayout>
    );
  }
}
