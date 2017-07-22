import React,{Component} from 'react'
import injectTapEventPlugin from 'react-tap-event-plugin'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {BrowserRouter as Router, Route} from 'react-router-dom'
import NavBar from './NavBar';
import Loader from './Loader';
import Signin from './Signin';
import Signup from './Signup';
import {database, auth} from 'firebase';
import { connect } from 'react-firebase'
import AddSlot from "./adminComponents/AddSlot"
import AllSlot from "./adminComponents/AllSlot"
import AllUser from "./adminComponents/AllUser"
import AllBooking from "./adminComponents/AllBooking"
import AllFeedback from "./adminComponents/AllFeedback"
import OldFeedback from "./userComponents/OldFeedback"
import OldBooking from "./userComponents/OldBooking"
import BookASlot from "./userComponents/BookASlot"
import PostFeedback from "./userComponents/PostFeedback"
import LocationDetail from "./userComponents/LocationDetail"

injectTapEventPlugin()

class App extends Component{
    constructor(props){
        super(props)
        this.state = {
            user: null,
            userData: null,
            type: null,
            loading: true
        }
    }
    componentDidMount(){
        auth().onAuthStateChanged(() => {
            if(auth().currentUser){
                this.props.getUserData(auth().currentUser.uid, snap => {
                    this.setState({type: snap.val().type,loading:false})
                })
            }else{
                this.setState({loading:false})
            }
        })
    }
    render(){
        return(
            <div>
                <Router>
                    <MuiThemeProvider>
                        <div>
                            {/*<NavBar/>*/}
                            <Route path="/" component={NavBar} />
                            <Route path="/signin" component={Signin } />
                            <Route path="/signup" component={Signup} />
                            <Route path="/user">
                                {
                                this.state.loading
                                ? 
                                    <Loader fullpage={true}/>
                                    :!auth().currentUser?
                                    <div>
                                        <h1 className="text-center">
                                            login first
                                        </h1>
                                    </div>
                                :
                                    this.state.type === "admin"
                                    ?
                                        <div>
                                            <Route path="/user/addlocation" component={AddSlot}/>
                                            <Route path="/user/alllocationadmin" component={AllSlot}/>
                                            <Route path="/user/allbooking" component={AllBooking}/>
                                            <Route path="/user/alluser" component={AllUser}/>
                                            <Route path="/user/allfeedback" component={AllFeedback}/>
                                            <Route path="/user/locationdetail" component={LocationDetail}/>
                                        </div>
                                    :this.state.type === 'user'
                                    &&
                                        <div>
                                            <Route path="/user/locationdetail" component={LocationDetail}/>
                                            <Route path="/user/bookaslot" component={BookASlot}/>
                                            <Route path="/user/mybookings" component={OldBooking}/>
                                            <Route path="/user/oldfeedback" component={OldFeedback}/>
                                            <Route path="/user/sendfeedback" component={PostFeedback}/>
                                        </div>
                                }
                            </Route>
                        </div>
                    </MuiThemeProvider>
                </Router>
            </div>
        )
    }
} 
const mapFirebaseToProps = (props, ref) => ({
  user: () => ref('USERS').once('value') ,
  getUserData: (uid, cb, er) => ref('USERS').child(uid).on('value', cb, er),
  setAUser: (obj,uid) => ref('USERS/'+uid).set(obj),
  sendFedback: (feed, uid) => {}
});

export default connect(mapFirebaseToProps)(App)
// export default App