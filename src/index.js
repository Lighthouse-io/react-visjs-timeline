import vis from 'vis'
import 'vis/dist/vis.css'
import React, { Component, PropTypes } from 'react'
import difference from 'lodash/difference'
import intersection from 'lodash/intersection'
import each from 'lodash/each'
import assign from 'lodash/assign'
import omit from 'lodash/omit'
import keys from 'lodash/keys'

const noop = function() {}
const events = [
  'currentTimeTick',
  'click',
  'contextmenu',
  'doubleClick',
  'groupDragged',
  'changed',
  'rangechange',
  'rangechanged',
  'select',
  'timechange',
  'timechanged'
]

const eventPropTypes = {}
const eventDefaultProps = {}

each(events, event => {
  eventPropTypes[event] = PropTypes.func,
  eventDefaultProps[`${event}Handler`] = noop
})

export default class Timeline extends Component {

  componentWillMount() {
    this.state = {
      // NOTE we store custom times on the state to enable us to diff with new
      // custom times and add or remove the elements with visjs
      customTimes: []
    }
  }

  componentWillUnmount() {
    this.$el.destroy()
  }

  componentDidMount() {
    const { container } = this.refs

    this.$el = new vis.Timeline(container)

    events.forEach(event => {
      this.$el.on(event, this.props[`${event}Handler`])
    })

    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  shouldComponentUpdate(nextProps) {
    const {
      items,
      groups,
      options,
      selection,
      customTimes
    } = this.props

    const itemsChange = items !== nextProps.items
    const groupsChange = groups !== nextProps.groups
    const optionsChange = options !== nextProps.options
    const customTimesChange = customTimes !== nextProps.customTimes

    return itemsChange ||
      groupsChange ||
      optionsChange ||
      customTimesChange
  }

  init() {
    const {
      items,
      groups,
      options,
      selection,
      customTimes,
      animate = true,
      currentTime
    } = this.props

    const hasGroups = groups.length > 0
    let timelineOptions = options

    if (animate) {
      // If animate option is set, we should animate the timeline to any new
      // start/end values instead of jumping straight to them
      timelineOptions = omit(options, 'start', 'end')

      this.$el.setWindow(options.start, options.end, {
        animation: animate
      })
    }

    this.$el.setOptions(timelineOptions)
    this.$el.setItems(items)
    this.$el.setSelection(selection)

    if (hasGroups) {
      this.$el.setGroups(groups)
    }

    if (currentTime) {
      this.$el.setCurrentTime(currentTime)
    }

    // diff the custom times to decipher new, removing, updating
    const customTimeKeysPrev = keys(this.state.customTimes)
    const customTimeKeysNew = keys(customTimes)
    const customTimeKeysToAdd = difference(customTimeKeysNew, customTimeKeysPrev)
    const customTimeKeysToRemove = difference(customTimeKeysPrev, customTimeKeysNew)
    const customTimeKeysToUpdate = intersection(customTimeKeysPrev, customTimeKeysNew)

    // NOTE this has to be in arrow function so context of `this` is based on
    // this.$el and not `each`
    each(customTimeKeysToRemove, id => this.$el.removeCustomTime(id))
    each(customTimeKeysToAdd, id => {
      const datetime = customTimes[id]
      this.$el.addCustomTime(datetime, id)
    })
    each(customTimeKeysToUpdate, id => {
      const datetime = customTimes[id]
      this.$el.setCustomTime(datetime, id)
    })

    // store new customTimes in state for future diff
    this.setState({ customTimes })
  }

  render() {
    return <div ref='container' />
  }
}

Timeline.propTypes = assign({
  items: PropTypes.array,
  groups: PropTypes.array,
  options: PropTypes.object,
  selection: PropTypes.array,
  customTimes: PropTypes.shape({
    datetime: PropTypes.instanceOf(Date),
    id: PropTypes.string
  }),
  animate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
  currentTime: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
      PropTypes.number
  ])
}, eventPropTypes)

Timeline.defaultProps = assign({
  items: [],
  groups: [],
  options: {},
  selection: [],
  customTimes: {},
}, eventDefaultProps)
