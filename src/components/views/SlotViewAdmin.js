import React from 'react';
import {RaisedButton, FlatButton, Dialog } from 'material-ui';
import {List, ListItem} from 'material-ui/List';
import {auth, database} from 'firebase'

/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
export default class SlotView extends React.Component {
  state = {
    open: false,
  };
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  render() {
    const actions = [
      <RaisedButton
        label="close"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />
    ];
    var slot = this.props.slot;
    var index = this.props.index
    var booked = [];
    var dates = []
    for (let a in slot.booked){
      booked.push(slot.booked[a])
      dates.push(a)
    }
    return (
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
            {booked.length?
              <List>
                {
                  booked.map((el, ind) => (
                    <ListItem>
                      Booked By {el.name} Email {el.email} At {dates[ind]}
                    </ListItem>
                  ))
                }
              </List>
            :
                <h3 className="text-center">No Booking In This Slot</h3>
            }
          </div>
        </Dialog>
      </div>
    );
  }
}