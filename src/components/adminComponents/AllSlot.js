import React from 'react'
import {auth, database} from 'firebase'
import {RaisedButton} from 'material-ui'
import {Link} from 'react-router-dom' 
import {List, ListItem} from 'material-ui/List';

export default class AllSlot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            AREAS: [],
            have: true
        }
    }
    componentDidMount(){
        database().ref('AREAS').on('value',snap => {
            if(snap.val()){
                this.setState({AREAS:Object.keys(snap.val())})                
            }
            else{
                this.setState({have: false})                
            }
        })
    }
    componentWillUnmount(){
    }
    render(){
        var AREAS = this.state.AREAS;
        return(
            <div>
                <h1 className='page-header text-center' >All Parking Areas</h1>
                <List>
                    {this.state.have?
                        AREAS.map((area, key) => (
                            <ListItem className='clearfix' key={key}>
                                <div style={{width:'100%', display:'flex',alignItems:'center'}}>
                                    <span className="col-xs-10" style={{fontSize: '1.5em'}}>{area}</span>
                                    <Link className="col-xs-2" to={'/user/locationdetail?areaname='+area+'&type=admin'} ><RaisedButton label="View"/></Link>
                                </div>
                            </ListItem>
                        ))
                    :
                        <h2 className="text-center">No Parkin Location Found</h2>
                    }
                </List>
            </div>
        )
    }
}