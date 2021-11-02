import React from 'react';

import {  Row , Col , Table, Tag, Button , Descriptions , Modal , Form ,Select, Input , InputNumber , Popconfirm , Collapse} from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import moment from "jalali-moment";
import axios from 'axios';
import { DatePicker } from "jalali-react-datepicker";



class ContractList extends React.Component {

    state = {
      display:false,
      visible_contract:false,
      visible_detail:false,
      visible_edit:false,
      visible_add_service:false,
      visible_edit_arrive_time:false,
      id_service_time_edit : "",
      listdata : [],
      detail_data_tech : {},
      aparteman_request_contract :"",
      aparteman_edit_request_contract :"",
      tech_list : [],
      user_add_service : "",
      tech_add_service : "",
      detail_data_list_service:[],
    }

    handleOk = () =>{
      this.setState({
        visible_contract:false ,
        visible_detail:false ,
        visible_edit:false,
        visible_add_service:false,
        visible_edit_arrive_time :false ,
      })
    }

    EditTimeArrive = (id) => {
      this.setState({
        id_service_time_edit : id ,
        visible_edit_arrive_time:true,
      })
    }

    FinishEditTimeService = (val) => {
      this.setState({display:true})
      const time_arrive = moment(val.value._d,"YYYY-MM-DD").format("YYYY-M-D[T]HH:mm");
      const postdata = {
        "token": localStorage.getItem('token') ,
        "time_arrive":time_arrive,
        "id":this.state.id_service_time_edit,
      }
      console.log(postdata)
      axios.post(BASE_URL + `/user/update_service` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            visible_edit_arrive_time:false,
          });
          alert("زمان سرویس برای ساختمان مورد نظر ویرایش شد");
          this.componentDidMount();
          this.handleOk();
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

    ShowModalAddService = (user_id , tech_id)=>{
      this.setState({
        visible_add_service:true,
        user_add_service : user_id,
        tech_add_service:tech_id,
       });
    }

    FinishAddService = (val)=> {
      this.setState({display:true})
      const time_arrive = moment(val.value._d,"YYYY-MM-DD").format("YYYY-M-D[T]HH:mm");
      const postdata = {
        "token": localStorage.getItem('token') ,
        "user_id":this.state.user_add_service ,
        "technician_id":this.state.tech_add_service ,
        "time_arrive":time_arrive,
        "type":1
      }
      axios.post(BASE_URL + `/user/add_service` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            visible_add_service:false,
          });
          alert("زمان سرویس برای ساختمان مورد نظر افزوده شد");
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

    showModalEditContract =(username)=>{
      this.setState({
        visible_edit:true ,
         display:true,
         aparteman_edit_request_contract : username,
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

    onfinisheditcontract = (values) => {
      this.setState({display:true});
      console.log(values)
      const postdata = {
        "token": localStorage.getItem('token') ,
        "user_id":this.state.aparteman_edit_request_contract ,
        "technician_id":values.sel_tech ,
      }
      axios.post(BASE_URL + `/user/update_contract` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            display:false,
            visible_edit:false,
          });
          alert("تکنسین ویرایش شد");
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }



    showDetailModal = (username) => {
      this.setState({display:true , visible_detail : true});
      const postdata = {
        "token": localStorage.getItem('token') ,
        "username":username ,
      }
      axios.post(BASE_URL + `/user/list_service` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            detail_data_tech : res.data.data.technician ,
            detail_data_list_service : res.data.data.services ,
            display:false,
          });
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

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



    componentDidMount() {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/user/list_contract` , postdata)
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
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
    const { Option } = Select;
    
    const columns = [
      {
        title: 'نام آپارتمان ',
        dataIndex: 'firstname',
      },
      {
        title: 'مدیریت ',
        dataIndex: 'lastname',
      },
      {
        title: 'نام کاربری ',
        dataIndex: 'username',
      },
      {
        title: 'وضعیت قرارداد',
        render: (text , row) =>(
          <>
           {[row.contract_status == 1 && <Tag color="blue" onClick={()=>this.showmodalcontract(row.username)}>درخواست قرارداد</Tag> , row.contract_status == 0 && <Tag color="red">ندارد</Tag> , row.contract_status == 2 && <Tag color="green" onClick={()=>this.showDetailModal(row.username)}>قرارداد دارد-مشاهده سرویس</Tag> ] }
          </> 
      )},
      {
        title: 'ویرایش تکنسین',
        render: (text , row) =>(
          <>
           {row.contract_status == 2 ? <span onClick={()=>this.showModalEditContract(row.username)} className="title-table-link">ویرایش </span> : <span >تکنسین ندارد</span> }
          </> 
      )},
      {
        title: 'اضافه کردن زمان سرویس',
        render: (text , row) =>(
          <>
           {row.contract_status == 2 ? <span onClick={()=>this.ShowModalAddService(row.username , row.contract.technician_id)} className="title-table-link">افزودن </span> : <span >قرارداد ندارد</span> }
          </> 
      )},
    ]; 
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Table className="contract-table" dataSource={this.state.listdata} columns={columns} />
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
        <Modal width={1000} className="edit-modal" title="جزئیات" visible={this.state.visible_detail} onCancel={this.handleOk} footer={null} >
          <Descriptions bordered>
            <Descriptions.Item label="نام تکنسین" span={1}>{this.state.detail_data_tech.name} {this.state.detail_data_tech.family}</Descriptions.Item>
            <Descriptions.Item label="کاربری تکنسین" span={1}>{this.state.detail_data_tech.username} </Descriptions.Item>
          </Descriptions>
          <Collapse >
            {this.state.detail_data_list_service.map(item =>          
              <Panel header=" سرویس " key={item.id}>
                <Descriptions bordered>
                  {item.time_send != null ? <Descriptions.Item label=" زمان شروع " span={1}>{moment(item.time_send).locale('fa').format("YYYY/M/D")}</Descriptions.Item> :null}
                  {item.time_arrive != null ? <Descriptions.Item label=" زمان رسیدن به محل " span={1}>{moment(item.time_arrive).locale('fa').format("YYYY/M/D")} <Tag color="blue" onClick={()=>this.EditTimeArrive(item.id)}>ویرایش</Tag> </Descriptions.Item> :null}
                  {item.time_end != null ? <Descriptions.Item label=" زمان پایان " span={1}>{moment(item.time_end).locale('fa').format("YYYY/M/D")}</Descriptions.Item> :null}
                  {item.general.temp_time_technician != null ? <Descriptions.Item label=" تایم پیشنهاد تکنسین " span={1}>{item.general.temp_time_technician}</Descriptions.Item> :null}
                  {item.general.temp_time_user != null ? <Descriptions.Item label=" تایم پیشنهاد کاربر " span={1}>{item.general.temp_time_user}</Descriptions.Item> :null}
                  <Descriptions.Item label="وضعیت سرویس" span={1}>{[item.general.accept_status == 0 && <span>تایید ادمین</span> ,item.general.accept_status == 1 && <span> تکنسین در خواست تغییر زمان داد</span>,item.general.accept_status == 2 && <span>کاربر درخواست تغییر زمان داده</span>,item.type == 3 && <span>کاربر و تکنسین درخواست تغییر زمان داده</span> ]  }</Descriptions.Item> 
                </Descriptions>
              </Panel>
            )}  
          </Collapse>
        </Modal>
        <Modal width={700} className="edit-modal" title="ویرایش تکنسین" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinisheditcontract} >
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
                  ثبت 
                </Button>
              </Form.Item>
          </Form>      
        </Modal>
        <Modal width={700} className="edit-modal" title="افزودن سرویس" visible={this.state.visible_add_service} onCancel={this.handleOk} footer={null} >
          <p>لطفا زمان مناسب را برای سرویس انتخاب نمایید و تایید را بزنید.</p>
          <DatePicker onClickSubmitButton={(val)=> this.FinishAddService(val)} />
        </Modal>
        <Modal width={700} className="edit-modal" title="ویرایش زمان سرویس" visible={this.state.visible_edit_arrive_time} onCancel={this.handleOk} footer={null} >
          <p>لطفا زمان مناسب را برای سرویس انتخاب نمایید و تایید را بزنید.</p>
          <DatePicker onClickSubmitButton={(val)=> this.FinishEditTimeService(val)} />
        </Modal>
      </>
      
    );
  }
}

export default ContractList;
