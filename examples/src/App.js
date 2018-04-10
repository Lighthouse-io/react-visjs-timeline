import React, { Component } from 'react'
import Timeline from 'react-visjs-timeline'
import moment from 'moment'
import './App.css'

const basicExample = {
  options: {
    start: '2014-04-10',
    end: '2014-04-30',
  },
  items: [
    { id: 1, content: 'item 1', start: '2014-04-20' },
    { id: 2, content: 'item 2', start: '2014-04-14' },
    { id: 3, content: 'item 3', start: '2014-04-18' },
    { id: 4, content: 'item 4', start: '2014-04-16', end: '2014-04-19' },
    { id: 5, content: 'item 5', start: '2014-04-25' },
    { id: 6, content: 'item 6', start: '2014-04-27', type: 'point' },
  ],
}

const groupsExample = {
  groups: [],
  items: [],
  options: {
    groupOrder: 'content', // groupOrder can be a property name or a sorting function
  },
}

const now = moment()
  .minutes(0)
  .seconds(0)
  .milliseconds(0)
const groupCount = 3
const itemCount = 20

// create a data set with groups
const names = ['John', 'Alston', 'Lee', 'Grant']
for (let g = 0; g < groupCount; g++) {
  groupsExample.groups.push({ id: g, content: names[g] })
}

// create a dataset with items
for (let i = 0; i < itemCount; i++) {
  const start = now.clone().add(Math.random() * 200, 'hours')
  const group = Math.floor(Math.random() * groupCount)
  groupsExample.items.push({
    id: i,
    group: group,
    content:
      'item ' +
      i +
      ' <span style="color:#97B0F8">(' +
      names[group] +
      ')</span>',
    start: start,
    type: 'box',
  })
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedIds: [],
    }
  }

  render() {
    return (
      <div className="App">
        <p className="header">
          A basic timeline. You can move and zoom the timeline, and select
          items.
        </p>
        <Timeline {...basicExample} />
        <p className="header">
          This example demonstrate using groups. Note that a DataSet is used for
          both items and groups, allowing to dynamically add, update or remove
          both items and groups via the DataSet.
        </p>
        <Timeline
          {...groupsExample}
          clickHandler={this.clickHandler.bind(this)}
          selection={this.state.selectedIds}
        />
      </div>
    )
  }

  clickHandler(props) {
    const { group } = props
    const selectedIds = groupsExample.items
      .filter(item => item.group === group)
      .map(item => item.id)
    this.setState({
      selectedIds,
    })
  }
}

export default App
