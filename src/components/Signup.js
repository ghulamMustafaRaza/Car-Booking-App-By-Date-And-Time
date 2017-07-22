import React from 'react'
import {RaisedButton} from 'material-ui'
import Loader from './Loader'
import * as firebase from 'firebase'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

export default class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: null,
            loading: true,
            email:'',
            name:'',
            pass:''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }
    componentDidMount(){
        firebase.auth().onAuthStateChanged(() => {
            this.setState({
                user: firebase.auth().currentUser,
                loading: false
            })
        })
    }
    handleSubmit(e){
        e.preventDefault()
        firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass).then(data=>{
            console.log("Account created in")
            firebase.auth().currentUser.updateProfile({
                displayName: this.state.name
            })
            firebase.database().ref('USERS/'+firebase.auth().currentUser.uid).set({
                name:this.state.name,
                email:this.state.email,
                password:this.state.pass,
                type:'user'
            })
        }).catch(function(error) {
            alert(error.message)
        });
    }
    handleChange(ev){
        if(ev.target.name==="email"){
            this.setState({
                email: ev.target.value
            })
        }
        else if(ev.target.name==="pass"){
            this.setState({
                pass: ev.target.value
            })
        }
        else if(ev.target.name==="name"){
            this.setState({
                name: ev.target.value
            })
        }
    }
    render(){
        return(
            <div>
                {this.state.loading?
                    <Loader fullpage={true}/>
                :!this.state.user?
                    <ValidatorForm onSubmit={this.handleSubmit} className="login">
                        <TextValidator
                            value={this.state.name}
                            floatingLabelText="Name"
                            onChange={this.handleChange}
                            name="name"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <TextValidator
                            value={this.state.email}
                            floatingLabelText="Email"
                            onChange={this.handleChange}
                            name="email"
                            validators={['required', 'isEmail']}
                            errorMessages={['this field is required', 'email is not valid']}
                        />
                        <TextValidator
                            value={this.state.pass}
                            floatingLabelText="Password"
                            onChange={this.handleChange}
                            name="pass"
                            type="password"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <RaisedButton label="Create Account" primary={true} type="submit"/>
                        <RaisedButton label="All Ready A Account" onClick={() => {
                            this.props.history.push('/signin')
                        }} default={true}/>
                    </ValidatorForm>
                :
                    this.props.history.push('/user')
                }
                    {/*<div>loggeg in</div>*/}
            </div>
        )
    }
}