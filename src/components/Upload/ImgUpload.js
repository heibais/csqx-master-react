import React from 'react';
import { Upload, Icon, Modal, message } from 'antd';

export default class ImgUpload extends React.Component {
  state = {
    previewVisible: false,
    imageUrl: '',
    fileList: [],
  };

  componentDidMount() {
    if (this.props.value) {
      this.setState({
        fileList: [
          {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: this.props.value,
          },
        ],
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.value && this.state.fileList.length === 0) ||
      (nextProps.value &&
        this.state.fileList[0].url &&
        this.state.fileList[0].url !== nextProps.value) ||
      (nextProps.value &&
        this.state.fileList[0].response &&
        this.state.fileList[0].response.msg !== nextProps.value)
    ) {
      this.setState({
        fileList: [
          {
            uid: -1,
            name: 'xxx.png',
            status: 'done',
            url: nextProps.value,
          },
        ],
      });
    } else if (!nextProps.value) {
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
    if (file.status === 'done') {
      this.setState({
        imageUrl: file.response.msg,
      });
      this.props.onChange(file.response);
    } else {
      this.setState({ fileList });
    }
  };

  render() {
    const { previewVisible, imageUrl, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon style={{ fontSize: '32px', color: '#999' }} type="plus" />
        <div className="ant-upload-text">上传</div>
      </div>
    );
    return (
      <div>
        <Upload
          action="/csqx/v1/sys/file"
          listType="picture-card"
          fileList={fileList}
          beforeUpload={this.handleBefore}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length > 0 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={imageUrl} />
        </Modal>
      </div>
    );
  }
}
