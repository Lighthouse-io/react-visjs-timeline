React Vis.js Timeline
=====================

React component for the vis.js timeline module.

[vis.js Timeline Documentation](http://visjs.org/docs/timeline)

```
npm install --save react-visjs-timeline
```

## Getting Started

**Note:** Data passed to the component *should be Immutable*. If you are new to Immutable data [Seamless Immutable](https://github.com/rtfeldman/seamless-immutable) and [Immutable.js](https://facebook.github.io/immutable-js/) are good places to start.

```
import Timeline from 'react-visjs-timeline'

// http://visjs.org/docs/timeline/#Configuration_Options
const options = {
  width: '100%',
  height: '60px',
  stack: false,
  showMajorLabels: true,
  showCurrentTime: true,
  zoomMin: 1000000,
  type: 'background',
  format: {
    minorLabels: {
      minute: 'h:mma',
      hour: 'ha'
    }
  }
}

// jsx
<Timeline options={options} />
```

## Supported Features

Not all features from vis.js timeline are supported (Pull Requests are welcome). Because of React's declarative style, vis.js methods need abstracting via prop configuration (see customTimes for example) so some features are more tricky than others.

### Supported

* Configuration Options
* Items
* Custom Times
* Events

## Items

Items follow the exact same for format as they do in vis.js. See the [vis.js documentation](http://visjs.org/docs/timeline/#items) for more information.

```
const items = [{
  start: new Date(2010, 7, 15),
  end: new Date(2010, 8, 2),  // end is optional
  content: 'Trajectory A',
}]

<Timeline
  options={options}
  items={items}
/>
```

## Custom Times

Custom Times are defined more declaritively in the component, via the `customTimes` prop. You define them via a simple object where the key is the `id` of the custom time and the value is the datetime:

```
const customTimes = {
  one: new Date(),
  two: 'Tue May 10 2016 16:17:44 GMT+1000 (AEST)'
}
```

When the `customTimes` prop changes, the updated times will be reflected in the timeline.

## Events

All events are supported via prop function handlers. The prop name follows the convention `<eventName>Handler` and the specified function will receive the same arguments as the [vis.js counterparts](http://visjs.org/docs/timeline/#Events)

```
<Timeline
  options={options}
  clickHandler={clickHandler}
  rangeChangeHandler={rangeChangeHandler}
/>

function clickHandler(props) {
  // handle click event
}

function rangeChangeHandler(props) {
  // handle range change
}
```

## Animation

You can enable animation (when the options start/end values change) by passing a prop of `animation` to the component. The available options for this prop follow the same conventions as `setWindow` in vis.js. So you can either pass a boolean value (`true` by default) or an object specifying your animation configuration, e.g:

```
// animate prop...
{
  duration: 3000,
  easingFunction: 'easeInQuint',
}
```

## Styling

Import your custom CSS *after* you import the component from the module, e.g:

```
import Timeline from 'react-visjs-timeline'
import './my-custom-css.css' // in conjunction with webpack's style-loader
```
