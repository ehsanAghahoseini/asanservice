import React from 'react';

import {  Row , Col , Table, Tag, Space , Descriptions , Modal} from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import { Map, Marker, TileLayer } from "react-leaflet";
import moment from "jalali-moment";
import axios from 'axios';



class BillList extends React.Component {

    state = {
      display:false,
      visible:false,
      listdata : [],
      detail_data : {},
    }

  handleOk = () => {this.setState({visible: false })}


    showdetailmodal(id) {
 
    }



    componentDidMount() {
      this.setState({display:true});
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/technician/all_bill` , postdata)
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

 
    const columns = [
      {
        title: 'عنوان',
        dataIndex: 'title',
      },
      {
        title: 'نوع صورت حساب',
        dataIndex: 'type',
        render: text =>(
          <>
           {[text === 0 && <Tag color="blue">پرداخت سرویس</Tag> , text === 1 && <Tag color="blue">پاداش</Tag> , text === 2 && <Tag color="blue">کارمزد</Tag> , text === 3 && <Tag color="blue">تسویه حساب</Tag>]  }
          </> 
      )},
      {
        title: 'توضیحات ',
        dataIndex: 'description',
      },
      {
        title: 'مبلغ (تومان)',
        dataIndex: 'amount',
      },
      {
        title: 'تکنسین',
        dataIndex: 'technician_id',
      },
      {
        title: 'زمان',
        dataIndex: 'created_at',
        render: text =>(<>{moment(text).locale('fa').format("YYYY/M/D")}</>)},
    ];
    
    return (
      <>
        {this.state.display ? <Loader/> : null}
        <Table dataSource={this.state.listdata} columns={columns} />
      </>
      
    );
  }
}

export default BillList;
