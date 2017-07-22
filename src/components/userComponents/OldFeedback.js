import React from 'react'
import {RaisedButton} from 'material-ui'
import {auth, database} from 'firebase'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Loader from '../Loader'

export default class AddSlot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            keys: [],
            feeds: []
        }
    }
    componentDidMount(){
        auth().onAuthStateChanged(() => {
            database().ref('Feedbacks').orderByChild('author/uid').equalTo(auth().currentUser.uid).on('value', snap => {
                let obj   = snap.val();
                let feeds = [];
                let keys  = [];
                for(let a in obj){
                    feeds.push(obj[a]);
                    keys.push(a)
                }
                this.setState({feeds,keys})
            })
        })
    }
    componentWillUnmount(){
    }
    handleDelete = (i) => {
        database().ref('Feedbacks/'+this.state.keys[i]).remove(err => {
            if(!err){
                console.log('deleted')
            }
        })
    };
    render(){
        return(
            <div>
                <h1 className="page-header text-center">All Bookings</h1>
                {this.state.loading? <Loader fullpage={true}/>
                :this.state.feeds.length ?
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Text</TableHeaderColumn>
                                <TableHeaderColumn>Author Name</TableHeaderColumn>
                                <TableHeaderColumn>Author Email</TableHeaderColumn>
                                <TableHeaderColumn>Delete</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                this.state.feeds.map((el, key) => (
                                    <TableRow key={key}>
                                        <TableRowColumn>{el.text}</TableRowColumn>
                                        <TableRowColumn>{el.author.name}</TableRowColumn>
                                        <TableRowColumn>{el.author.email}</TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton onClick={() => {this.handleDelete(key)}} secondary={true} label="Delete"/>
                                        </TableRowColumn>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                :
                    <h2 className="text-center">No Bookings in Record</h2>
                }
            </div>
        )

    }
}