import React from 'react';
import {RaisedButton, DatePicker, FlatButton, Dialog } from 'material-ui';
import {auth, database} from 'firebase'

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export default class SlotView extends React.Component {
  state = {
    open: false,
	date: new Date()
  };
  handleChange = (e) => {
	  console.log(e)
  	this.setState({
		date: new Date(e)
	})
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleBooking = () => {
    this.handleClose()
    var dateNow = this.state.date;
    dateNow.setHours(0, 0, 0, 0);
    dateNow = String(dateNow.getDate())+'-'+String(dateNow.getMonth())+'-'+String(dateNow.getFullYear())
    database().ref('AREAS/'+this.props.parrentNode).once('value').then(snap => {
      const obj = snap.val();
      // console.log(obj)
      var check = true;
      if(obj[this.props.index].booked){
        if(obj[this.props.index].booked[dateNow]){
          alert('Already Book For This Date Kindly Check Another Slot')
          check = false;
        }
      }
      if(check){
        obj[this.props.index].booked = {...obj[this.props.index].booked, [dateNow]:{
          name: auth().currentUser.displayName,
          uid: auth().currentUser.uid,
          email: auth().currentUser.email
        }}
      }
      // console.log(obj)      
      database().ref('AREAS/'+this.props.parrentNode).set(obj)
      database().ref('Bookings').push({
        area: this.props.parrentNode,
        slot: this.props.index,
        name: auth().currentUser.displayName,
        uid: auth().currentUser.uid,
        email: auth().currentUser.email,
        date: dateNow
      })
    })
  };

  render() {
    var dateNow = new Date;
    dateNow.setHours(0, 0, 0, 0);
    dateNow = String(dateNow.getDate())+'-'+String(dateNow.getMonth())+'-'+String(dateNow.getFullYear())
    const actions = [
      <RaisedButton
        label="close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ];
    if(this.props.type === 'user'){
      actions.unshift(
        <FlatButton
          label="Book Now"
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleBooking}
        />
      )
    }
    var maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear + 1 )
    var slot = this.props.slot;
    var index = this.props.index
    return (
      <div>
        {slot.booked?
          slot.booked[dateNow]?
            <RaisedButton label={slot.label} secondary={true} onTouchTap={this.handleOpen} />
          :
            <RaisedButton label={slot.label} onTouchTap={this.handleOpen} />
        :
          <RaisedButton label={slot.label} onTouchTap={this.handleOpen} />
        }
          <Dialog
            title={"Detail Of "+slot.label}
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
          >
          {this.props.type === 'user'
            ?
              <div>
                <h3>Book Your Slot</h3>
                <DatePicker
                  floatingLabelText="Booking Date"
                  autoOk={true}
                  defaultDate={new Date()}
                  minDate={new Date()}
                  maxDate={maxDate}
				  onChange={this.handleChange}
                />
              </div>
            :  
               <div>
                 <h3 className="text-center">Goto Booking List</h3>
               </div>
            }
        </Dialog>
      </div>
    );
  }
}