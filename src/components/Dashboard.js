import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import Axios from "axios";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }
];

// Add a new function to the Dashboard component class that can take an id and set the state of focused to the value of id.
class Dashboard extends Component {
  state = { 
    loading: true,
    focused: null,
    photos: [],
    topics: [],
  }

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => Axios.get(url).then(response => response.data));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        })
      })
  }
  
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }

  selectPanel(id) {
    !this.state.focused ? this.setState({focused: id}) : this.setState({focused: null})
   } 

  render() {
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });
    
    const panelData = (this.state.focused ? data.filter(panel => panel.id === this.state.focused) : data).map((panel) => {
      return <Panel onSelect={() => this.selectPanel(panel.id)} key={panel.id} label={panel.label} value={panel.getValue(this.state)} state={this.state} />
    })


    if (this.state.loading === true) {
      console.log(this.state);
      return <Loading />
    }

    console.log(this.state);
    
    return (
      <main className={dashboardClasses}>
        {panelData}
      </main>
    )
  }
}

export default Dashboard;
