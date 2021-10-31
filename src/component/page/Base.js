import React from 'react';
import { Layout, Menu, Breadcrumb , Badge , Button } from 'antd';
import {
  FileSearchOutlined ,
  HomeOutlined ,
  PieChartOutlined,
  FileOutlined,
  EnvironmentOutlined ,
  NotificationOutlined,
  UnorderedListOutlined ,
  FolderAddOutlined ,
  SettingOutlined ,
  LogoutOutlined ,
  RocketOutlined ,
} from '@ant-design/icons';
import Logo from '../image/icon.png';
import { BrowserRouter as Router, Route , Link} from 'react-router-dom';
import PrivateRoute from '../../PrivateRoute';
import BASE_URL from '../../BASE_URL';
import axios from 'axios';
import Loader from '../widget/Loader';

import FireBaseConf from '../widget/FireBaseConf';

import ApartemanList from './ApartemanList';
import ServicemanList from './ServicemanList';
import AddServiceman from './AddServiceman';
import AddAparteman from './AddAparteman';
import MapMain from './Map';
import Breakdown from './Breakdown';
import BreakdownFinish from './BreakdownFinish';
import BillList from './BillList';
import AddBill from './AddBill';
import ContractList from './ContractList';
import ProductList from './ProductList';
import AddProduct from './AddProduct';
import ShippingList from './ShippingList';




const { Header, Content, Footer, Sider } = Layout;

class Base extends React.Component {

 
  state = {
    collapsed: false,
    display:false ,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };
 
  logout = () => {
    this.setState({display:true});
    const postdata = {
      "token": localStorage.getItem('token') ,
    }
    axios.post(BASE_URL + `/auth/log_out` , postdata)
    .then((res) => {
      if(res.data.result === 'ok'){
        localStorage.clear();
        return window.location.href = '/'
      }
      else {
        this.setState({display:false});
        alert("خطا در برقراری ارتباط.لطفا دوباره امتحان نمایید.");
      }

    })
  }

  componentDidMount() {
    const postdata = {
      "token": localStorage.getItem('token') ,
    }
    axios.post(BASE_URL + `/auth/check_token` , postdata)
    .then((res) => {
      if(res.data.result === "error") {
        localStorage.clear();
        return window.location.href = '/'
      }
    })
  }

  render() {
    const { SubMenu } = Menu;
    const { collapsed } = this.state;
    return (
      <Layout  style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="panel-logo" >
            <img src={Logo} alt="logo"></img>
          </div>
          <Menu theme="dark"  mode="inline">
            <SubMenu key="sub1" icon={<HomeOutlined />} title="ساختمان">
              <Menu.Item key="1" icon={<UnorderedListOutlined />}>
                <Link to="/panel/aparteman_list">لیست ساختمان ها</Link>
              </Menu.Item>
              <Menu.Item key="2" icon={<FolderAddOutlined />}>
                <Link to="/panel/aparteman_add">افزودن ساختمان</Link>
              </Menu.Item>
            </SubMenu>  
            <SubMenu key="sub2" icon={<SettingOutlined />} title="سرویس کار">
              <Menu.Item key="3" icon={<UnorderedListOutlined />}>
                <Link to="/panel/serviceman_list">لیست سرویس کار</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<FolderAddOutlined />}>
                <Link to="/panel/serviceman_add">افزودن سرویس کار</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub3" icon={<FileSearchOutlined />} title="صورت حساب">
              <Menu.Item key="7" icon={<UnorderedListOutlined />}>
                <Link to="/panel/billlist">لیست صورت حساب</Link>
              </Menu.Item>
              <Menu.Item key="8" icon={<FolderAddOutlined />}>
                <Link to="/panel/addbill">افزودن صورت حساب</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub4" icon={<NotificationOutlined />} title=" خرابی">
              <Menu.Item key="9" icon={<UnorderedListOutlined />}>
                <Link to="/panel/breakdown">خرابی باز</Link>
              </Menu.Item>
              <Menu.Item key="11" icon={<UnorderedListOutlined />}>
                <Link to="/panel/breakdownfinish">خرابی پایان یافته</Link>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="sub5" icon={<NotificationOutlined />} title=" محصولات">
              <Menu.Item key="13" icon={<UnorderedListOutlined />}>
                <Link to="/panel/productlist">لیست محصولات</Link>
              </Menu.Item>
              <Menu.Item key="14" icon={<FolderAddOutlined />}>
                <Link to="/panel/addproduct">اضافه کردن محصول</Link>
              </Menu.Item>
              <Menu.Item key="15" icon={<RocketOutlined />}>
                <Link to="/panel/shippinglist">روش ارسال</Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="12" icon={<UnorderedListOutlined />}>
                <Link to="/panel/contract">قرارداد ها</Link>
              </Menu.Item>
            <Menu.Item key="5" icon={<EnvironmentOutlined />}>
              <Link to="/panel/map">نقشه</Link>
            </Menu.Item>
            <Menu.Item key="10" icon={<LogoutOutlined  />}>
               <Link onClick={() => this.logout()}>خروج </Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout  className=" site-layout ">
          <Header className="site-layout-background" style={{ padding: 0 }} >
          <FireBaseConf/>
            {/* <div className="notification-head-section">
              <Badge count={this.props.Displaycount}><a href="#" className="head-example" ><NotificationOutlined/></a></Badge>
            </div> */}
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {this.props.children}
              <PrivateRoute exact path='/panel/aparteman_list' component={ApartemanList} />
              <PrivateRoute exact path='/panel/serviceman_list' component={ServicemanList} />
              <PrivateRoute exact path='/panel/serviceman_add' component={AddServiceman} />
              <PrivateRoute exact path='/panel/aparteman_add' component={AddAparteman} />
              <PrivateRoute exact path='/panel/map' component={MapMain} />
              <PrivateRoute exact path='/panel/breakdown' component={Breakdown} />
              <PrivateRoute exact path='/panel/breakdownfinish' component={BreakdownFinish} />
              <PrivateRoute exact path='/panel/billlist' component={BillList} />
              <PrivateRoute exact path='/panel/addbill' component={AddBill} />
              <PrivateRoute exact path='/panel/contract' component={ContractList} />
              <PrivateRoute exact path='/panel/productlist' component={ProductList} />
              <PrivateRoute exact path='/panel/addproduct' component={AddProduct} />
              <PrivateRoute exact path='/panel/shippinglist' component={ShippingList} />

            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>TPSB</Footer>
        </Layout>
      </Layout>
      
    );
  }
}

export default Base;