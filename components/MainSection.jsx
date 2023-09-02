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
import ActionHome from 'material-ui/svg-icons/action/home';
import HardwareVideogameAsset from 'material-ui/svg-icons/hardware/videogame-asset';

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
      updatedData: {"DUE DATE": new Date(),...props.data, "Fees Options": "", "Fees Amount": 0, "comments": props.data && props.data.comments? props.data.comments: ""},
      open: false
    }
    this.closePopup = this.closePopup.bind(this);
    this.submitPopup = this.submitPopup.bind(this);
    this.deteteSubmitPopup = this.deteteSubmitPopup.bind(this);
  }
  handleOpen = () => {
    this.setState({open: true});
  };

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', nextProps);
    this.setState({updatedData: {"DUE DATE": new Date(),...nextProps.data, "Fees Options": "", "Fees Amount": 0, "comments": nextProps.data && nextProps.data.comments? nextProps.data.comments: ""}});
  }

  handleClose = () => {
    this.setState({open: false});
  };
  closePopup = () => {
    this.props.closeAddUser();
    this.handleClose()
  }
  submitPopup = () =>{
    this.props.addNewUser(this.state.updatedData, false);
    this.handleClose();
  }
  handleChange (key, value) {
    let cloneUpdatedData = {...this.state.updatedData}
    cloneUpdatedData[key]=value;
    this.setState({updatedData: cloneUpdatedData})
  }

  deteteSubmitPopup = () =>{
    this.props.addNewUser(this.state.updatedData, true);
    this.handleClose();
  }
  
  render() {
    const actions = [
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.deteteSubmitPopup}
      />,
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
      checkinTable: [],
      addNewSection: false,
      drawerOpen: false,
      drawerOpenFlag: "",
      showAttendance: false,
      resgistationNo: "",
      LastCheckInPerson:{},
      overAllData: [],
      showCheckInDetail : false,
      fromDrawer: false
    };
    this.closeAddUser = this.closeAddUser.bind(this);
    this.addNewUser = this.addNewUser.bind(this);
    this.updateRegNo = 0;
    this.notpaidCustomer = [];
    this.inactiveCustomer = [];
  }
  updateOverallList(){
    fetch("http://localhost:3000/list").then((response) => response.json()).then((data)=>{
      console.log(data);
      let CloneData = [...data];
      CloneData.forEach((row, index)=>{
        this.updateRegNo = Math.max(this.updateRegNo, row["Reg No:"])
        const date1 = new Date(row["DUE DATE"]);
        const date2 = new Date();
        const diffTime = Math.abs(date2 - date1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const rowColor = isNaN(date2 - date1) || (date2 - date1 > 0 && diffDays > 90) ? "#f0f0b7" : (date2 - date1) > 0 ? "#f47979" : "#2afc0094";
        CloneData[index] = {
          ...CloneData[index],
          expiredDays: diffDays,
          rowColor,
          inValidList: rowColor === "#f0f0b7"
        }
        if(rowColor === "#f47979") {
          this.notpaidCustomer.push(CloneData[index]);
        };
        if(rowColor === "#f0f0b7") {
          this.inactiveCustomer.push(CloneData[index]);
        };
      });
      let overAllData = [...CloneData];
      CloneData = CloneData.filter(({ inValidList }) => !inValidList);
      this.setState({TABLE_DATA: CloneData, overAllData });
    })
  }
  componentDidMount(){
    this.updateOverallList();
  }
  handleClearCompleted() {
    const atLeastOneCompleted = this.props.todos.some(todo => todo.completed);
    if (atLeastOneCompleted) {
      this.props.actions.clearCompleted();
    }
  }
  addNewUser(newUserData, deleteFlag) {
    let cloneTableData = [...this.state.TABLE_DATA]
    if (!newUserData["Reg No:"]){
      newUserData["Reg No:"] = this.updateRegNo + 1;
      cloneTableData.push(newUserData);
    }
    else {
      let index = cloneTableData.findIndex((data) => data["Reg No:"] === newUserData["Reg No:"]);
      if(!deleteFlag)cloneTableData[index] = newUserData;
      else  cloneTableData = cloneTableData.filter((val, indexNo)=>index!==indexNo);
    }
    fetch("http://localhost:3000/", {
      method: "POST",
      body: JSON.stringify({newUserData, deleteFlag}),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    }).then(()=>{
      this.updateOverallList();
    });
    this.setState({
      addNewSection: false,
      selectedIndex: '',
      TABLE_DATA: cloneTableData
    });
  }
  closeAddUser () {
    this.setState({ addNewSection: false,
      selectedIndex: '', showAttendance: false, drawerOpen: false });
  }

  render() {
    const { todos, actions } = this.props;
    const { filter, addNewSection, showAttendance, fromDrawer } = this.state;
    const keysForTable = Object.keys(TABLE_DATA[0]).filter((value)=>value!=="months" && value!=="FATHER");
    const {NAME="", lastCheckInTime="", rowColor="", expiredDays="", monthlyAttendance="" } =this.state.LastCheckInPerson;
    return (
      <section className="main" style={defaultStyle}>
        <Tabs style={{backgroundColor: "#606566"}}>
          <Tab
            style={{backgroundColor: "#606566"}}
            icon={<ActionHome />}
            label="Main List"
            onActive={(value)=>{
              this.closeAddUser();
            }}
          />
          <Tab
            style={{backgroundColor: "#606566"}}
            icon={<HardwareVideogameAsset />}
            label="unpaid"
            onActive={(value)=>{
              this.setState({
                drawerOpen: true,
                addNewSection: false,
                showAttendance: false,
                drawerOpenFlag: "unpaid"
              });
            }}
          />
          <Tab
            style={{backgroundColor: "#606566"}}
            icon={<MapsPersonPin />}
            label="Add New Joining"
            onActive={(value)=>{
              this.setState({ addNewSection: true,
                showAttendance: false,
                drawerOpen: false
               });
            }}
          />
           <Tab
            style={{backgroundColor: "#606566"}}
            icon={<MapsPersonPin />}
            label="InActive Users"
            onActive={(value)=>{
              this.setState({ showAttendance: false,
                drawerOpen: true,
                addNewSection: false,
                drawerOpenFlag: "inactive" })
            }}
          />
          <Tab
            style={{backgroundColor: "#606566"}}
            icon={<MapsPersonPin />}
            label="Attendence"
            onActive={(value)=>{
              fetch("http://localhost:3000/checkinlist").then((response) => response.json()).then((data) => {
                this.setState({ checkinTable: data });
              });
              this.setState({ drawerOpen: false, addNewSection: false, showAttendance: true })
            }}
          />
        </Tabs>
        {!addNewSection && showAttendance &&
          <div>
            <TextField
              hintText="Registation  ID"
              floatingLabelText="Registation  ID"
              value={this.state.resgistationNo}
              onChange={(event, value)=>{
                this.setState({resgistationNo: value});
              }}
            />
            <FlatButton
              type='submit'
              label="Check In"
              primary={true}
              onClick={()=>{
                let cloneTableData = [...this.state.TABLE_DATA];
                let index = cloneTableData.findIndex((data) => data["Reg No:"].toString() === this.state.resgistationNo.toString());
                if (index!== -1){
                  cloneTableData[index]["lastCheckInTime"] = new Date().toLocaleString();
                  cloneTableData[index]["monthlyAttendance"][new Date().getMonth()] = cloneTableData[index]["monthlyAttendance"][new Date().getMonth()]+1;
                  const audio = new Audio("data:audio/mpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwLGAFU3XGAHhDcgAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAA");
                  audio.play();
                  fetch("http://localhost:3000/checkin", {
                    method: "POST",
                    body: JSON.stringify({newUserData: cloneTableData[index]}),
                    headers: {
                      "Content-type": "application/json; charset=UTF-8"
                    }
                  }).then(()=>{
                    fetch("http://localhost:3000/checkinlist").then((response) => response.json()).then((data)=>{
                      this.setState({checkinTable: data});
                  });
                  });
                  this.setState({LastCheckInPerson: cloneTableData[index], showCheckInDetail: true});
                }else 
                alert (this.state.resgistationNo + "No such user")
              }}
            />
            <Table
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
                style={{ background: "#353131" }}
              >
                <TableRow>
                  {["Reg No:","Name" ,"DUE DATE", "Last CheckIn DateTime",  "Current Month Attendence"].map((headerlabel) => <TableHeaderColumn tooltip={headerlabel}>{headerlabel}</TableHeaderColumn>)}
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={this.state.showCheckboxes}
                deselectOnClickaway={this.state.deselectOnClickaway}
                showRowHover={this.state.showRowHover}
                stripedRows={this.state.stripedRows}
              >
                {this.state.checkinTable.map((row, index) => {
                  return (
                    <TableRow key={index} style={{ backgroundColor: row["rowColor"] }}>
                      {["Reg No:","NAME", "DUE DATE", "lastCheckInTime", "monthlyAttendance"].map((TableDatekey, index) => {
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
                                <Avatar src="images/1.jpg" />
                              }
                            >
                              {row[TableDatekey]}
                            </ListItem>
                          </List></TableRowColumn>;
                        else if ("monthlyAttendance" === TableDatekey) return <TableRowColumn title={row[TableDatekey]} key={index}>{`${row[TableDatekey][new Date().getMonth()]} session in current Month (${new Date().getDate()} Days)`}</TableRowColumn>;
                        else return <TableRowColumn title={row[TableDatekey]} key={index}>{row[TableDatekey]}</TableRowColumn>;
                      }
                      )}
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>}
        <Dialog
          title="Reps & Dips Check In"
          contentStyle={{
            width: "100%", height: "100%",
            maxWidth: 'none', maxHeight: 'none'
          }}
          autoDetectWindowHeight={false}
          actions={[<FlatButton
            label="Cancel"
            primary={true}
            onClick={() => this.setState({ showCheckInDetail: false })}
          />]}
          modal={false}
          open={this.state.showCheckInDetail}
          onRequestClose={() => this.setState({ showCheckInDetail: false })}
          autoScrollBodyContent={true}
        >
          <h1>{`Welcome ${this.state.LastCheckInPerson['NAME']}`}</h1>
          <h2>{`CheckIn Time ${this.state.LastCheckInPerson['lastCheckInTime']}`}</h2>
          {this.state.LastCheckInPerson['rowColor'] === "#f47979" ? <h3 style={{ backgroundColor: rowColor, padding: "10px" }}>{`Your ${this.state.LastCheckInPerson['Typeof pack']} Package expired since ${expiredDays} Days, last paid date -->${new Date(this.state.LastCheckInPerson['DUE DATE']).toDateString()}`}</h3> :
            <h1 style={{ backgroundColor: rowColor, padding: "10px" }}>{`Your ${this.state.LastCheckInPerson['Typeof pack']} Package going to expire in ${this.state.LastCheckInPerson['expiredDays']} Days, Due Date -->${new Date(this.state.LastCheckInPerson['DUE DATE']).toDateString()}`}</h1>}
          <h2>{`${monthlyAttendance[new Date().getMonth()]} session in current Month (${new Date().getDate()} Days)`}</h2>
          <h2>{`Current Month Attendence in % --> ${Math.ceil(((monthlyAttendance[new Date().getMonth()] / new Date().getDate()) <= 1 ?
            monthlyAttendance[new Date().getMonth()] / new Date().getDate() : 1) * 100)}%`}</h2>
        </Dialog>
        {addNewSection && !showAttendance && <DividerExampleForm data={ADDNEWUSER} closeAddUser={this.closeAddUser} addNewUser={this.addNewUser} />}
        {!addNewSection && !showAttendance && this.state.selectedIndex !== "" &&
          <DividerExampleForm data={(!fromDrawer ? this.state.TABLE_DATA: this.state.overAllData )[this.state.selectedIndex]} closeAddUser={this.closeAddUser} addNewUser={this.addNewUser}/>
        }
        {!addNewSection && !showAttendance &&  <Table
          height={this.state.height}
          fixedHeader={this.state.fixedHeader}
          fixedFooter={this.state.fixedFooter}
          selectable={this.state.selectable}
          multiSelectable={this.state.multiSelectable}
          onRowSelection={(val, dataValue) => {
            if (val.length > 0) this.setState({ selectedIndex: val[0], fromDrawer: false })
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
              return (
                <TableRow key={index} style={{ backgroundColor: row["rowColor"] }}>
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
                    else return <TableRowColumn title={row[TableDatekey]} key={index}>{row[TableDatekey]}</TableRowColumn>;
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
            {(this.state.drawerOpenFlag === "inactive"? this.inactiveCustomer:this.notpaidCustomer).map((row, index) => <ListItem
              disabled={true}
              key={index}
              style={{background: this.state.drawerOpenFlag === "inactive"? "#f0f0b7": "#f47979"}}
              title={`expired in days: ${row["expiredDays"]}, Due Date || ${new Date(row["DUE DATE"])}`}
              leftAvatar={
                <Avatar src="images/1.png" />
              }
              onClick={(val) => {
                let cloneTableData = [...this.state.overAllData];
                let index = cloneTableData.findIndex((data) => data["Reg No:"].toString() === row["Reg No:"].toString());
                this.setState({ selectedIndex: index, drawerOpen: false, fromDrawer: true})
              }}
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
