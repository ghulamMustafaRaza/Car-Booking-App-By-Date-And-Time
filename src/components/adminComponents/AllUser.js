import React from 'react'
import {auth, database} from 'firebase'
import {RaisedButton} from 'material-ui'
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
            users: [],
            usersKeys: [],
            loading: true
        }
    }
    componentDidMount(){
        database().ref('USERS').on('value', snap => {
            let obj = snap.val();
            let usersKeys = []
            let users = []
            for(let a in obj){
                users.push(obj[a])
                usersKeys.push(a)
            }
            this.setState({users,usersKeys,loading:false})
        })
    }
    handleDelete = ind => {
    }
    render(){
        var users = this.state.users;
        return(
            <div>
                <h1 className="page-header text-center">All Users</h1>
                {this.state.loading? <Loader fullpage={true}/>
                :users.length ?
                    <Table>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>Name</TableHeaderColumn>
                                <TableHeaderColumn>Email</TableHeaderColumn>
                                <TableHeaderColumn>Type</TableHeaderColumn>
                                <TableHeaderColumn>Delete</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {
                                users.map((el, key) => (
                                    <TableRow key={key}>
                                        <TableRowColumn>{el.name}</TableRowColumn>
                                        <TableRowColumn>{el.email}</TableRowColumn>
                                        <TableRowColumn>{el.type}</TableRowColumn>
                                        <TableRowColumn>
                                            <RaisedButton onClick={() => {this.handleDelete(key)}} secondary={true} label="Delete"/>
                                        </TableRowColumn>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                :
                    <h2 className="text-center">No users in Record</h2>
                }
            </div>
        )
    }
}