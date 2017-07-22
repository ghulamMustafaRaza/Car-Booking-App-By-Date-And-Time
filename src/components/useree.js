import React from 'react'
import {Link} from 'react-router-dom'
import {Tabs, Tab} from 'material-ui'
import {database, auth} from 'firebase';

class Admin extends React.Component{
    render(){
        return(
            <Tabs>
                <Link>
                    <Tab label="Add Slot"/>
                </Link>
                <Link>
                    <Tab label="View All Slot"/>
                </Link>
                <Link>
                    <Tab label="View All Booking"/>
                </Link>
                <Link>
                    <Tab label="View All User"/>
                </Link>
                <Link>
                    <Tab label="View All Feedback"/>
                </Link>
            </Tabs>
        )
    }
}
class User extends React.Component{
    render(){
        return(
            <Tabs>
                <Link>
                    <Tab label="View Parking All Location"/>
                </Link>
                <Link>
                    <Tab label="View My Bookings"/>
                </Link>
                <Link>
                    <Tab label="My Feedbacks"/>
                </Link>
                <Link>
                    <Tab label="Send Feedback"/>
                </Link>
            </Tabs>
        )
    }
}
class Redirect extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: null,
            userData: null,
            mount: false
        }
    }
    componentDidMount(){
        this.setState({mount:true})
        auth().onAuthStateChanged(() => {
            if(auth().currentUser) {
                database().ref('USER/'+auth().currentUser.uid).once('value', (snap) => {
                    if(this.state.mount){
                        this.setState({
                            user: auth().currentUser,
                            userData: snap.val()
                        })
                    }
                })
            }
            else{
                this.props.history.push('/signin')
            }
        })
    }
    componentWillUnmount(){
        this.setState({mount:false})        
    }
    render(){
        return(
            <div>
                {this.state.userData &&
                    this.props.userData.type === "admin"
                    ?
                        <Admin {...this.props} user={this.props.user}/>
                    :
                        <User {...this.props} user={this.props.user}/>
                }
            </div>
        )
    }
}

export default Redirect