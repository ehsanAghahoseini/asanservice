import React from 'react';

import {  Row , Col , Table, Select, Button , Descriptions , Modal , Form , Input , InputNumber , } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import moment from "jalali-moment";
import axios from 'axios';
import {
  DeleteOutlined ,
} from '@ant-design/icons';



class AddProduct extends React.Component {

    state = {
      display:false,
      listdata : [],
    }

    onFinishAddProduct =(values)=> {
      this.setState({display:true });
      const postdata = {
        "token": localStorage.getItem('token') ,
        "name":values.name ,
        "stock":values.quantity ,
        "description":values.description ,
        "shipping":values.shipping ,
        "price":values.price ,
      }
      console.log(postdata)
      axios.post(BASE_URL + `/product/create` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
          });
          alert(" محصول با موفقیت افزوده شد");
          return window.location.href = '/panel/productlist'
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }


    componentDidMount =()=> {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      console.log(postdata)
      axios.post(BASE_URL + `/shipping/all` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            listdata : res.data.data ,
          });
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

  render() {
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const validateMessages = {
      required: '${label} الزامی میباشد',
    };

    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };
    const { Option } = Select;
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <h1>افزودن محصول</h1>
            <Form {...layout} name="add_serviceman" onFinish={this.onFinishAddProduct} validateMessages={validateMessages}>
              <Form.Item name={'name'} label="نام محصول" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'price'} label="قیمت " rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'quantity'} label="تعداد" rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'description'} label="توضیح محصول" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Form.Item name={'shipping'} label="نوع ارسال" rules={[{ required: true }]}>
                <Select>
                  { this.state.listdata.map(item =>
                    <Select.Option value={item.id}>{item.shipping_method}</Select.Option>
                  )}  
                </Select>
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

export default AddProduct;
