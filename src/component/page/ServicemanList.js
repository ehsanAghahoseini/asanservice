import React from 'react';
import {
  PlusOutlined   ,
  UserOutlined ,
  PhoneOutlined,
  MobileOutlined,
  SendOutlined ,
  DeleteOutlined ,
  WechatOutlined,
  EditOutlined,
  CheckOutlined ,
} from '@ant-design/icons';
import Men from '../image/serviceman.png';
import { Card , Button , Row , Col , Modal ,
   Form, Input , Descriptions , Popconfirm ,
    Tag , Select , InputNumber , Collapse } from 'antd';
import { Link} from 'react-router-dom';
import Loader from '../widget/Loader';
import axios from 'axios';
import BASE_URL from '../../BASE_URL';
import moment from "jalali-moment";


class ServicemanList extends React.Component {

state = {
    display:false,
    visible_message:false ,
    visible_detail:false ,
    visible_delete:false ,
    visible_edit:false ,
    listdata : [],
    detail_data : {},
    delete_id : "",
    edit_data : {},
    message_data:[],
    message_recive_user :"",
    bills_list : [],
  }

handleOk = () => {this.setState({visible_message: false,visible_detail:false , visible_delete:false , visible_edit:false})}

showModalMessage = (username) => {
  this.setState({visible_message:true ,display:true , message_recive_user : username});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "technician_id":username ,
  }
  axios.post(BASE_URL + `/technician/technician_massages` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
        message_data : res.data.data ,
      });
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
}

sendmessage = values => {
  this.setState({display:true});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "technician_id":this.state.message_recive_user ,
    "message":values.message_body,
  }
  axios.post(BASE_URL + `/technician/send_massage` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
      });
      this.showModalMessage(this.state.message_recive_user);
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
};


ShowModelEdit = (username) => {
  this.setState({visible_edit:true , display:true});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "username":username ,
  }
  axios.post(BASE_URL + `/technician/find` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
        edit_data : res.data.data ,
      });
      document.getElementById("edit-form-messages_name").value = this.state.edit_data.name;
      document.getElementById("edit-form-messages_family").value = this.state.edit_data.family;
      document.getElementById("edit-form-messages_phone").value = this.state.edit_data.constant_phone;
      document.getElementById("edit-form-messages_address").value = this.state.edit_data.address;
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
}

onfinishedit =(values)=> {
  if(values.address === undefined) {values.address = this.state.edit_data.address;}
  if(values.family === undefined) {values.family = this.state.edit_data.family;}
  if(values.name === undefined) {values.name = this.state.edit_data.name;}
  if(values.phone === undefined) {values.phone = this.state.edit_data.constant_phone;}
  const postdata = {
    "token":localStorage.getItem("token"),
    "username":this.state.edit_data.username ,
    "name" : values.name,
    "family" :values.family,
    "address":values.address,
    "constant_phone":values.phone,
  }
  axios.post(BASE_URL + `/technician/update` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
        visible_edit:false ,
      });
      this.componentDidMount()
      // alert("yesss")
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
}

ShowModelDelete = (username) => {
  this.setState({visible_delete:true , delete_id:username });
}


delete_serviceman = () => {
  this.setState({ display:true});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "username":this.state.delete_id ,
  }
  axios.post(BASE_URL + `/technician/delete` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
        visible_delete:false ,
      });
      this.componentDidMount();
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
}


showModaldetail = (username) => {
  this.setState({visible_detail:true , display:true});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "username":username ,
  }
  axios.post(BASE_URL + `/technician/find` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false,
        detail_data : res.data.data ,
        bills_list : res.data.data.bills ,
      });
    }
    else if (res.data.error === 'unauthenticated'){
      localStorage.clear();
      return window.location.href = '/'
    }
  })
}



changestate = (username ) => {
  this.setState({display:true});
  const postdata = {
    "token": localStorage.getItem('token') ,
    "username":username ,
  }
  axios.post(BASE_URL + `/technician/activate` , postdata)
  .then((res) => {
    if(res.data.result === 'ok'){
      this.setState({
        display:false
      });
      this.componentDidMount();
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
    const { Panel } = Collapse;
    const validateMessages = { required: '${label} الزامی میباشد',};
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    return (
      <Row gutter={[12, {xs: 8, sm: 16, md: 24, lg: 18}]}>
        {this.state.display ? <Loader/> : null}
        <Col span={24}><Link to='/panel/serviceman_add'><Button type="primary" icon={<PlusOutlined />}>سرویس کار جدید</Button></Link></Col>
        { this.state.listdata.map(item =>
        <Card className="card-serviceman" extra={
          <Popconfirm onConfirm={()=>this.changestate(item.username )}   title="آیا از تغییر وضعیت مطمئن هستید؟" okText="تایید" cancelText="لغو"  onCancel={()=>{}}>
              {item.is_active == true ?
              <Tag color="green">فعال</Tag> :
              <Tag color="red">غیرفعال</Tag> }
          </Popconfirm>
          }
          title={
            <h4>{item.firstname} {item.laststname}</h4>
          }
          >
          {item.profile === null ?  
            <img src={Men} alt="profile"></img> :
            <img src={`http://downloadforever.ir/public/${item.profile}`}  alt="profile"></img>
          } 
          <p><PhoneOutlined/> موبایل : {item.username} </p>
          <p><MobileOutlined /> دسترسی : {item.is_available == true ? <Tag color="green">دردسترس</Tag> : <Tag color="red">غیر قابل دسترس</Tag>} </p>
          <Row className="card-footer" justify="center">
            <Col span={12}><Button onClick={()=>this.showModalMessage(item.username)} className="card-footer-btn-1" type="primary" icon={<WechatOutlined />}>گفتگو</Button></Col>
            <Col span={12}><Button onClick={()=>this.showModaldetail(item.username)} className="card-footer-btn-2" type="primary" icon={<UserOutlined />}> حساب</Button></Col>
            <Col span={12}><Button onClick={()=>this.ShowModelEdit(item.username)} className="card-footer-btn-3" type="primary" icon={<EditOutlined  />} danger>ویرایش </Button></Col>
            <Col span={12}><Button onClick={()=>this.ShowModelDelete(item.username)} className="card-footer-btn-2" type="primary" icon={<DeleteOutlined  />} danger>حذف </Button></Col>
          </Row>
        </Card>
        )}
        <Modal  width={700} title="گفتگو" visible={this.state.visible_message} onCancel={this.handleOk} footer={null} >
          <div className="show-message">
            { this.state.message_data.map(item =>
                <Row className="show-message-item">
                  <Col span={24}>
                  {item.is_admin == true ? 
                    <div className="show-message-item-init1">
                      {item.message} 
                      <CheckOutlined style={{marginRight:"15px"}}/>
                      {item.seen == true ? <CheckOutlined /> : null}
                    </div>
                  :
                    <div className="show-message-item-init2">{item.message}</div>
                  }
                  </Col>
                </Row>
            )}  
          </div>
          <div className="send-message">
            <Form name="add_message" onFinish={this.sendmessage} validateMessages={validateMessages}>
              <Form.Item name={'message_body'}  rules={[{ required: true , message:"متن پیام الزامی میباشد"}]} >
                <Input placeholder="متن پیام ..." suffix={<Button className="btn-send-message" htmlType="submit" className="site-form-item-icon" ><SendOutlined /></Button>} />
              </Form.Item>
            </Form>  
          </div>
        </Modal>
        <Modal  width={1000} title="جزئیات" visible={this.state.visible_detail} onCancel={this.handleOk} footer={null} >
          <Descriptions bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
            <Descriptions.Item label="نام کاربری" span={1}>{this.state.detail_data.username}</Descriptions.Item>
            <Descriptions.Item label="نام " span={1}>{this.state.detail_data.name}</Descriptions.Item>
            <Descriptions.Item label=" نام خانوادگی" span={1}>{this.state.detail_data.family}</Descriptions.Item>
            <Descriptions.Item label="وضعیت فعال بودن" span={1}>{this.state.detail_data.is_active == true ? <span>فعال </span> : <span> غیرفعال</span>}</Descriptions.Item>
            <Descriptions.Item label="وضعیت دسترسی" span={1}>{this.state.detail_data.is_available == true ? <span>دردسترس </span> : <span> غیردسترس</span>}</Descriptions.Item>
            <Descriptions.Item label="سطح " span={1}>{this.state.detail_data.level}</Descriptions.Item>
            <Descriptions.Item label="امتیاز ادمین " span={1}>{this.state.detail_data.rate_admin}</Descriptions.Item>
            <Descriptions.Item label="امتیاز کاربر " span={1}>{this.state.detail_data.rate_users}</Descriptions.Item>
            <Descriptions.Item label="نام " span={1}>{this.state.detail_data.name}</Descriptions.Item>
            <Descriptions.Item label="تاریخ" span={1}>{moment(this.state.detail_data.created_at).locale('fa').format("YYYY/M/D")}</Descriptions.Item>
            <Descriptions.Item label="موجودی بازاریابی " span={1}>{this.state.detail_data.amount_marketing}</Descriptions.Item>
            <Descriptions.Item label="موجودی حساب " span={1}>{this.state.detail_data.amount_account}</Descriptions.Item>
            <Descriptions.Item label="موجودی قابل دسترس " span={1}>{this.state.detail_data.amount_available}</Descriptions.Item>
            <Descriptions.Item label="آدرس" span={3}>{this.state.detail_data.address}</Descriptions.Item>
          </Descriptions>
          <Collapse >
            <Panel header="لیست پرداختی ها" key="2">
                <Collapse >
                  {this.state.bills_list.map(item =>
                  <Panel header={<> صورت حساب {moment(item.created_at).locale('fa').format("YYYY/M/D")}</>} key={item.id+5}>
                    <Descriptions bordered
                      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                      <Descriptions.Item label="علت پرداختی" span={1}>{[item.type == 0 && <span>پرداخت سرویس</span> ,item.type == 1 && <span> پاداش</span>,item.type == 2 && <span>کارمزد</span>,item.type == 3 && <span> تسویه حساب</span> ]  }</Descriptions.Item>
                      <Descriptions.Item label="عنوان " span={1}>{item.title}</Descriptions.Item>
                      <Descriptions.Item label="مبلغ (تومان) " span={1}>{item.amount}</Descriptions.Item>
                      <Descriptions.Item label="تاریخ " span={1}>{moment(item.created_at).locale('fa').format("YYYY/M/D")}</Descriptions.Item>
                      <Descriptions.Item label="توضیحات " span={3}>{item.description}</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                  )}
                </Collapse>
            </Panel>
          </Collapse>
        </Modal>
        <Modal title="حذف" visible={this.state.visible_delete} onCancel={this.handleOk} onOk={this.delete_serviceman} >
          آیا مایل به حذف کاربر {this.state.delete_id} هستید؟
        </Modal>
        <Modal width={1000} title="ویرایش" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishedit}>
              <Form.Item name={'name'} label="نام" >
                <Input />
              </Form.Item>
              <Form.Item name={'family'} label="نام خانوادگی">
                <Input />
              </Form.Item>
              <Form.Item name={'phone'} label="تلفن ثابت" >
                <InputNumber />
              </Form.Item>
               <Form.Item name={'address'} label="آدرس" >
                 <Input.TextArea />
               </Form.Item>
               <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                ذخیره
                </Button>
               </Form.Item>
          </Form> 
        </Modal>
      </Row>
      
    );
  }
}

export default ServicemanList;
