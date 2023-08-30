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
      resgistationNo:0,
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
        const rowColor = isNaN(date2 - date1) ? "#f0f0b7" : (date2 - date1) > 0 ? "#f47979" : "#2afc0094";
        CloneData[index] = {
          ...CloneData[index],
          expiredDays: diffDays,
          rowColor,
          inValidList: rowColor === "#f0f0b7"
        }
        if(rowColor === "#f47979") {
          this.notpaidCustomer.push(row);
        };
        if(rowColor === "#f0f0b7") {
          this.inactiveCustomer.push(row);
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
    const keysForTable = Object.keys(TABLE_DATA[0]).filter((value)=>value!=="months");
    const {NAME="", lastCheckInTime="", rowColor="", expiredDays="", monthlyAttendance="" } =this.state.LastCheckInPerson;
    return (
      <section className="main" style={defaultStyle}>
        <Tabs>
          <Tab
            icon={<ActionHome />}
            label="Main List"
            onActive={(value)=>{
              this.closeAddUser();
            }}
          />
          <Tab
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
                  {["Reg No:", "DUE DATE", "Last CheckIn DateTime",  "Current Month Attendence"].map((headerlabel) => <TableHeaderColumn tooltip={headerlabel}>{headerlabel}</TableHeaderColumn>)}
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
                      {["Reg No:", "DUE DATE", "lastCheckInTime", "monthlyAttendance"].map((TableDatekey, index) => {
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
                        else if ("monthlyAttendance" === TableDatekey) return <TableRowColumn title={row[TableDatekey]} key={index}>{`${row[TableDatekey][new Date().getMonth()]}/${new Date().getDate()}`}</TableRowColumn>;
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
            {this.state.LastCheckInPerson['rowColor'] === "#f47979" ? <h3 style={{backgroundColor: rowColor, padding: "10px"}}>{`Your ${this.state.LastCheckInPerson['Typeof pack']} Package expired since ${expiredDays} Days, last paid date -->${new Date(this.state.LastCheckInPerson['DUE DATE']).toDateString()}`}</h3> : 
            <h1 style={{backgroundColor: rowColor, padding: "10px"}}>{`Your ${this.state.LastCheckInPerson['Typeof pack']} Package going to expire in ${this.state.LastCheckInPerson['expiredDays']} Days, Due Date -->${new Date(this.state.LastCheckInPerson['DUE DATE']).toDateString()}`}</h1>}
            <h2>{`Current Month Attendence in days--> ${monthlyAttendance[new Date().getMonth()]}/${new Date().getDate()}`}</h2>
            <h2>{`Current Month Attendence in % --> ${Math.ceil((monthlyAttendance[new Date().getMonth()]/new Date().getDate())*100)}%`}</h2>
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
