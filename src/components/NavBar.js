import React,{Component} from 'react';
import {AppBar, FlatButton, Drawer, MenuItem} from 'material-ui';
import {Link} from 'react-router-dom'
import * as firebase from 'firebase'

class Logged extends Component{
    static muiName = 'FlatButton'
    render(){
        return(
            <div>
                <FlatButton onClick={() => {
                        firebase.auth().signOut()
                }} {...this.props} label="LogOut" />
                <Link to="/user" ><FlatButton  {...this.props} label="Userpanel"/></Link>
            </div>
        )
    }
}

class UnLogged extends Component{
    static muiName = 'FlatButton'
    render(){
        return(
            <div>
                <Link to="/signin" ><FlatButton  {...this.props} label="Login" /></Link>
                <Link to="/signup" ><FlatButton  {...this.props} label="SignUp"/></Link>
            </div>
        )
    }
}

class NavBar extends Component{
    constructor(props){
        super(props)
        this.state = {
            logged : false,
            open: false
        }
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(() => {
            if(firebase.auth().currentUser){
                this.setState({
                    logged:true
                })
                console.log(firebase.auth().currentUser.uid)
                firebase.database().ref('USERS/'+firebase.auth().currentUser.uid).on('value', snap => {
                    this.setState({userData: snap.val()})
                    console.log(snap.val())
                })
            }
            else{
                this.setState({
                    logged:false
                })
            }
        })
    }

    handleToggle = () => this.setState({open: !this.state.open});

    handleClose = () => this.setState({open: false});

    handleLink = (link) => {
        this.props.history.push(link)
        this.setState({
            open: false
        })
    };

    render(){
        return(
            <div>
                <AppBar
                    zDepth={1}
                    title="Car Parking Booking"
                    titleStyle={{cursor:'pointer'}}
                    onLeftIconButtonTouchTap={this.handleToggle}
                    iconElementRight={this.state.logged ? <Logged /> : <UnLogged />}
                />
                <Drawer
                    docked={false}
                    width={200}
                    open={this.state.open}
                    onRequestChange={(open) => this.setState({open})}
                >
                    {this.state.userData?
                        <div>
                            {this.state.userData.type === 'admin'?
                                <div>
                                    <MenuItem onTouchTap={this.handleClose}>Close</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/addlocation')}>Add Location</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/alllocationadmin')}>All Location</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/allbooking')}>All Booking</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/alluser')}>All User</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/allfeedback')}>All Feedback</MenuItem>
                                </div>
                            :
                                <div>
                                    <MenuItem onTouchTap={this.handleClose}>Close</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/bookaslot')}>All Location</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/mybookings')}>My Booking</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/oldfeedback')}>My Old Feedback</MenuItem>
                                    <MenuItem onTouchTap={this.handleLink.bind(null,'/user/sendfeedback')}>Send Feedback</MenuItem>
                                </div>
                            }
                        </div>
                    :
                        <MenuItem onTouchTap={this.handleLink}>Close</MenuItem>
                    }
                </Drawer>
            </div>
        )
    }
}
export default NavBar