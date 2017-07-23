import React from 'react';
import {RaisedButton, FlatButton, Dialog } from 'material-ui';
import {auth, database} from 'firebase'

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export default class SlotView extends React.Component {
  state = {
    open: false,
    date: null
  };
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleBooking = () => {
    this.handleClose()
    var obj = {
      name: auth().currentUser.displayName,
      uid: auth().currentUser.uid,
      email: auth().currentUser.email,
      date: this.state.date,
      startTime: String(this.props.startTime),
      endTime: String(this.props.endTime),
    }
    // database().ref('AREAS/'+this.props.parrentNode+'/'+this.props.index+'/'+this.state.date).push(obj)
    database().ref('Bookings').push({
      area: this.props.parrentNode,
      slot: this.props.index,
      ...obj
    })
  };
  componentDidMount(next){
    this.check(this.props)
  }
  componentWillReceiveProps(next){
    this.props =  this.check(next)
  }
  check = (props) => {
    var date = props.date;
    var startTime = props.startTime;
    startTime.setFullYear(date.getFullYear());
    startTime.setDate(date.getDate());
    startTime.setMonth(date.getMonth());
    var endTime = props.endTime;
    endTime.setFullYear(date.getFullYear());
    endTime.setDate(date.getDate());
    endTime.setMonth(date.getMonth());
    var dateNow = String(date.getDate())+'-'+String(date.getMonth()+1)+'-'+String(date.getFullYear())
    this.setState({date: dateNow})
    database().ref('Bookings/').orderByChild('slot').equalTo(props.index).on('value',snap => {
      const booked = snap.val();
      var check = false;
      if(booked){
        let bookings = []
        for(let a in booked){
          bookings.push(booked[a])
        }
        console.log(bookings)
        check = (() => {
          for(let i=0; i < bookings.length ; i++){
            
            let book = bookings[i];
            let start = new Date(book.startTime);
            let end = new Date(book.endTime);
            
            if((startTime.getTime() < start.getTime() && endTime.getTime() > start.getTime()) || (startTime.getTime() < end.getTime() && endTime.getTime() > end.getTime())){
              return true
            }
          }
        })()
      }
      this.setState({check})
    })
  }

  render() {

    const actions = [
      <FlatButton
        label="Book Now"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleBooking}
      />,
      <RaisedButton
        label="close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ];
    var maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear + 1 )
    var slot = this.props.slot;
    return (
      <div>
        {this.state.check?
            <RaisedButton label={slot.label} secondary={true} />
          :
            <div>
              <RaisedButton label={slot.label} onTouchTap={this.handleOpen} />
              <Dialog
                title={"Detail Of "+slot.label}
                actions={actions}
                modal={false}
                open={this.state.open}
                onRequestClose={this.handleClose}
              >
                  <div>
                    <h3>Book Your Slot</h3>
                  </div>
              </Dialog>
            </div>
        }
      </div>
    );
  }
}