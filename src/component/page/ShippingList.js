import React from 'react';

import {  Row , Col , Table, Tag, Button , Select , Modal , Form , Input , InputNumber , } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import moment from "jalali-moment";
import axios from 'axios';
import {
  DeleteOutlined ,
  EditOutlined ,
  PlusOutlined,
} from '@ant-design/icons';



class ShippingList extends React.Component {

    state = {
      display:false,
      listdata : [],
      visible_delete:false ,
      visible_edit:false ,
      visible_add:false ,
      delete_shipping_id : '',
      edit_shipping_object:'',
    }

    handleOk = () => {
      this.setState({
        visible_delete : false ,
        visible_edit:false ,
        visible_add:false,
      })
    }

    showModalAddShipping = ()=> {
      this.setState({
        visible_add:true,
      })
    }

    onfinishadd = (values)=> {
      console.log(values)
      this.setState({display : true})
      const postdata = {
        "token": localStorage.getItem('token') ,
        "shipping_method":values.add_shipping_method ,
      } 
      axios.post(BASE_URL + `/shipping/create` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display : false ,
            visible_add:false,
          });
          alert("روش ارسال با موفقیت افزوده شد");
          this.componentDidMount();
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

    showModalEditShipping = (id) => {
      this.setState({visible_edit:true , display : true})
      const postdata = {
        "token": localStorage.getItem('token') ,
        "id":id ,
      } 
      axios.post(BASE_URL + `/shipping/find` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display : false ,
            edit_shipping_object : res.data.data ,
          });
          document.getElementById('edit-form-messages_shipping_method').value = res.data.data.shipping_method ;
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

    onfinishedit = (values) => {
      this.setState({display:true})
      if(values.shipping_method === undefined) {values.shipping_method = this.state.edit_shipping_object.shipping_method;}
      const postdata = {
        "token": localStorage.getItem('token') ,
        "id":this.state.edit_shipping_object.id ,
        "shipping_method":values.shipping_method ,
      }
      axios.post(BASE_URL + `/shipping/update` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display : false ,
            visible_edit : false ,
          });
          alert("روش با موفقیت ویرایش شد");
          this.componentDidMount()
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      }) 
    }


    showModaldeleteShipping = (id) => {
      this.setState({
        visible_delete : true ,
        delete_shipping_id : id ,
      })
    }

    deleteProduct = ()=> {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
        "id":this.state.delete_shipping_id ,
      }
      axios.post(BASE_URL + `/shipping/delete` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display : false ,
            visible_delete : false ,
          });
          alert("روش با موفقیت حذف شد");
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
      axios.post(BASE_URL + `/shipping/all` , postdata)
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
        title: 'شماره',
        dataIndex: 'id',
      },
      {
        title: 'نوع',
        dataIndex: 'shipping_method',
      },
      {
        title: 'حذف ',
        render: (text , row) =><span onClick={()=>this.showModaldeleteShipping(row.id)} className="title-table-link"><DeleteOutlined/></span>
      },
      {
        title: 'ویرایش ',
        render: (text , row) =><span onClick={()=>this.showModalEditShipping(row.id)} className="title-table-link"><EditOutlined/></span>
      },
    ];
    
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Col span={24}><Button onClick={this.showModalAddShipping} type="primary" icon={<PlusOutlined />}>روش ارسال جدید</Button></Col>
        <Table dataSource={this.state.listdata} columns={columns} />
        <Modal title="حذف" visible={this.state.visible_delete} onCancel={this.handleOk} onOk={this.deleteProduct} >
              آیا مایل به حذف متد {this.state.delete_shipping_id} هستید؟
        </Modal>
        <Modal title="ویرایش" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null}>
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishedit}>
              <Form.Item name={'shipping_method'} label="نوع ارسال" >
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                ذخیره
                </Button>
              </Form.Item>
          </Form> 
        </Modal>
        <Modal title="اضافه کردن" visible={this.state.visible_add} onCancel={this.handleOk} footer={null}>
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishadd}>
              <Form.Item name={'add_shipping_method'} label="نوع ارسال" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                ذخیره
                </Button>
              </Form.Item>
          </Form> 
        </Modal>
      </>
    );
  }
}

export default ShippingList;
