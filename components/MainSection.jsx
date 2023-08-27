import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE, TABLE_DATA, ADDNEWUSER, RATES } from '../constants/TodoFilters';
import { FlatButton, Dialog, Drawer, ListItem, Avatar, RaisedButton, FloatingActionButton, Checkbox, List, DatePicker, Chip, Paper, Divider, TextField, DropDownMenu, MenuItem } from 'material-ui';
import {Tabs, Tab} from 'material-ui/Tabs';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import ContentAdd from 'material-ui/svg-icons/content/add'
import ActionGrade from 'material-ui/svg-icons/action/grade';
import FontIcon from 'material-ui/FontIcon';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';

const defaultStyle = {
  marginLeft: 20
};

const TODO_FILTERS = {
  [SHOW_ALL]: () => true,
  [SHOW_ACTIVE]: todo => !todo.completed,
  [SHOW_COMPLETED]: todo => todo.completed
};
const style = {
  marginLeft: 20
};
class DividerExampleForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      genderDropdown: "Male", 
      updatedData: {...props.data, "Fees Options": "", "Fees Amount": 0},
      open: false
    }
    this.closePopup = this.closePopup.bind(this);
    this.submitPopup = this.submitPopup.bind(this);
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  closePopup = () => {
    this.props.closeAddUser();
    this.handleClose()
  }
  submitPopup = () =>{
    this.props.addNewUser(this.state.updatedData);
    this.handleClose();
  }
  handleChange (key, value) {
    let cloneUpdatedData = {...this.state.updatedData}
    cloneUpdatedData[key]=value;
    this.setState({updatedData: cloneUpdatedData})
  }
  
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.closePopup}
      />,
      <FlatButton
        label="Submit"
        primary={true}
        onClick={this.submitPopup}
      />
    ];
    // style={{background: "#babe8b"}}
    const keysForTable = Object.keys(this.state.updatedData).filter((value) => value !== "months" && value.indexOf("EMPTY") === -1);
    return (
      <Paper zDepth={5}>
        {keysForTable.map((key) => {
          if (key.toLowerCase().indexOf('date') !== -1)
            return <div><DatePicker value={this.state.updatedData[key] ? new Date(this.state.updatedData[key]): new Date()}
              floatingLabelText={key}
              style={style}
            onChange={
              (noValue, selectedDate) => {
                this.handleChange(key,selectedDate)
              }
            }
            />
              <Divider /></div>
          else if (key === "Gender") {
            return <div><DropDownMenu value={this.state.updatedData[key]} onChange={(event, index, value)=>{
              this.handleChange(key,value)
            }}>
              <MenuItem value={"Male"} primaryText="Male" />
              <MenuItem value={"Female"} primaryText="Female" />
            </DropDownMenu>
              <Divider /></div>
          } else if (key === "Typeof pack") {
            return <div><DropDownMenu value={this.state.updatedData[key]} onChange={(event, index, value)=>{
              this.handleChange(key,value)
            }}>
              <MenuItem value={"Cardio"} primaryText="Cardio" />
              <MenuItem value={"Gendral"} primaryText="Gendral" />
            </DropDownMenu>
              <Divider /></div>
          }else if (key === "Fees Options") {
            return <div><DropDownMenu value={this.state.updatedData[key]} onChange={(event, index, value)=>{
              let dt = this.props.data["DUE DATE"] ? new Date(this.props.data["DUE DATE"]) : new Date();
              let newDate = dt.setDate(dt.getDate()+(value*30));
              let cloneUpdatedData = {...this.state.updatedData}
              cloneUpdatedData["DUE DATE"]=newDate;
              cloneUpdatedData["Typeof pack"] = cloneUpdatedData["Typeof pack"] ? cloneUpdatedData["Typeof pack"]: 'Gendral';
              cloneUpdatedData["Fees Amount"]=RATES[cloneUpdatedData["Typeof pack"]][value];
              cloneUpdatedData[key]=value;
              this.setState({updatedData: cloneUpdatedData})
            }}>
              <MenuItem value={1} primaryText="One Month" />
              <MenuItem value={3} primaryText="Three Month" />
              <MenuItem value={6} primaryText="Six Month" />
              <MenuItem value={12} primaryText="One Year" />
            </DropDownMenu>
              <Divider /></div>
          }else{
            return <div><TextField
              name={key}
              hintText="Hint Text"
              floatingLabelText={key}
              style={style}
              value={this.state.updatedData[key]}
              onChange={(event, value)=>{
                this.handleChange(key,value)
              }}
            />
              <Divider /></div>
          }
        })}
        <div>
          <RaisedButton label="Next" secondary={true} style={style} onClick={this.handleOpen} />
          <Divider />
          <Dialog
            title="Dialog With Actions"
            actions={actions}
            modal={false}
            open={this.state.open}
            onRequestClose={this.handleClose}
            autoScrollBodyContent={true}
          >
            <List>
              {keysForTable.map((key) => {
                if (key.toLowerCase().indexOf('date') !== -1)
                  return <ListItem primaryText={`${key} ---> ${this.state.updatedData[key] && new Date(this.state.updatedData[key]).toDateString()}`} leftIcon={<ActionGrade />} />
                else
                  return <ListItem primaryText={`${key} ---> ${this.state.updatedData[key]}`} leftIcon={<ActionGrade />} />
              })}
            </List>
          </Dialog>
        </div>
      </Paper>
    )
  }
};

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL,
      fixedHeader: true,
      fixedFooter: true,
      stripedRows: false,
      showRowHover: false,
      selectable: true,
      multiSelectable: false,
      enableSelectAll: false,
      deselectOnClickaway: true,
      showCheckboxes: true,
      height: '300px',
      selectedIndex: '',
      TABLE_DATA: [],
      addNewSection: false,
      drawerOpen: false
    };
    this.closeAddUser = this.closeAddUser.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.updateRegNo = 0;
    this.notpaidCustomer = [];
  }
  componentDidMount(){
    fetch("http://localhost:3000/list").then((response) => response.json()).then((data)=>{
      console.log(data);
      this.setState({TABLE_DATA: data});
    })
  }
  handleClearCompleted() {
    const atLeastOneCompleted = this.props.todos.some(todo => todo.completed);
    if (atLeastOneCompleted) {
      this.props.actions.clearCompleted();
    }
  }
  addNewUser(newUserData) {
    let cloneTableData = [...this.state.TABLE_DATA]
    if (!newUserData["Reg No:"]){
      newUserData["Reg No:"] = this.updateRegNo + 1;
      cloneTableData.push(newUserData);
    }
    else {
      let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
      cloneTableData[index] = newUserData;
    }
    fetch("http://localhost:3000/", {
      method: "POST",
      body: JSON.stringify(newUserData),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    this.setState({
      addNewSection: false,
      selectedIndex: '',
      TABLE_DATA: cloneTableData
    });
  }
  closeAddUser () {
    this.setState({ addNewSection: false,
      selectedIndex: '' });
  }

  render() {
    const { todos, actions } = this.props;
    const { filter, addNewSection } = this.state;
    const keysForTable = Object.keys(TABLE_DATA[0]).filter((value)=>value!=="months");
    this.notpaidCustomer = [];
    return (
      <section className="main" style={defaultStyle}>
        <Tabs>
          <Tab
            icon={<FontIcon className="material-icons">Full List</FontIcon>}
            label="Main List"
            onActive={(value)=>{
              this.closeAddUser();
            }}
          />
          <Tab
            icon={<FontIcon className="material-icons">UnPaid List</FontIcon>}
            label="unpaid"
            onActive={(value)=>{
              this.setState({ drawerOpen: true, addNewSection: false });
            }}
          />
          <Tab
            icon={<MapsPersonPin />}
            label="Add New Joining"
            onActive={(value)=>{
              this.setState({ addNewSection: true });
            }}
          />
        </Tabs>
        {/* <FloatingActionButton style={style} onClick={() => {
          this.setState({ addNewSection: true });
        }}>
          <ContentAdd />
        </FloatingActionButton> */}
        {/* <div>
          <RaisedButton
            label="Unpaid Clients"
            onClick={() => {
              this.setState({ drawerOpen: true });
            }}
            style={style}
          />
        </div> */}
        {addNewSection && <DividerExampleForm data={ADDNEWUSER} closeAddUser={this.closeAddUser} addNewUser={this.addNewUser} />}
        {!addNewSection && this.state.selectedIndex !== "" &&
          <DividerExampleForm data={this.state.TABLE_DATA[this.state.selectedIndex]} closeAddUser={this.closeAddUser} addNewUser={this.addNewUser}/>
        }
        {!addNewSection && <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={(val, dataValue) => {
            if (val.length > 0) this.setState({ selectedIndex: val[0] })
          }}
        >
          <TableHeader
            displaySelectAll={this.state.showCheckboxes}
            adjustForCheckbox={this.state.showCheckboxes}
            enableSelectAll={this.state.enableSelectAll}
            style={{background: "#353131"}}
          >
            <TableRow>
              {keysForTable.map((headerlabel) => <TableHeaderColumn tooltip={headerlabel}>{headerlabel}</TableHeaderColumn>)}
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={this.state.showCheckboxes}
            deselectOnClickaway={this.state.deselectOnClickaway}
            showRowHover={this.state.showRowHover}
            stripedRows={this.state.stripedRows}
          >
            {this.state.TABLE_DATA.map((row, index) => {
              this.updateRegNo = Math.max(this.updateRegNo, row["Reg No:"])
              const date1 = new Date(row["DUE DATE"]);
              const date2 = new Date();
              const diffTime = Math.abs(date2 - date1);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const rowColor = isNaN(date2 - date1) ? "#f0f0b7" : (date2 - date1) > 0 ? "#f47979" : "#40f040";
              if(rowColor === "#f47979") {
                let newRowwithExpiredDate = {...row, expiredDays: diffDays }
                this.notpaidCustomer.push(newRowwithExpiredDate);
              };
              return (
                <TableRow key={index} style={{ backgroundColor: rowColor }}>
                  {keysForTable.map((TableDatekey, index) => {
                    if ("DUE DATE" === TableDatekey && row["DUE DATE"]) return <TableRowColumn key={index}><DatePicker value={new Date(row["DUE DATE"])}
                      onChange={
                        (noValue, selectedDate) => {
                          let newClone = [...this.state.TABLE_DATA];
                          newClone[this.state.selectedIndex]["DUE DATE"] = selectedDate
                          this.setState({ TABLE_DATA: newClone })
                        }
                      } /></TableRowColumn>
                    else if ("Reg No:" === TableDatekey) return <TableRowColumn key={index}>
                    <List>
                      <ListItem
                        disabled={true}
                        leftAvatar={
                          <Avatar src="images/1.png" />
                        }
                      >
                        {row[TableDatekey]}
                      </ListItem>
                      </List></TableRowColumn>;
                    else return <TableRowColumn key={index}>{row[TableDatekey]}</TableRowColumn>;
                  }
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        }
        <RaisedButton
            label="Backup data"
            onClick={() => {
              fetch("http://localhost:3000/backup", {
                method: "POST",
                body: JSON.stringify({updatefileName: new Date().toDateString()}),
                headers: {
                  "Content-type": "application/json; charset=UTF-8"
                }
              });
            }}
            style={style}
          />
        <Drawer
          docked={false}
          width={700}
          onRequestChange={(drawerOpen) => this.setState({ drawerOpen })}
          open={this.state.drawerOpen}>
          <List>
            {this.notpaidCustomer.map((row, index) => <ListItem
              disabled={true}
              key={index}
              style={{background: "#f47979"}}
              title={`expired in days: ${row["expiredDays"]}, Due Date || ${new Date(row["DUE DATE"])}`}
              leftAvatar={
                <Avatar src="images/1.png" />
              }
            >
              Reg No-{row["Reg No:"]} || {row["NAME"]} || expired in days: {row["expiredDays"]}, Due Date || { row["DUE DATE"] && new Date(row["DUE DATE"]).toDateString()}`
            </ListItem>)
            }
          </List>
        </Drawer>
      </section>
    );
  }
}

MainSection.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
