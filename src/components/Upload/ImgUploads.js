import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';

const Dragger = Upload.Dragger;

import styles from './Upload.less';

export default class ImgUploads extends React.Component {
  state = {
    previewVisible: false,
    imageUrl: '',
    fileList: [],
  };

  componentDidMount() {
    if (this.props.value) {
      const fileList = [];
      this.props.value.forEach((item, index) => {
        fileList.push({ uid: index, url: item, status: 'done' });
      });
      this.setState({ fileList });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.value || (nextProps.value && nextProps.value.length === 0)) {
      this.setState({
        fileList: [],
      });
    }
  }

  handleBefore = file => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error('图片上传限制为 1M');
    }
    return isLt1M;
  };

  handleCancel = () =>
    this.setState({
      previewVisible: false,
    });

  handlePreview = file => {
    this.setState({
      imageUrl: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  handleChange = ({ file, fileList }) => {
    this.setState({ fileList });
    if (file.status === 'done' || file.status === 'removed') {
      const imgUrls = [];
      fileList.forEach(item => {
        if (item.url && item.status !== 'removed') {
          imgUrls.push(item.url);
        } else if (item.response && !imgUrls.includes(item.response.msg)) {
          imgUrls.push(item.response.msg);
        }
      });
      this.props.onChange(imgUrls);
    }
  };

  render() {
    const { previewVisible, imageUrl, fileList } = this.state;
    return (
      <div className={styles.imgUploads}>
        <Dragger
          multiple={true}
          action="/hyb/v1/sys/file"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.handleBefore}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">单击或拖动文件到该区域上传</p>
          <p className="ant-upload-hint">支持单个或批量上传。严禁上传公司数据或其他敏感文件</p>
        </Dragger>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={imageUrl} />
        </Modal>
      </div>
    );
  }
}
