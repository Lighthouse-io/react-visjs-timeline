'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _visTimelineGraph2d = require('vis/dist/vis-timeline-graph2d.min');

var _visTimelineGraph2d2 = _interopRequireDefault(_visTimelineGraph2d);

require('vis/dist/vis-timeline-graph2d.min.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _difference = require('lodash/difference');

var _difference2 = _interopRequireDefault(_difference);

var _intersection = require('lodash/intersection');

var _intersection2 = _interopRequireDefault(_intersection);

var _each = require('lodash/each');

var _each2 = _interopRequireDefault(_each);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _keys = require('lodash/keys');

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var noop = function noop() {};
var events = ['currentTimeTick', 'click', 'contextmenu', 'doubleClick', 'groupDragged', 'changed', 'rangechange', 'rangechanged', 'select', 'timechange', 'timechanged'];

var eventPropTypes = {};
var eventDefaultProps = {};

(0, _each2.default)(events, function (event) {
  eventPropTypes[event] = _propTypes2.default.func, eventDefaultProps[event + 'Handler'] = noop;
});

var Timeline = function (_Component) {
  _inherits(Timeline, _Component);

  function Timeline() {
    _classCallCheck(this, Timeline);

    return _possibleConstructorReturn(this, (Timeline.__proto__ || Object.getPrototypeOf(Timeline)).apply(this, arguments));
  }

  _createClass(Timeline, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.state = {
        // NOTE we store custom times on the state to enable us to diff with new
        // custom times and add or remove the elements with visjs
        customTimes: []
      };
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.$el.destroy();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var container = this.refs.container;


      this.$el = new _visTimelineGraph2d2.default.Timeline(container, undefined, this.props.options);

      events.forEach(function (event) {
        _this2.$el.on(event, _this2.props[event + 'Handler']);
      });

      this.init();
    }
  }, {
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var _props = this.props,
          items = _props.items,
          groups = _props.groups,
          options = _props.options,
          selection = _props.selection,
          _props$selectionOptio = _props.selectionOptions,
          selectionOptions = _props$selectionOptio === undefined ? {} : _props$selectionOptio,
          customTimes = _props.customTimes;

      // if the items changed handle this manually. Avoids flickering in re-render

      if (items !== nextProps.items) {
        this.updateItems(nextProps.items);
      }
      // if the selection changed handle this manually. Allows users to more easily
      // control the state of selected objects.
      if (selection !== nextProps.selection) {
        this.updateSelection(nextProps.selection, selectionOptions);
      }

      // if the window changed, handle this manually. Helps avoid flickering by
      // unnecessary renders.
      var oldStart = options.start;
      var oldEnd = options.end;
      var newStart = nextProps.options.start;
      var newEnd = nextProps.options.end;
      if (oldStart != newStart || oldEnd != newEnd) {
        this.updateWindow(newStart, newEnd);
      }

      var groupsChange = groups != nextProps.groups;
      var optionsChange = !this.optionsAreEqual(options, nextProps.options);
      var customTimesChange = !this.customTimesAreEqual(customTimes, nextProps.customTimes);

      return groupsChange || optionsChange || customTimesChange;
    }
  }, {
    key: 'optionsAreEqual',
    value: function optionsAreEqual(options1, options2) {
      return options1.template == options2.template || options1.horizontalScroll == options2.horizontalScroll || options1.maxHeight == options2.maxHeight || options1.minHeight == options2.minHeight || options1.showCurrentTime == options2.showCurrentTime || options1.width == options2.width || options1.zoomable == options2.zoomable;
    }
  }, {
    key: 'timeInArray',
    value: function timeInArray(time, array) {
      return array.filter(function (time2) {
        return time == time2;
      }).length > 0;
    }
  }, {
    key: 'customTimesAreEqual',
    value: function customTimesAreEqual(timesArr1, timesArr2) {
      return !Object.values(timesArr1).some(function (time1) {
        return !timesInArray(time1, Object.values(timesArr2));
      });
    }
  }, {
    key: 'init',
    value: function init() {
      var _this3 = this;

      var _props2 = this.props,
          items = _props2.items,
          groups = _props2.groups,
          options = _props2.options,
          selection = _props2.selection,
          _props2$selectionOpti = _props2.selectionOptions,
          selectionOptions = _props2$selectionOpti === undefined ? {} : _props2$selectionOpti,
          customTimes = _props2.customTimes,
          _props2$animate = _props2.animate,
          animate = _props2$animate === undefined ? true : _props2$animate,
          currentTime = _props2.currentTime;


      var timelineOptions = options;

      if (animate) {
        // If animate option is set, we should animate the timeline to any new
        // start/end values instead of jumping straight to them
        timelineOptions = (0, _omit2.default)(options, 'start', 'end');
        this.updateWindow(options.start, options.end);
      }

      this.$el.setOptions(timelineOptions);

      if (groups.length > 0) {
        var groupsDataset = new _visTimelineGraph2d2.default.DataSet();
        groupsDataset.add(groups);
        this.$el.setGroups(groupsDataset);
      }

      this.updateItems(items);
      this.updateSelection(selection, selectionOptions);

      if (currentTime) {
        this.$el.setCurrentTime(currentTime);
      }

      // diff the custom times to decipher new, removing, updating
      var customTimeKeysPrev = (0, _keys2.default)(this.state.customTimes);
      var customTimeKeysNew = (0, _keys2.default)(customTimes);
      var customTimeKeysToAdd = (0, _difference2.default)(customTimeKeysNew, customTimeKeysPrev);
      var customTimeKeysToRemove = (0, _difference2.default)(customTimeKeysPrev, customTimeKeysNew);
      var customTimeKeysToUpdate = (0, _intersection2.default)(customTimeKeysPrev, customTimeKeysNew);

      // NOTE this has to be in arrow function so context of `this` is based on
      // this.$el and not `each`
      (0, _each2.default)(customTimeKeysToRemove, function (id) {
        return _this3.$el.removeCustomTime(id);
      });
      (0, _each2.default)(customTimeKeysToAdd, function (id) {
        var datetime = customTimes[id];
        _this3.$el.addCustomTime(datetime, id);
      });
      (0, _each2.default)(customTimeKeysToUpdate, function (id) {
        var datetime = customTimes[id];
        _this3.$el.setCustomTime(datetime, id);
      });

      // store new customTimes in state for future diff
      this.setState({ customTimes: customTimes });
    }
  }, {
    key: 'updateItems',
    value: function updateItems(items) {
      this.$el.setItems(items);
    }
  }, {
    key: 'updateWindow',
    value: function updateWindow(start, end) {
      this.$el.setWindow(start, end, { animation: this.props.animate });
    }
  }, {
    key: 'updateSelection',
    value: function updateSelection(selection) {
      var selectionOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var selectionArr = selection;
      if (Array.isArray(selection) === false) {
        selectionArr = [selection];
      }
      this.$el.setSelection(selection, selectionOptions);
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { ref: 'container' });
    }
  }]);

  return Timeline;
}(_react.Component);

exports.default = Timeline;


Timeline.propTypes = (0, _assign2.default)({
  items: _propTypes2.default.array,
  groups: _propTypes2.default.array,
  options: _propTypes2.default.object,
  selection: _propTypes2.default.oneOf([_propTypes2.default.array, _propTypes2.default.object]),
  customTimes: _propTypes2.default.shape({
    datetime: _propTypes2.default.instanceOf(Date),
    id: _propTypes2.default.string
  }),
  animate: _propTypes2.default.oneOfType([_propTypes2.default.bool, _propTypes2.default.object]),
  currentTime: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date), _propTypes2.default.number])
}, eventPropTypes);

Timeline.defaultProps = (0, _assign2.default)({
  items: [],
  groups: [],
  options: {},
  selection: [],
  customTimes: {}
}, eventDefaultProps);