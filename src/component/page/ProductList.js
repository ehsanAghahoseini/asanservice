import React from 'react';

import {  Row , Col , Table, Tag, Button , Select , Modal , Form , Input , InputNumber , } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import moment from "jalali-moment";
import axios from 'axios';
import {
  DeleteOutlined ,
  EditOutlined ,
} from '@ant-design/icons';



class ProductList extends React.Component {

    state = {
      display:false,
      listdata : [],
      visible_delete_modal:false ,
      visible_edit_modal:false ,
      delete_product_id : '',
      edit_product_object:'',
      shipping_list : [],
    }

    handleOk = () => {
      this.setState({
        visible_delete_modal:false,
        visible_edit_modal : false ,
      })
    }

    showModalEditProduct = () => {
      this.setState({visible_edit_modal : true,display:true})
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/shipping/all` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            shipping_list : res.data.data ,
          });
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

    onFinishEditProduct =(values)=> {
      this.setState({display:true})
      if(values.name === undefined) {values.name = this.state.edit_product_object.name;}
      if(values.price === undefined) {values.price = this.state.edit_product_object.price;}
      if(values.quantity === undefined) {values.quantity = this.state.edit_product_object.stock;}
      if(values.description === undefined) {values.description = this.state.edit_product_object.description;}
      if(values.shipping === undefined) {values.shipping = this.state.edit_product_object.shipping;}
      const postdata = {
        "token": localStorage.getItem('token') ,
        "name":values.name ,
        "stock":values.quantity ,
        "description":values.description ,
        "shipping":values.quantity ,
        "price":values.price ,
        "id":this.state.edit_product_object.id ,
      }
      axios.post(BASE_URL + `/product/update` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            visible_edit_modal:false,
          });
          alert("محصول ویرایش گردید")
          this.componentDidMount()
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })

    }

    showModaldeleteProduct = (id)=> {
      this.setState({
        delete_product_id:id,
        visible_delete_modal : true ,
      })
    }

    deleteProduct=()=> {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
        "id":this.state.delete_product_id,
      }
      axios.post(BASE_URL + `/product/delete` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            visible_delete_modal : false ,
          });
          alert("محصول با موفقیت حذف شد");
          this.componentDidMount()
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
      axios.post(BASE_URL + `/product/all` , postdata)
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
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const validateMessages = {
      required: '${label} الزامی میباشد',
    };
    const columns = [
 
      {
        title: 'نام محصول',
        dataIndex: 'name',
      },
      {
        title: 'تعداد',
        dataIndex: 'stock',
      },
      {
        title: 'قیمت',
        dataIndex: 'price',
      },
      {
        title: 'توضیح محصول',
        dataIndex: 'description',
      },
      {
        title: 'حذف محصول',
        render: (text , row) =><span onClick={()=>this.showModaldeleteProduct(row.id)} className="title-table-link"><DeleteOutlined/></span>
      },
      {
        title: 'ویرایش محصول',
        render: (text , row) =><span onClick={()=>this.showModalEditProduct()} className="title-table-link"><EditOutlined/></span>
      },

    ];
    
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Table dataSource={this.state.listdata} columns={columns} />
        <Modal title="حذف" visible={this.state.visible_delete_modal} onCancel={this.handleOk} onOk={this.deleteProduct} >
              آیا مایل به حذف محصول {this.state.delete_product_id} هستید؟
        </Modal>
        <Modal  width={700} title="ویرایش" visible={this.state.visible_edit_modal} onCancel={this.handleOk} footer={null} >
          <Form {...layout} name="add_serviceman" onFinish={this.onFinishEditProduct} validateMessages={validateMessages}>
              <Form.Item name={'name'} label="نام محصول" >
                <Input />
              </Form.Item>
              <Form.Item name={'price'} label="قیمت " rules={[{  type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'quantity'} label="تعداد" rules={[{  type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'description'} label="توضیح محصول" >
                <Input.TextArea />
              </Form.Item>
              <Form.Item name={'shipping'} label="نوع ارسال" >
                <Select>
                {this.state.shipping_list.map(item =>
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
        </Modal>  
      </>
    );
  }
}

export default ProductList;
