import React from 'react';
import Men from '../image/serviceman.png';
import { Modal , Button , Row , Col , Form, Input, InputNumber , Select} from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import { Map, Marker, TileLayer } from "react-leaflet";
import axios from 'axios';

class AddAparteman extends React.Component {

    state = {
      display:false,
      visible:false ,
      listdata : [],
      markers : [35.719956920748, 51.406021043658] ,
    }

    addMarker = (e) => {
      const newmarker = [];
      newmarker.push(e.latlng.lat);
      newmarker.push(e.latlng.lng);
      this.setState({markers :newmarker});
    }
  
    handleOk = () => {
      this.setState({visible: false});
      return window.location.href = '/panel/aparteman_list';
    }

    onFinish = values => {
      this.setState({display:true})
      const postdata = {
        "apartment_name": values.aparteman_name ,
        "firstname":values.manage_name ,
        "lastname":values.manage_family ,
        "username":values.mobile,
        "address":values.address,
        "lat":this.state.markers[0],
        "lng":this.state.markers[1],
        "stop":values.isgah ,
        "capacity":values.capacity ,
        "type":values.type,
        "door_type":values.door_type ,
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/user/register` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){ 
          this.setState({display:false , visible:true});
          alert("ساختمان با موفقیت افزوده شد");
          return window.location.href = '/panel/aparteman_list';
        }
          else if (res.data.error === "unauthenticated") {
            this.setState({display:false});
            localStorage.clear(); 
            return window.location.href = '/';
          }
      })
    };

  componentDidMount() {
    // this.setState({display:true});
  
  }


  render() {
    const validateMessages = { required: '${label} الزامی میباشد',};

    const layout = {
      labelCol: { span: 2 },
      wrapperCol: { span: 12 },
    };
    
    return (
      < >
        {this.state.display ? <Loader/> : null}
            <h1>افزودن ساختمان</h1>
            <Form {...layout} name="add_serviceman" onFinish={this.onFinish} validateMessages={validateMessages}>
              <Form.Item name={'aparteman_name'} label="نام ساختمان" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'manage_name'} label="نام مدیریت" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'manage_family'} label="فامیلی مدیریت" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'mobile'} label="موبایل" extra="شماره موبایل بعنوان نام کاربری استفاده میشود" rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'isgah'} label="تعداد ایستگاه" rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'capacity'} label=" ظرفیت" rules={[{ required: true , type: 'number'}]}>
                <InputNumber />
              </Form.Item>
              <Form.Item name={'type'} label=" نوع کاربری" rules={[{ required: true }]}>
                <Select>
                  <Select.Option value="1">کاربری اول</Select.Option>
                  <Select.Option value="2">کاربری دوم</Select.Option>
                  <Select.Option value="3">کاربری سوم</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name={'door_type'} label="نوع درب" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name={'address'} label="آدرس" rules={[{ required: true }]}>
                <Input.TextArea />
              </Form.Item>
              <Row className="form-map">
                <Col span={14}>
                  <Map center={[35.719956920748, 51.406021043658]} zoom={12} onClick={this.addMarker}>
                      <TileLayer
                        
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker  position={this.state.markers}>
                      </Marker>
                  </Map>
                </Col>
              </Row>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  ثبت
                </Button>
              </Form.Item>
            </Form>
            <Modal  visible={this.state.visible} onCancel={this.handleOk} footer={null} >
              <p>آپارتمان با موفقیت افزوده شد</p>
            </Modal>
      </>
      
    );
  }
}

export default AddAparteman;
