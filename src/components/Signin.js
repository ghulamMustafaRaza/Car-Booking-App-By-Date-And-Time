import React from 'react'
import Loader from './Loader'
import * as firebase from 'firebase'
import {RaisedButton} from 'material-ui'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

export default class Signin extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            user: null,
            loading: true,
            email:'',
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
            setTimeout(() => {
                if(this.state.user) this.props.history.push('/user')
            },5)
        })
    }
    handleSubmit(e){
        e.preventDefault()
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass).then(data=>{
            console.log("logged in")
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
    }
    render(){
        return(
            <div>
                {this.state.loading?
                    <Loader fullpage={true}/>
                :
                    <ValidatorForm onSubmit={this.handleSubmit} className="login">
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
                        <RaisedButton label="Login" primary={true} type="submit"/>
                        <RaisedButton label="Not A Account" onClick={() => {
                            this.props.history.push('/signup')
                        }} default={true} />

                    </ValidatorForm>
                }
                    {/*<div>loggeg in</div>*/}
            </div>
        )
    }
}