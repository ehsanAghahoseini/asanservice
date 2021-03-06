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
        title: ' ???????????? ????????????',
        dataIndex: 'user_id',
        render: (text , row)  => <span className="title-table-link"  onClick={() => this.showdetailmodal(row.id)}>{text}</span>,
      },
      {
        title: '?????? ??????????????',
        render: (text , row)  => <span>{row.user.apartment_name}</span>,
      },
      {
        title: '??????????',
        render: (row , text) =>(
          <>
           {[row.special.emergency_type === 0 && <Tag color="red">??????????</Tag> , row.special.emergency_type === 1 && <Tag color="gold">??????????</Tag> , row.special.emergency_type === 2 && <Tag color="green">????????</Tag>]  }
          </> 
      )},
      {
        title: '??????????',
        dataIndex: 'progress_status',
        render: text =>(
          <>
           {[text === 0 && <Tag color="red">???? ?????? ???????? ????????</Tag> , text === 1 && <Tag color="gold">?????????? ????????????</Tag> , text === 2 && <Tag color="blue">???? ?????? ??????????</Tag> , text === 3 && <Tag color="green">?????????? ??????????</Tag>]  }
          </> 
      )},
      {
        title: '?????? ????????????',
        render: (row , text) =>(
          <>
           {row.technician != null && <span>{row.technician.name} {row.technician.family}</span> }
          </> 
      )},
      {
        title: '???????? ???????????? ??????????',
        render: (row) =>(
          <>
           {[row.special.temp_time_arrive != null && row.special.temp_time_arrive == 0 && <Tag color="red">???? ?????? ???????? ????????</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 1 && <Tag color="gold">?????????? ????????????</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 2 && <Tag color="blue">???? ?????? ??????????</Tag> , row.special.temp_time_arrive != null && row.special.temp_time_arrive == 3 && <Tag color="green">?????????? ??????????</Tag>]  }
          </> 
      )},
      {
        title: '????????????',
        render: (text , row) =>(
          <>
           {[row.payment != null && row.payment.accept === false && <span className="title-table-link" onClick={()=>this.showeditmodal(row.id)}>????????????</span> , row.payment != null &&  row.payment.accept === true && <span className="title-table-link" onClick={()=>this.showeditmodal(row.id)}>????????????</span> , row.payment === null && <span >???????? ???????????? ????????</span>]  }
          </> 
      )},
      {
        title: '??????????',
        render: (text , row) =>(
          <>
           {[row.payment === null && <Tag color="red">???????????? ??????????</Tag> , row.payment != null &&  row.payment.accept === false && <Popconfirm onConfirm={()=>this.acceptpayment(row.id)}   title="?????? ???????? ???? ?????????? ???????????? ????????????" okText="??????????" cancelText="??????"  onCancel={()=>{}}><Tag style={{cursor:'pointer'}} color="gold"> ???????????? ?????????? ????????</Tag></Popconfirm> , row.payment != null && row.payment.accept === true && <Tag color="green">?????????? ??????</Tag>]  }
          </> 
      )},
    ];
    
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Table dataSource={this.props.Displaylistdata} columns={columns} />
        <Modal className="detail-modal" width={1000} title="????????????" visible={this.state.visible_detail} onCancel={this.handleOk} footer={null} >
          <Descriptions bordered>
            <Descriptions.Item label="?????? ????????????" span={1}>{this.state.detail_user.username}</Descriptions.Item>
            <Descriptions.Item label="?????? ????????????????" span={1}>{this.state.detail_user.apartment_name}</Descriptions.Item>
            <Descriptions.Item label="?????? ????????????" span={1}>{this.state.detail_user.firstname} {this.state.detail_user.lastname}</Descriptions.Item>
            <Descriptions.Item label=" ?????????? ???????????? ??????????" span={1}>{this.state.detail_data.is_paid == true ? <span>???????????? ??????</span> : <span>???????????? ????????</span>}</Descriptions.Item>
            <Descriptions.Item label="???????? ??????????" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_accept).locale('fa').format("YYYY/M/D"): <span>?????????? ????????</span>}</Descriptions.Item>
            <Descriptions.Item label="???????? ?????????? ???? ??????" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_arrive).locale('fa').format("YYYY/M/D"): <span>?????????? ????????</span>}</Descriptions.Item>
            <Descriptions.Item label="???????? ??????????" span={1}>{this.state.detail_data.time_accept != null ? moment(this.state.detail_data.time_end).locale('fa').format("YYYY/M/D") : <span>?????????? ????????</span>}</Descriptions.Item>
            <Descriptions.Item label="???????? ?????? ??????????" span={1}>{moment(this.state.detail_data.created_at).locale('fa').format("YYYY/M/D")}</Descriptions.Item>
            <Descriptions.Item label="?????????? ??????????????" span={1}>{this.state.detail_user.is_active == true ? <span>???????? </span> : <span> ??????????????</span>}</Descriptions.Item>
            <Descriptions.Item label="?????????????? ??????????" span={1}>{this.state.detail_data.description}</Descriptions.Item>
            <Descriptions.Item label="????????" span={3}>{this.state.detail_user.address}</Descriptions.Item>
            {this.state.detail_payment != null ?
            <> 
              <Descriptions.Item label="?????????? ???????????? ???????? ????????" span={1}>{this.state.detail_payment.accept == true ? <span>???????????? ?????????? ??????</span> : <span> ???????????? ?????????? ????????</span>}</Descriptions.Item>
              <Descriptions.Item label="????????" span={1}>{this.state.detail_payment.price}</Descriptions.Item>
              <Descriptions.Item label="?????????????? ????????????" span={1}>{this.state.detail_payment.description}</Descriptions.Item>
            </>
            :null}
          </Descriptions>
        </Modal>
        <Modal className="detail-modal" width={1000} title="????????????" visible={this.state.visible_edit} onCancel={this.handleOk} footer={null} >
          <Form {...layoutform} name="edit-form-messages" onFinish={this.onfinishedit}>
            <Form.Item name='price_pay' label="????????" >
              <InputNumber />
            </Form.Item>
            <Form.Item name='description_pay' label="??????????????" >
              <Input.TextArea />
            </Form.Item>
            <Form.Item wrapperCol={{ ...layoutform.wrapperCol, offset: 8 }}>
              <Button type="primary" htmlType="submit">
                ??????????
              </Button>
            </Form.Item>
          </Form>  
          <Collapse >
            <Panel header="???????? ?????????? ????" key="2">
                <Collapse >
                  {this.state.order_list.map((item , index) =>
                  <Panel header={<> ?????? ?????????? : {item.product.name} </>} key={index}>
                    <Descriptions bordered
                      column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
                      <Descriptions.Item label="????????" span={1}>{item.product.price}</Descriptions.Item>
                      <Descriptions.Item label="?????????? ????????????????" span={1}>{item.count}</Descriptions.Item>
                      <Descriptions.Item label="?????????? ????????????" span={1}>{item.product.stock}</Descriptions.Item>
                      <Descriptions.Item label="?????????????? ??????????" span={3}>{item.product.description}</Descriptions.Item>

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
