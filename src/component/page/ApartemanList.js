import React from 'react';
import {
  PlusOutlined   ,
  UserOutlined ,
  PhoneOutlined,
  MobileOutlined,
  BankOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { Card , Button , Row , Col , Modal ,
   Form, Input , Descriptions , Tag ,InputNumber,
    Popconfirm , Collapse ,Select } from 'antd';
import Loader from '../widget/Loader';
import { Link} from 'react-router-dom';
import BASE_URL from '../../BASE_URL';
import axios from 'axios';
import { Map, Marker, TileLayer } from "react-leaflet";
import ShowContract from '../widget/ShowContract';
import moment from "jalali-moment";




class ApartemanList extends React.Component {

    state = {
      display:false,
      visible:false ,
      visible_edit:false,
      visible_contract : false ,
      listdata : [],
      detail_data : {},
      edit_data : {},
      aparteman_request_contract :"",
      tech_list : [],
    }

  handleOk = () => {
    this.setState({
      visible: false ,
      visible_edit:false ,
      visible_contract:false,
    })}


  showmodalcontract =(username)=>{
    this.setState({
      visible_contract:true ,
       display:true,
       aparteman_request_contract : username,
       });
    const postdata = {
      "token": localStorage.getItem('token') ,
    }
    axios.post(BASE_URL + `/technician/all` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          tech_list : res.data.data ,
          display:false,
        });
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  onfinishcontract = (values) => {
    this.setState({display:true });
    const postdata = {
      "token": localStorage.getItem('token') ,
      "user_id":this.state.aparteman_request_contract ,
      "technician_id":values.sel_tech ,
    }
    console.log(postdata)
    axios.post(BASE_URL + `/user/accept_contract` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          display:false,
          visible_contract:false,
        });
        alert("قرار داد با موفقیت افزوده شد");
        this.componentDidMount();
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }
  

  showModaldetail = (username) => {
    this.setState({visible:true , display:true });
    const postdata = {
      "token": localStorage.getItem('token') ,
      "username":username ,
    }
    axios.post(BASE_URL + `/user/detail` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          display:false,
          detail_data : res.data.data ,
        });
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  showmodaledit = (username) => {
    this.setState({visible_edit:true , display:true });
    const postdata = {
      "token": localStorage.getItem('token') ,
      "username":username ,
    }
    axios.post(BASE_URL + `/user/detail` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          display:false,
          edit_data : res.data.data ,
        });
        document.getElementById("edit-form-messages_apartment_name").value = this.state.edit_data.apartment_name;
        document.getElementById("edit-form-messages_firstname").value = this.state.edit_data.firstname;
        document.getElementById("edit-form-messages_lastname").value = this.state.edit_data.lastname;
        document.getElementById("edit-form-messages_door_type").value = this.state.edit_data.door_type;
        document.getElementById("edit-form-messages_address").value = this.state.edit_data.address;
        document.getElementById("edit-form-messages_capacity").value = this.state.edit_data.capacity;
        document.getElementById("edit-form-messages_stop").value = this.state.edit_data.stop;
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  onfinishedit = (values) => {
    this.setState({display:true});
    if(values.address === undefined) {values.address = this.state.edit_data.address;}
    if(values.apartment_name === undefined) {values.apartment_name = this.state.edit_data.apartment_name;}
    if(values.capacity === undefined) {values.capacity = this.state.edit_data.capacity;}
    if(values.door_type === undefined) {values.door_type = this.state.edit_data.door_type;}
    if(values.firstname === undefined) {values.firstname = this.state.edit_data.firstname;}
    if(values.lastname === undefined) {values.lastname = this.state.edit_data.lastname;}
    if(values.stop === undefined) {values.stop = this.state.edit_data.stop;}
    if(values.type === undefined) {values.type = this.state.edit_data.type;}
    const postdata = {
      "token": localStorage.getItem('token') ,
      "username":this.state.edit_data.username ,
      "firstname" : values.firstname,
      "lastname" : values.lastname,
      "door_type" :values.door_type,
      "stop" : values.stop,
      "capacity" : values.capacity,
      "type" : values.type,
      "address" : values.address,
      "apartment_name" : values.apartment_name,
    }
    axios.post(BASE_URL + `/user/update` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({ display:false,visible_edit:false});
        this.componentDidMount();
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }


  changestate = (username , active) => {
    this.setState({display:true});
    if (active == false) {
      var urlrequest = BASE_URL + `/user/activate_user` ;
    }
    else if (active == true) {
      var urlrequest = BASE_URL + `/user/deactivate_user` ;
    }
    const postdata = {
      "token": localStorage.getItem('token') ,
      "username":username ,
    }
    axios.post(urlrequest , postdata)
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
    axios.post(BASE_URL + `/user/all` , postdata)
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

    const validateMessages = { required: '${label} الزامی میباشد',};
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const { Panel } = Collapse;
    const { Option } = Select;
    return (
      <Row gutter={[12, {xs: 8, sm: 16, md: 24, lg: 18}]}>
        {this.state.display ? <Loader/> : null}
        <Col span={24}><Link to='/panel/aparteman_add'><Button type="primary" icon={<PlusOutlined />}>ساختمان جدید</Button></Link></Col>
        { this.state.listdata.map(item =>
        <Card className="card-aparteman" extra={
        <Popconfirm onConfirm={()=>this.changestate(item.username , item.is_active)}  title="آیا از تغییر وضعیت مطمئن هستید؟" okText="تایید" cancelText="لغو"  onCancel={()=>{}}>
          {item.is_active == true ?
            <Tag color="green">فعال</Tag> :
            <Tag color="red">غیرفعال</Tag> }
        </Popconfirm>
        }
        title={
          <h3>{item.apartment_name}</h3>
        }
        >
          <p><UserOutlined/> مدیریت :  {item.firstname}{item.lastname} </p>
          <p><PhoneOutlined/> موبایل : {item.username} </p>
          <p><MobileOutlined /> قرارداد : {[item.contract_status == 1 && <Tag color="blue" >درخواست قرارداد</Tag> , item.contract_status == 0 && <Tag color="red">ندارد</Tag> , item.contract_status == 2 && <Tag color="green">قرارداد دارد</Tag> ]} </p>
          <p><BankOutlined  /> آدرس : {item.address}  </p>
          <Row className="card-footer" justify="center">
            <Col span={12}><Button onClick={()=>this.showModaldetail(item.username)} className="card-footer-btn-2" type="primary" icon={<UserOutlined />}>مشاهده </Button></Col>
            <Col span={12}><Button onClick={()=>this.showmodaledit(item.username)} className="card-footer-btn-2" type="primary" icon={<EditOutlined />}> ویرایش</Button></Col>
          </Row>
        </Card>
        )}
        <Modal className="detail-modal" width={1000} title="جزئیات" visible={this.state.visible} onCancel={this.handleOk} footer={null} >
          <Descriptions bordered>
            <Descriptions.Item label="نام آپارتمان" span={1}>{this.state.detail_data.apartment_name}</Descriptions.Item>
            <Descriptions.Item label="نام کاربری" span={1}>{this.state.detail_data.username}</Descriptions.Item>
            <Descriptions.Item label="نام " span={1}>{this.state.detail_data.firstname}</Descriptions.Item>
            <Descriptions.Item label="فامیلی " span={1}>{this.state.detail_data.lastname}</Descriptions.Item>
            <Descriptions.Item label="مبلغ کیف پول " span={1}>{this.state.detail_data.wallet_amount}</Descriptions.Item>
            <Descriptions.Item label="ظرفیت" span={1}>{this.state.detail_data.capacity}</Descriptions.Item>
            <Descriptions.Item label="ایستگاه" span={1}>{this.state.detail_data.stop}</Descriptions.Item>
            <Descriptions.Item label="نوع درب " span={1}>{this.state.detail_data.door_type}</Descriptions.Item>
            <Descriptions.Item label="تاریخ" span={1}>{moment(this.state.detail_data.created_at).locale('fa').format("YYYY/M/D")}</Descriptions.Item>
            <Descriptions.Item label=" ادرس " span={3}>{this.state.detail_data.address}</Descriptions.Item>
            {/* <Descriptions.Item label=" نقشه " span={3}>
              <Map center={[this.state.detail_data.lat, this.state.detail_data.lng]} zoom={12}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker  position={[this.state.detail_data.lat, this.state.detail_data.lng]}>
                  </Marker>
               </Map>
            </Descriptions.Item> */}
          </Descriptions>
          {this.state.detail_data.contract_status == 2 ? 
              <Collapse >
              <Panel header="مشاهده قرارداد" key="1">
                <ShowContract contract={this.state.detail_data} />
              </Panel>
              </Collapse>
          :null}
        </Modal>
        <Modal className="edit-modal" width={1000} title="ویرایش" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishedit}>
            <Form.Item name='apartment_name' label="نام آپارتمان" >
              <Input />
            </Form.Item>
            <Form.Item name='firstname' label="نام مدیر" >
              <Input />
            </Form.Item>
            <Form.Item name='lastname' label=" نام خانوداگی مدیر" >
              <Input />
            </Form.Item>
            <Form.Item name='door_type' label="نوع درب" >
              <Input/>
            </Form.Item>
            <Form.Item name='capacity' label="ظرفیت " >
              <Input />
            </Form.Item>
            <Form.Item name='stop' label="تعداد ایستگاه" >
              <InputNumber />
            </Form.Item>
            <Form.Item name={'type'} label=" نوع کاربری" >
                <Select>
                  <Select.Option value="1">کاربری اول</Select.Option>
                  <Select.Option value="2">کاربری دوم</Select.Option>
                  <Select.Option value="3">کاربری سوم</Select.Option>
                </Select>
            </Form.Item>
            <Form.Item name='address' label="آدرس" >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              ذخیره
            </Button>
          </Form.Item>
          </Form>  
        </Modal>
        <Modal width={700} className="edit-modal" title="تایید قرارداد" visible={this.state.visible_contract} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishcontract} >
              <Form.Item name='sel_tech' label="انتخاب تکنسین" rules={[{ required: true }]}>
                <Select
                    showSearch
                    style={{ width: 200 }}
                    placeholder="یک کاربر انتخاب کنید"
                  >
                    {this.state.tech_list.map(item =>
                    <Option value={item.username}>{item.username} / {item.firstname} {item.laststname}</Option>
                    )}
                </Select>
              </Form.Item>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  ثبت قرارداد
                </Button>
              </Form.Item>
          </Form>      
        </Modal>
      </Row>
      
    );
  }
}

export default ApartemanList;
