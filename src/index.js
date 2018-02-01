import vis from 'vis/dist/vis-timeline-graph2d.min'
import 'vis/dist/vis-timeline-graph2d.min.css'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
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

  componentWillUnmount() {
    this.$el.destroy()
  }

  componentDidMount() {
    const { container } = this.refs

    this.$el = new vis.Timeline(container, undefined, this.props.options)

    events.forEach(event => {
      this.$el.on(event, this.props[`${event}Handler`])
    })

    this.init()
  }

  componentDidUpdate(prevProps) {
    this.init(prevProps)
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
    const selectionChange = selection !== nextProps.selection

    return itemsChange ||
      groupsChange ||
      optionsChange ||
      customTimesChange ||
      selectionChange
  }

  init(prevProps) {
    const {
      items,
      groups,
      options,
      selection,
      selectionOptions = {},
      customTimes,
      animate = true,
      currentTime
    } = this.props

    if (!prevProps || options !== prevProps.options) {
      this.initOptions(options, animate)
    }

    if (!prevProps || groups !== prevProps.groups) {
      this.initGroups(groups)
    }

    if (!prevProps || items !== prevProps.items) {
      this.initItems(items, selection, selectionOptions)
    }

    if (!prevProps || currentTime !== prevProps.currentTime) {
      if (currentTime) {
        this.$el.setCurrentTime(currentTime)
      }
    }

    if (!prevProps || customTimes !== prevProps.customTimes) {
      this.initCustomTimes(customTimes, prevProps || {})
    }
  }

  initOptions(options, animate) {

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
  }

  initGroups(groups) {

    if (groups.length > 0) {
      const groupsDataset = new vis.DataSet()
      groupsDataset.add(groups)
      this.$el.setGroups(groupsDataset)
    }
  }

  initItems(items, selection, selectionOptions) {

    this.$el.setItems(items)
    this.$el.setSelection(selection, selectionOptions)
  }

  initCustomTimes(customTimes, prevCustomTimes) {
    // diff the custom times to decipher new, removing, updating
    const customTimeKeysPrev = keys(prevCustomTimes)
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
