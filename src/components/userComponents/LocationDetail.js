import React from 'react'
import queryString from 'query-string'
import {auth, database} from 'firebase'
import Loader from '../Loader'
import SlotView from '../views/SlotView'
import {RaisedButton} from 'material-ui'

export default class LocationDetail extends React.Component{
    constructor(props){
        super(props)
        let obj = queryString.parse(window.location.search);
        this.state ={
            areaname: obj.areaname,
            userType: obj.type,
            arr: [],
            loading: true
        }
    }
    componentDidMount(){
        database().ref('AREAS/'+this.state.areaname).on('value',snap => {
            console.log(snap.val())
            if(snap.val()){this.setState({arr: snap.val(),loading:false})}
        })
    }
    render(){
        let areaname = this.state.areaname;
        let arr = this.state.arr;
        return(
            <div>
                <h1 className="text-center">
                    Area Name: {areaname}
                </h1>
                {this.state.loading?
                    <Loader/>
                :
                    <div style={{display: 'flex', alignItems: 'center' ,flexDirection:'column'}}>
                        <h2 className="text-center">Total Slot : {arr.length}</h2>
                        <div style={{maxWidth: 880,display:'block'}}>
                            {
                                arr.map((el, ind) => (
                                    <div className="col-xs-2" key={ind}>
                                        <SlotView slot={el} index={ind} type={this.state.userType} parrentNode={areaname} />
                                    </div>
                                ))
                            }    
                        </div>    
                    </div>
                }
            </div>
        )
    }
}