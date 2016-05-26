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
    this.TimelineElement.destroy()
  }

  componentDidMount() {
    this.init()
  }

  componentDidUpdate() {
    this.init()
  }

  shouldComponentUpdate(nextProps) {
    const {
      items,
      options,
      customTimes
    } = this.props

    const itemsChange = items !== nextProps.items
    const optionsChange = options !== nextProps.options
    const customTimesChange = customTimes !== nextProps.customTimes

    return itemsChange ||
      optionsChange ||
      customTimesChange
  }

  // create timeline element
  // set custom time(s)
  // set data set

  init() {
    const { container } = this.refs
    let $el = this.TimelineElement

    const {
      items,
      options,
      customTimes,
      animate = true,
    } = this.props

    const timelineItems = new vis.DataSet(items)
    const timelineExists = !!$el

    if (timelineExists) {
      $el.setItems(timelineItems)

      let updatedOptions

      // If animate option is set, we should animate the timeline to any new
      // start/end values instead of jumping straight to them
      if (animate) {
        updatedOptions = omit(options, 'start', 'end')
        $el.setWindow(options.start, options.end, { animation: animate })
      }

      $el.setOptions(updatedOptions)

    } else {
      $el = this.TimelineElement = new vis.Timeline(container, timelineItems, options)

      events.forEach(event => {
        $el.on(event, this.props[`${event}Handler`])
      })
    }

    // diff the custom times to decipher new, removing, updating
    const customTimeKeysPrev = keys(this.state.customTimes)
    const customTimeKeysNew = keys(customTimes)
    const customTimeKeysToAdd = difference(customTimeKeysNew, customTimeKeysPrev)
    const customTimeKeysToRemove = difference(customTimeKeysPrev, customTimeKeysNew)
    const customTimeKeysToUpdate = intersection(customTimeKeysPrev, customTimeKeysNew)

    // NOTE this has to be in arrow function so context of `this` is based on
    // $el and not `each`
    each(customTimeKeysToRemove, id => $el.removeCustomTime(id))
    each(customTimeKeysToAdd, id => {
      const datetime = customTimes[id]
      $el.addCustomTime(datetime, id)
    })
    each(customTimeKeysToUpdate, id => {
      const datetime = customTimes[id]
      $el.setCustomTime(datetime, id)
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
  options: PropTypes.object,
  customTimes: PropTypes.shape({
    datetime: PropTypes.instanceOf(Date),
    id: PropTypes.string
  }),
  animate: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.object,
  ]),
}, eventPropTypes)

Timeline.defaultProps = assign({
  items: [],
  options: {},
  customTimes: {},
}, eventDefaultProps)
