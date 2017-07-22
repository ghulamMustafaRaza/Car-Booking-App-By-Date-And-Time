import React from 'react'
import {RaisedButton} from 'material-ui'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator';
import {auth, database} from 'firebase'

export default class AddSlot extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            areaName:'',
            slotQty: 0
        }
    }
    componentDidMount(){
        
    }
    componentWillUnmount(){
    }
    handleChange = ev => {
        ev.target.name === 'Area Name' ? this.setState({areaName: ev.target.value})
        :ev.target.name === 'Slot Quantity' ? this.setState({slotQty: ev.target.value})
        :null
    }
    handleSubmit = () => {
        let arr = [];
        for(let i=0;i<this.state.slotQty;i++){
            arr.push({
                label: 'Slot'+(i+1),
                booking: []
            })
        }
        database().ref('AREAS/'+this.state.areaName).set(arr)
    }
    render(){
        return(
            <div>
                <h1 className="page-header text-center">
                    Add Slot
                </h1>
                    <ValidatorForm onSubmit={this.handleSubmit} className="login">
                        <TextValidator
                            value={this.state.areaName}
                            floatingLabelText="Area Name"
                            onChange={this.handleChange}
                            name="Area Name"
                            validators={['required']}
                            errorMessages={['this field is required']}
                        />
                        <TextValidator
                            value={this.state.slotQty}
                            floatingLabelText="Slot Quantity"
                            onChange={this.handleChange}
                            name="Slot Quantity"
                            validators={['required', 'isNumber']}
                            errorMessages={['this field is required', 'Require a valid Number']}
                        />
                        <RaisedButton label="Add Area" primary={true} type="submit" />
                    </ValidatorForm>
            </div>
        )
    }
}