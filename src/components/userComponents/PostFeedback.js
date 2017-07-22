import React from 'react'
import {RaisedButton} from 'material-ui'
import {auth, database} from 'firebase'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';

export default class AddSlot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
           feedback: '' 
        }
    }
    handleChange = ev => {
        this.setState({feedback: ev.target.value})
    };
    handleSubmit = () => {
        database().ref('Feedbacks').push({
            text: this.state.feedback,
            author: {
                name: auth().currentUser.displayName,
                uid: auth().currentUser.uid,
                email: auth().currentUser.email
            }
        })
        this.setState({feedback:''})
    };
    componentDidMount(){
    }
    componentWillUnmount(){
    }
    render(){
        return(
            <div>
                <h1 className="page-header text-center">Post A Feedback</h1>
                <ValidatorForm onSubmit={this.handleSubmit} className="login">
                        <TextValidator
                            value={this.state.feedback}
                            floatingLabelText="Feedback"
                            onChange={this.handleChange}
                            multiLine={true}
                            rows={2}
                            name="Feedback"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <RaisedButton label="Send Feedback" primary={true} type="submit"/>
                    </ValidatorForm>
            </div>
        )
    }
}