import React from 'react'
import {auth, database} from 'firebase'
import {RaisedButton} from 'material-ui'
import {List, ListItem} from 'material-ui/List';
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
            bookings: [],
            bookingsKeys: [],
            loading: true
        }
    }
    componentDidMount(){
        auth().onAuthStateChanged(() => {
            database().ref('Bookings').orderByChild('uid').equalTo(auth().currentUser.uid).on('value', snap => {
                let obj = snap.val();
                let bookingsKeys = []
                let bookings = []
                for(let a in obj){
                    bookings.push(obj[a])
                    bookingsKeys.push(a)
                }
                this.setState({bookings,bookingsKeys,loading:false})
            })
        })
    }
    handleDelete = ind => {
        var key = this.state.bookingsKeys[ind];
        let obj = this.state.bookings[ind];
        database().ref('Bookings').child(key).remove(err => {
            console.log('remove1')
            if(!err){
                database().ref('AREAS/'+obj.area+'/'+obj.slot+'/booked/'+obj.date).remove(errr => {
                    if(!errr){
                        console.log('remove2')
                    }
                    else{
                        console.log(errr)
                    }
                })
            }
            else{
                console.log(err)
            }
        })
    }
    render(){
        var bookings = this.state.bookings;
        return(
            <div>
                <h1 className="page-header text-center">All Bookings</h1>
                {this.state.loading? <Loader fullpage={true}/>
                :bookings.length ?
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Date</TableHeaderColumn>
                                <TableHeaderColumn>Area</TableHeaderColumn>
                                <TableHeaderColumn>Slot</TableHeaderColumn>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Delete</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                bookings.map((el, key) => (
                                    <TableRow key={key}>
                                        <TableRowColumn>{el.date}</TableRowColumn>
                                        <TableRowColumn>{el.area}</TableRowColumn>
                                        <TableRowColumn>{el.slot}</TableRowColumn>
                                        <TableRowColumn>{el.name}</TableRowColumn>
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