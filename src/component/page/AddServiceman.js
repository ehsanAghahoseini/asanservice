import React from 'react';
import Men from '../image/serviceman.png';
import { Card , Button , Row , Col , Form, Input, InputNumber,Upload } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import axios from 'axios';


class AddServiceman extends React.Component {

    state = {
      display:false,
      listdata : [],
      fileList : [],
    }



    onFinish = values => {
      this.setState({display:true})
      const bodyFormData = new FormData();
      bodyFormData.append('token', localStorage.getItem('token'));
      bodyFormData.append('username', values.mobile);
      bodyFormData.append('name', values.name);
      bodyFormData.append('family', values.family);
      bodyFormData.append('password', values.password);
      bodyFormData.append('constant_phone', values.phone);
      bodyFormData.append('national_id', values.national_code);
      bodyFormData.append('address', values.address);
      for(var i in this.state.fileList){
        bodyFormData.append("image",this.state.fileList[i].originFileObj );
      }
      axios.post(BASE_URL + `/technician/create` ,  bodyFormData , {headers: {"Content-type": "multipart/form-data"}})
      .then((res) => {
        if(res.data.result === 'ok'){ 
          this.setState({display:false });
          alert("تکنسین با موفقیت افزوده شد");
          return window.location.href = '/panel/serviceman_list';
        }
          else if (res.data.error === "unauthenticated") {
            this.setState({display:false});
            localStorage.clear(); 
            return window.location.href = '/';
          }
      })
    };

    onChange = ({ fileList: newFileList }) => {
      this.setState({fileList :newFileList});
    };
  
    onPreview = async file => {
      let src = file.url;
      if (!src) {
        src = await new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj);
          reader.onload = () => resolve(reader.result);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow.document.write(image.outerHTML);
    };
  
    dummyRequest = ({ file, onSuccess }) => {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    };

  render() {
    const validateMessages = {
      required: '${label} الزامی میباشد',
    };

    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };
    
    return (
      < >
        {this.state.display ? <Loader/> : null}
            <h1>افزودن سرویس کار</h1>
            <Form {...layout} name="add_serviceman" onFinish={this.onFinish} validateMessages={validateMessages}>
              <Form.Item name={'name'} label="نام" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'family'} label="نام خانوادگی" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'national_code'} label="کدملی " rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'phone'} label="تلفن ثابت" rules={[{ required: true }]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'mobile'} label="موبایل" extra="شماره موبایل بعنوان نام کاربری استفاده میشود" rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'password'} label="رمز عبور" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Row justify="end">
                <Col span={12}>
                    <Upload
                      accept=".png , .jpg , .jpeg"
                      listType="picture-card"
                      fileList={this.state.fileList}
                      onChange={this.onChange}
                      onPreview={this.onPreview}
                      customRequest={this.dummyRequest}
                      >
                      {this.state.fileList.length < 1 && '+ Upload'}
                    </Upload>
                </Col>
              </Row>
              <Form.Item name={'address'} label="آدرس" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  ثبت
                </Button>
              </Form.Item>
            </Form>

      </>
      
    );
  }
}

export default AddServiceman;
