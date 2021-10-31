import React from 'react';
import { Form, Input, Button  } from 'antd';
import Logo from '../image/icon.png';
import Loader from '../widget/Loader';
import axios from 'axios';
import BASE_URL from '../../BASE_URL';
// import {connect} from "react-redux";

// import {LoginState , UsernameState , PassState} from '../../actions/LoginActions';

class Login extends React.Component {

  state = {
    display:false,
  }

  onFinish = values => {
    this.setState({display: true});
    const postdata = {
      "username":values.username ,
      "password":values.password,
    }
    axios.post(BASE_URL + `/auth/login` , postdata)
    .then((res) => {
      localStorage.clear();
      if(res.data.result === 'ok'){ 
        localStorage.setItem("token", res.data.data.token);
        this.setState({display: false});
        return window.location.href = '/panel/aparteman_list'
      }
    })
  };


  render() {


    return (
      <div className="login-wave">
      {this.state.display ? <Loader/> : null}
      <header className="login-wave-head"> 
        <div className="login-form">
          <div className="login-form-logo">
            <img src={Logo} alt="logo"></img>
            <Form
              name="basic"
              onFinish={this.onFinish}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input placeholder="نام کاربری"/>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password placeholder="رمز عبور"/>
              </Form.Item>
              <Form.Item >
                <Button type="primary" htmlType="submit">
                  ورود
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <svg className="login-form-wave-svg" id="svg"  viewBox="-300 0 950 270" >
          <path d="M-314,267 C105,364 400,100 812,279" fill="none" stroke="white" stroke-width="120" stroke-linecap="round"/>
        </svg>
      </header>
    </div>
    );
  }
}


export default Login;
