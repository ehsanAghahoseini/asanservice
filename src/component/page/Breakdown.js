import React from 'react';

import {  Row , Collapse , Table, Tag, Button , Descriptions , Modal , Form , Input , InputNumber , Popconfirm} from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import { Map, Marker, TileLayer } from "react-leaflet";
import moment from "jalali-moment";
import axios from 'axios';

// Import For Redux
import {connect} from "react-redux";
import {BreakListDataAction} from '../../action/AddNotificationAction';



class Breakdown extends React.Component {

    state = {
      display:false,
      visible_detail:false,
      visible_edit:false,
      listdata : [],
      detail_data : {},
      detail_user : "",
      detail_payment : {},
      service_edit_id : "",
      order_list : [],
    }

  handleOk = () => {this.setState({visible_detail: false , visible_edit:false,})}


  showeditmodal(id) {
    this.setState({visible_edit:true , display:true });
    const postdata = {
      "token": localStorage.getItem('token') ,
      "id":id,
    }
    axios.post(BASE_URL + `/service/find` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          service_edit_id : id ,
          detail_payment : res.data.data.payment ,
          order_list : res.data.data.orders ,
          display:false
        });
        document.getElementById("edit-form-messages_price_pay").value = this.state.detail_payment.price;
        document.getElementById("edit-form-messages_description_pay").value = this.state.detail_payment.description;
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  onfinishedit= (values) => {
    this.setState({ display:true });
    if(values.description_pay === undefined) {values.description_pay = this.state.detail_payment.description;}
    if(values.price_pay === undefined) {values.price_pay = this.state.detail_payment.price;}
    const postdata = {
      "token": localStorage.getItem('token') ,
      "id":this.state.service_edit_id,
      "price":values.price_pay,
      "description":values.description_pay,
    }
    axios.post(BASE_URL + `/service/update_factor` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        this.setState({
          display:false,
          visible_edit:false,
        });
        this.componentDidMount();
      }
      else if (res.data.error === 'unauthenticated'){
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  acceptpayment(id){
    this.setState({ display:true });
    const postdata = {
      "token": localStorage.getItem('token') ,
      "id":id,
    }
    axios.post(BASE_URL + `/service/accept_factor` , postdata)
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

    showdetailmodal(id) {
      this.setState({visible_detail:true , display:true });
      const postdata = {
        "token": localStorage.getItem('token') ,
        "id":id,
      }
      axios.post(BASE_URL + `/service/find` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            detail_data : res.data.data ,
            detail_user : res.data.data.user ,
            detail_payment : res.data.data.payment ,
            display:false
          });
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
      axios.post(BASE_URL + `/service/active_list` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.props.BreakListDataAction(res.data.data);
          this.setState({display:false });
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    
    }

  render() {
    const { Panel } = Collapse;
    const layoutform = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    };
 
    const columns = [
      {
        title: ' مشاهده جزئیات',
        dataIndex: 'user_id',
        render: (text , row)  => <span className="title-table-link"  onClick={() => this.showdetailmodal(row.id)}>{text}</span>,
      },
      {
        title: 'نام ساختمان',
        render: (text , row)  => <span>{row.user.apartment_name}</span>,
      },
      {
        title: 'اهمیت',
        render: (row , text) =>(
          <>
           {[row.special.emergency_type === 0 && <Tag color="red">ضروری</Tag> , row.special.emergency_type === 1 && <Tag color="gold">متوسط</Tag> , row.special.emergency_type === 2 && <Tag color="green">عادی</Tag>]  }
          </> 
      )},
      {
        title: 'وضعیت',
        dataIndex: 'progress_status',
        render: text =>(
          <>
           {[text === 0 && <Tag color="red">در حال پیدا کردن</Tag> , text === 1 && <Tag color="gold">اعزام تکنسین</Tag> , text === 2 && <Tag color="blue">به محل رسیده</Tag> , text === 3 && <Tag color="green">پایان یافته</Tag>]  }
          </> 
      )},
      {
        title: 'نام تکنسین',
        render: (row , text) =>(
          <>
           {row.technician != null && <span>{row.technician.name} {row.technician.family}</span> }
          </> 
      )},
      {
        title: 'زمان تقریبی رسیدن',
        render: (row) =>(
          <>
           {[row.special.temp_time_arrive != null && row.special.temp_time_arrive == 0 && <Tag color="red">در حال پیدا کردن</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 1 && <Tag color="gold">اعزام تکنسین</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 2 && <Tag color="blue">به محل رسیده</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 3 && <Tag color="green">پایان یافته</Tag>]  }
          </> 
      )},
      {
        title: 'ویرایش',
        render: (text , row) =>(
          <>
           {[row.payment != null && row.payment.accept === false && <span className="title-table-link" onClick={()=>this.showeditmodal(row.id)}>ویرایش</span> , row.payment != null &&  row.payment.accept === true && <span className="title-table-link" onClick={()=>this.showeditmodal(row.id)}>ویرایش</span> , row.payment === null && <span >قابل ویرایش نیست</span>]  }
          </> 
      )},
      {
        title: 'تایید',
        render: (text , row) =>(
          <>
           {[row.payment === null && <Tag color="red">فاکتور ندارد</Tag> , row.payment != null &&  row.payment.accept === false && <Popconfirm onConfirm={()=>this.acceptpayment(row.id)}   title="آیا مایل به تایید فاکتور هستید؟" okText="تایید" cancelText="لغو"  onCancel={()=>{}}><Tag style={{cursor:'pointer'}} color="gold"> فاکتور تایید نشده</Tag></Popconfirm> , row.payment != null && row.payment.accept === true && <Tag color="green">تایید شده</Tag>]  }
          </> 
      )},
    ];
    
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Table dataSource={this.props.Displaylistdata} columns={columns} />
        <Modal className="detail-modal" width={1000} title="جزئیات" visible={this.state.visible_detail} onCancel={this.handleOk} footer={null} >
          <Descriptions bordered>
            <Descriptions.Item label="نام کاربری" span={1}>{this.state.detail_user.username}</Descriptions.Item>
            <Descriptions.Item label="نام آپارتمان" span={1}>{this.state.detail_user.apartment_name}</Descriptions.Item>
            <Descriptions.Item label="نام مدیریت" span={1}>{this.state.detail_user.firstname} {this.state.detail_user.lastname}</Descriptions.Item>
            <Descriptions.Item label=" وضعیت پرداخت مشتری" span={1}>{this.state.detail_data.is_paid == true ? <span>پرداخت شده</span> : <span>پرداخت نشده</span>}</Descriptions.Item>
            <Descriptions.Item label="زمان پذیرش" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_accept).locale('fa').format("YYYY/M/D"): <span>تنظیم نشده</span>}</Descriptions.Item>
            <Descriptions.Item label="زمان رسیدن به محل" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_arrive).locale('fa').format("YYYY/M/D"): <span>تنظیم نشده</span>}</Descriptions.Item>
            <Descriptions.Item label="زمان پایان" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_end).locale('fa').format("YYYY/M/D") : <span>تنظیم نشده</span>}</Descriptions.Item>
            <Descriptions.Item label="زمان ثبت خرابی" span={1}>{moment(this.state.detail_data.created_at).locale('fa').format("YYYY/M/D")}</Descriptions.Item>
            <Descriptions.Item label="وضعیت ساختمان" span={1}>{this.state.detail_user.is_active == true ? <span>فعال </span> : <span> غیرفعال</span>}</Descriptions.Item>
            <Descriptions.Item label="توضیحات خرابی" span={1}>{this.state.detail_data.description}</Descriptions.Item>
            <Descriptions.Item label="آدرس" span={3}>{this.state.detail_user.address}</Descriptions.Item>
            {this.state.detail_payment != null ?
            <> 
              <Descriptions.Item label="تایید پرداخت توسط مدیر" span={1}>{this.state.detail_payment.accept == true ? <span>پرداخت تایید شده</span> : <span> پرداخت تایید نشده</span>}</Descriptions.Item>
              <Descriptions.Item label="قیمت" span={1}>{this.state.detail_payment.price}</Descriptions.Item>
              <Descriptions.Item label="توضیحات پرداخت" span={1}>{this.state.detail_payment.description}</Descriptions.Item>
            </>
            :null}
          </Descriptions>
        </Modal>
        <Modal className="detail-modal" width={1000} title="ویرایش" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishedit}>
            <Form.Item name='price_pay' label="مبلغ" >
              <InputNumber />
            </Form.Item>
            <Form.Item name='description_pay' label="توضیحات" >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layoutform.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                ذخیره
              </Button>
            </Form.Item>
          </Form>  
          <Collapse >
            <Panel header="لیست سفارش ها" key="2">
                <Collapse >
                  {this.state.order_list.map((item , index) =>
                  <Panel header={<> نام محصول : {item.product.name} </>} key={index}>
                    <Descriptions bordered
                      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                      <Descriptions.Item label="قیمت" span={1}>{item.product.price}</Descriptions.Item>
                      <Descriptions.Item label="تعداد درخواستی" span={1}>{item.count}</Descriptions.Item>
                      <Descriptions.Item label="تعداد موجودی" span={1}>{item.product.stock}</Descriptions.Item>
                      <Descriptions.Item label="توضیحات محصول" span={3}>{item.product.description}</Descriptions.Item>

                    </Descriptions>
                  </Panel>
                  )}
                </Collapse>
            </Panel>
          </Collapse>

        </Modal>
        {/* <button onClick={()=>{console.log(this.props.Displaylistdata)}}> ehsaaaaan</button> */}
      </>
      
    );
  }
}

const mapStateToProps = state => {

  return({
    Displaylistdata: state.breakdownListData,
  })
}
const mapDispatchToProps = {BreakListDataAction};

export default connect(mapStateToProps , mapDispatchToProps )(Breakdown);
