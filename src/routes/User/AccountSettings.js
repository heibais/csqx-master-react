import React from 'react';
import { connect } from 'dva';
import { Input, Tabs, Icon, Form, Button, Card, Row, Col, Modal } from 'antd';
import ImgUpload from '../../components/Upload/ImgUpload';

import styles from './AccountSettings.less';

const TabPane = Tabs.TabPane;

@connect(({ account }) => ({
  account,
}))
class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileActiveKey: '2',
      emailActiveKey: '2',
      confirmDirty: false,
      type: '',
      modalVisible: false,
      count: 0,
    };
  }

  componentDidMount() {
    const { currentUser } = this.props;
    if (currentUser) {
      if (currentUser.email) {
        this.setState({ emailActiveKey: '1' });
      }
      if (currentUser.mobile) {
        this.setState({ mobileActiveKey: '1' });
      }
    }
  }

  onSubmit = () => {
    const { form, dispatch, currentUser } = this.props;
    form.validateFieldsAndScroll(['avatar', 'nickname'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'account/save',
          payload: Object.assign({}, { id: currentUser.id }, values),
          callback: this.fetchCurrent,
        });
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    const { confirmDirty } = this.state;
    this.setState({ confirmDirty: confirmDirty || !!value });
  };

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次密码输入不一致!');
    } else {
      callback();
    }
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    const { confirmDirty } = this.state;
    if (value && confirmDirty) {
      form.validateFields(['newPassword2'], { force: true });
    }
    if (value && value === form.getFieldValue('oldPassword')) {
      callback('新密码与旧密码不能一致!');
    } else {
      callback();
    }
  };

  onSubmitUpdatePwd = () => {
    const { form, dispatch, currentUser } = this.props;
    form.validateFieldsAndScroll(['oldPassword', 'newPassword'], (err, values) => {
      if (!err) {
        dispatch({
          type: 'account/changePwd',
          payload: Object.assign({}, values, { id: currentUser.id }),
          callback: this.handleCancel,
        });
      }
    });
  };

  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };

  fetchCurrent = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchCurrent',
    });
  };

  showModal = type => {
    this.setState({
      type,
      modalVisible: true,
    });
  };

  preMatchCaptcha = (mobileOrEmail, captcha) => {
    this.setState({ mobileActiveKey: '2' });
  };

  onGetCaptcha = () => {
    let count = 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  // 发送验证码
  sendCaptcha = (field, type) => {
    const { form } = this.props;
    form.validateFields([field], (err, values) => {
      if (!err) {
        const mobileOrEmail = values[type];
        // 判断发送邮件或短信
        if (type === 'email') {
          // 邮件
        } else {
          // 短信
        }
        this.onGetCaptcha();
      }
    });
  };

  render() {
    const {
      currentUser,
      form: { getFieldDecorator },
    } = this.props;
    const { mobileActiveKey, emailActiveKey, type, modalVisible, count } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };
    const changePwd = (
      <div>
        <Form.Item {...formItemLayout} label="旧密码" hasFeedback>
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: '输入你的旧密码!',
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="新密码" hasFeedback>
          {getFieldDecorator('newPassword', {
            rules: [
              { required: true, message: '输入你的密码!' },
              { type: 'string', min: 6, max: 20, message: '长度限制为6至20个之间!' },
              { validator: this.checkConfirm },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item {...formItemLayout} label="确认密码" hasFeedback>
          {getFieldDecorator('newPassword2', {
            rules: [
              { required: true, message: '输入你的确认密码!' },
              { type: 'string', min: 6, max: 20, message: '长度限制为6至20个之间!' },
              { validator: this.checkPassword },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" onClick={this.onSubmitUpdatePwd}>
            确认
          </Button>
        </Form.Item>
      </div>
    );

    const bindMobile = (
      <div>
        <Tabs activeKey={mobileActiveKey} tabBarStyle={{ display: 'none' }}>
          <TabPane tab="Tab 1" key="1">
            <Form.Item {...formItemLayout} label="原始手机号">
              {getFieldDecorator('originMobile', {
                rules: [
                  { required: true, message: '输入你的手机号!' },
                  { pattern: '^1\\d{10}$', message: '手机号格式错误!' },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="验证码">
              <Input.Group>
                <Col span={15}>
                  {getFieldDecorator('originCaptcha', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(<Input placeholder="验证码" />)}
                </Col>
                <Col span={9}>
                  <Button type="primary" className="captcha-btn">
                    获取验证码
                  </Button>
                </Col>
              </Input.Group>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                onClick={() => this.preMatchCaptcha('originMobile', 'originCaptcha')}
              >
                下一步
              </Button>
            </Form.Item>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <Form.Item {...formItemLayout} label="新手机号">
              {getFieldDecorator('newMobile', {
                rules: [
                  { required: true, message: '输入你的手机号!' },
                  { pattern: '^1\\d{10}$', message: '手机号格式错误!' },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="验证码">
              <Input.Group>
                <Col span={15}>
                  {getFieldDecorator('newCaptcha', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(<Input placeholder="验证码" />)}
                </Col>
                <Col span={9}>
                  <Button type="primary" className="captcha-btn">
                    获取验证码
                  </Button>
                </Col>
              </Input.Group>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={() => this.onSubmitReset('mobile')}>
                确认
              </Button>
            </Form.Item>
          </TabPane>
        </Tabs>
      </div>
    );

    const bindEmail = (
      <div>
        <Tabs activeKey={emailActiveKey} tabBarStyle={{ display: 'none' }}>
          <TabPane tab="Tab 1" key="1">
            <Form.Item {...formItemLayout} label="原始邮箱">
              {getFieldDecorator('originEmail', {
                rules: [
                  { required: true, message: '请输入你的邮箱!' },
                  { type: 'email', message: '邮箱格式错误!' },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="验证码">
              <Input.Group>
                <Row>
                  <Col span={15}>
                    {getFieldDecorator('originCaptcha', {
                      rules: [{ required: true, message: '请输入验证码!' }],
                    })(<Input placeholder="验证码" />)}
                  </Col>
                  <Col span={9}>
                    <Button type="primary" className="captcha-btn">
                      获取验证码
                    </Button>
                  </Col>
                </Row>
              </Input.Group>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                onClick={() => this.preMatchCaptcha('originEmail', 'originCaptcha')}
              >
                下一步
              </Button>
            </Form.Item>
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            <Form.Item {...formItemLayout} label="新邮箱">
              {getFieldDecorator('newEmail', {
                rules: [
                  { required: true, message: '请输入你的邮箱!' },
                  { type: 'email', message: '邮箱格式错误!' },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="验证码">
              <Row gutter={8}>
                <Col span={15}>
                  {getFieldDecorator('newCaptcha', {
                    rules: [{ required: true, message: '请输入验证码!' }],
                  })(<Input placeholder="验证码" />)}
                </Col>
                <Col span={9}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    className="captcha-btn"
                    disabled={count}
                    onClick={() => this.sendCaptcha('newEmail', 'email')}
                  >
                    {count ? `${count} s` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={() => this.onSubmitReset('email')}>
                确认
              </Button>
            </Form.Item>
          </TabPane>
        </Tabs>
      </div>
    );

    return (
      <div>
        <Tabs defaultActiveKey="1" tabPosition="left" className={styles.main}>
          <TabPane
            tab={
              <span>
                <Icon type="user" />个人信息
              </span>
            }
            key="1"
          >
            <Form.Item {...formItemLayout} label="头像">
              {getFieldDecorator('avatar', {
                initialValue: currentUser.avatar,
                getValueFromEvent: res => {
                  return res.msg;
                },
              })(<ImgUpload />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="昵称" hasFeedback>
              {getFieldDecorator('nickname', {
                initialValue: currentUser.nickname,
              })(<Input autoComplete="off" />)}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              <Button type="primary" onClick={() => this.onSubmit()}>
                保存
              </Button>
            </Form.Item>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="lock" />账户安全
              </span>
            }
            key="2"
          >
            <Card title="账户安全" bordered={false} bodyStyle={{ padding: 0 }}>
              <Row className={styles.rowStyle}>
                <Col span={2}>
                  <Icon type="check" className={styles.okIconStyle} />
                </Col>
                <Col span={3} style={{ fontSize: 16 }}>
                  登录密码
                </Col>
                <Col span={16} style={{ color: '#ff1d00', fontSize: 14 }}>
                  互联网账号存在被盗风险，建议您定期更改密码以保护账户安全。
                </Col>
                <Col span={3} style={{ textAlign: 'center' }}>
                  <a onClick={() => this.showModal('pwd')}>修改</a>
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={2}>
                  {currentUser.mobile ? (
                    <Icon type="check" className={styles.okIconStyle} />
                  ) : (
                    <Icon type="exclamation-circle-o" className={styles.failIconStyle} />
                  )}
                </Col>
                <Col span={3} style={{ fontSize: 16 }}>
                  手机验证
                </Col>
                <Col span={16} style={{ color: '#898989', fontSize: 14 }}>
                  <span>
                    {currentUser.mobile
                      ? `您验证的手机：${currentUser.mobile} 若已停用，请立即更换，避免账户被盗`
                      : `验证后，可用于快速找回登录密码，接收账户余额变动提醒。`}
                  </span>
                </Col>
                <Col span={3} style={{ textAlign: 'center' }}>
                  {currentUser.mobile ? (
                    <span>
                      <a href="javascript:;" onClick={() => this.showModal('bindMobile')}>
                        修改
                      </a>
                    </span>
                  ) : (
                    <Button onClick={() => this.showModal('bindMobile')}>手机验证</Button>
                  )}
                </Col>
              </Row>
              <Row className={styles.rowStyle}>
                <Col span={2}>
                  {currentUser.mobile ? (
                    <Icon type="check" className={styles.okIconStyle} />
                  ) : (
                    <Icon type="exclamation-circle-o" className={styles.failIconStyle} />
                  )}
                </Col>
                <Col span={3} style={{ fontSize: 16 }}>
                  邮箱验证
                </Col>
                <Col span={16} style={{ color: '#898989', fontSize: 14 }}>
                  <span>
                    {currentUser.email
                      ? `您验证的邮箱：${currentUser.email} 若已停用，请立即更换，避免账户被盗`
                      : `验证后，可用于快速找回登录密码，接收账户余额变动提醒。`}
                  </span>
                </Col>
                <Col span={3} style={{ textAlign: 'center' }}>
                  {currentUser.email ? (
                    <span>
                      <a href="javascript:;" onClick={() => this.showModal('bindEmail')}>
                        修改
                      </a>
                    </span>
                  ) : (
                    <Button onClick={() => this.showModal('bindEmail')}>邮箱验证</Button>
                  )}
                </Col>
              </Row>
            </Card>
          </TabPane>
          <TabPane
            tab={
              <span>
                <Icon type="lock" />会话管理
              </span>
            }
            key="3"
          >
            Content of tab 3
          </TabPane>
        </Tabs>
        <Modal
          // width={1000}
          title={
            <span>
              {type === 'pwd' && '密码修改'}
              {type === 'bindMobile' && '手机修改'}
              {type === 'bindEmail' && '邮箱修改'}
            </span>
          }
          visible={modalVisible}
          onCancel={this.handleCancel}
          footer={null}
        >
          {modalVisible && type === 'pwd' && changePwd}
          {modalVisible && type === 'bindMobile' && bindMobile}
          {modalVisible && type === 'bindEmail' && bindEmail}
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AccountSettings);
