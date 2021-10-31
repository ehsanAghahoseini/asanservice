import React from 'react';

import {  Row , Col } from 'antd';
import Loader from '../widget/Loader';
import BASE_URL from '../../BASE_URL';
import { Map, Marker, TileLayer , Popup } from "react-leaflet";
import axios from 'axios';
import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
class MapMain extends React.Component {

    state = {
      display:false,
      user_marker : [],
      tech_marker : [],
      Updater:{},
    }

    componentWillUnmount() {
      clearInterval(this.state.Updater);
  }

    updatamap(){
      const postdata = {
        "token": localStorage.getItem('token') ,
      }
      axios.post(BASE_URL + `/technician/map` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            user_marker : res.data.data.users ,
            tech_marker : res.data.data.technicians ,
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
      axios.post(BASE_URL + `/technician/map` , postdata)
      .then((res) => {
        if(res.data.result === 'ok'){
          this.setState({
            user_marker : res.data.data.users ,
            tech_marker : res.data.data.technicians ,
            display:false
          });
          this.setState({Updater:  setInterval(() => {
            this.updatamap();
        }, 5000)})
        }
        else if (res.data.error === 'unauthenticated'){
          localStorage.clear();
          return window.location.href = '/'
        }
      })
    }

  render() {


    const iconTech = renderToStaticMarkup(
      <i style={{color:"#1890ff"}} className="fa fa-user-cog fa-3x" />
    );
    const customiconTech = divIcon({
        html: iconTech
    });
    const iconapa= renderToStaticMarkup(
      <i style={{color:"green"}} className="fa fa-home fa-3x"/>
    );
    const customiconapa = divIcon({
        html: iconapa
    });
      
    return (
      <Row className="map-page" span={24}>
        {this.state.display ? <Loader/> : null}
        <Map center={[35.719956920748, 51.406021043658]} zoom={12}>
          <TileLayer
                        
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          {this.state.tech_marker.map(function (item) {
            if (item.lat == null){
                return <div/>
            }else{
                return  <Marker icon={customiconTech}  position={[item.lat, item.lng]}>
                          <Popup>
                            <span>{item.username} / {item.name} {item.family}</span>
                          </Popup>
                        </Marker>
            }
            }
          )}
          {this.state.user_marker.map(function (item) {
            if (item.lat == null){
                return <div/>
            }else{
                return  <Marker icon={customiconapa}  position={[item.lat, item.lng]}>
                          <Popup>
                            <span>{item.username} / {item.firstname} {item.lastname}</span>
                          </Popup>
                        </Marker>
            }
            }
          )}
        </Map>
      </Row>
      
    );
  }
}

export default MapMain;
