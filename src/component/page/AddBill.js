import React from 'react';

import { Button , Row , Col , Form, Input, InputNumber,Select } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import axios from 'axios';



class AddBill extends React.Component {

    state = {
      display:false,
      listdata : [],
    }




    onFinish = values => {
      console.log(values);
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
        "technician_id" : values.user_id,
        "type" : values.type ,
        "title" : values.title,
        "description" : values.description,
        "amount" : values.amount,
      }
      axios.post(BASE_URL + `/technician/create_bill` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false
          });
          alert("صورت حساب افزوده شد");
          return window.location.href = '/panel/billlist'
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    

    }

    componentDidMount() {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/technician/all` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            listdata : res.data.data ,
            display:false
          });
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    
    }

  render() {

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
            <h1>افزودن  صورت حساب</h1>
            <Form {...layout} name="add_serviceman" onFinish={this.onFinish} validateMessages={validateMessages}>
              <Form.Item name='user_id' label="انتخاب کاربر" rules={[{ required: true }]}>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="یک کاربر انتخاب کنید"
                >
                  {this.state.listdata.map(item =>
                  <Option value={item.username}>{item.username} / {item.firstname} {item.laststname}</Option>
                  )}
                </Select>
              </Form.Item>
              <Form.Item name={'title'} label="عنوان" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'description'} label="توضیحات" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'type'} label=" نوع" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="0">پرداخت سرویس</Select.Option>
                  <Select.Option value="1">پاداش</Select.Option>
                  <Select.Option value="2">کارمزد</Select.Option>
                  <Select.Option value="3">تسویه حساب</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={'amount'} label="مبلغ (تومان) " rules={[{ required: true }]}>
                <InputNumber />
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

export default AddBill;
