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
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
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
          customTimes = _props.customTimes;


      var itemsChange = items !== nextProps.items;
      var groupsChange = groups !== nextProps.groups;
      var optionsChange = options !== nextProps.options;
      var customTimesChange = customTimes !== nextProps.customTimes;
      var selectionChange = selection !== nextProps.selection;

      return itemsChange || groupsChange || optionsChange || customTimesChange || selectionChange;
    }
  }, {
    key: 'init',
    value: function init(prevProps) {
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
      var prevItems = prevProps.items,
          prevGroups = prevProps.groups,
          prevOptions = prevProps.options,
          prevCustomTimes = prevProps.customTimes;


      this.initOptions(options, prevOptions, animate);

      this.initGroups(groups, prevGroups);

      this.initItems(items, prevItems, selection, selectionOptions);

      if (currentTime) {
        this.$el.setCurrentTime(currentTime);
      }

      this.initCustomTimes(customTimes, prevCustomTimes);
    }
  }, {
    key: 'initOptions',
    value: function initOptions(options, prevOptions, animate) {

      if (options === prevOptions) {
        // Nothing changed, so make sure we don't touch $el's options.
        return;
      }

      var timelineOptions = options;

      if (animate) {
        // If animate option is set, we should animate the timeline to any new
        // start/end values instead of jumping straight to them
        timelineOptions = (0, _omit2.default)(options, 'start', 'end');

        this.$el.setWindow(options.start, options.end, {
          animation: animate
        });
      }

      this.$el.setOptions(timelineOptions);
    }
  }, {
    key: 'initGroups',
    value: function initGroups(groups, prevGroups) {

      if (groups === prevGroups) {
        // Nothing changed, so make sure we don't touch $el's groups.
        return;
      }

      if (groups.length > 0) {
        var groupsDataset = new _visTimelineGraph2d2.default.DataSet();
        groupsDataset.add(groups);
        this.$el.setGroups(groupsDataset);
      }
    }
  }, {
    key: 'initItems',
    value: function initItems(items, prevItems, selection, selectionOptions) {

      if (items === prevItems) {
        // Nothing changed, so make sure we don't touch $el's items.
        return;
      }

      this.$el.setItems(items);
      this.$el.setSelection(selection, selectionOptions);
    }
  }, {
    key: 'initCustomTimes',
    value: function initCustomTimes(customTimes, prevCustomTimes) {
      var _this3 = this;

      // diff the custom times to decipher new, removing, updating
      var customTimeKeysPrev = (0, _keys2.default)(prevCustomTimes);
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
  selection: _propTypes2.default.array,
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