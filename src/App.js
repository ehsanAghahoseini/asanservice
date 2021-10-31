import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Login from './component/page/Login';
import 'antd/dist/antd.css';
import Base from './component/page/Base';
import { ConfigProvider } from 'antd';
import PrivateRoute from './PrivateRoute';

function App() {
  return (
    <ConfigProvider direction="rtl">
      <Router>
        <Route exact path='/' component={Login} />
        <PrivateRoute  path='/panel' component={Base} />
      </Router>  
    </ConfigProvider>
  );
}

export default App;
