'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _vis = require('vis');

var _vis2 = _interopRequireDefault(_vis);

require('vis/dist/vis.css');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

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
  eventPropTypes[event] = _react.PropTypes.func, eventDefaultProps[event + 'Handler'] = noop;
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
      this.TimelineElement.destroy();
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
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
      var _props = this.props;
      var items = _props.items;
      var options = _props.options;
      var customTimes = _props.customTimes;


      var itemsChange = items !== nextProps.items;
      var optionsChange = options !== nextProps.options;
      var customTimesChange = customTimes !== nextProps.customTimes;

      return itemsChange || optionsChange || customTimesChange;
    }

    // create timeline element
    // set custom time(s)
    // set data set

  }, {
    key: 'init',
    value: function init() {
      var _this2 = this;

      var container = this.refs.container;

      var $el = this.TimelineElement;

      var _props2 = this.props;
      var items = _props2.items;
      var groups = _props2.groups;
      var options = _props2.options;
      var customTimes = _props2.customTimes;
      var _props2$animate = _props2.animate;
      var animate = _props2$animate === undefined ? true : _props2$animate;


      var timelineItems = new _vis2.default.DataSet(items);
      var timelineExists = !!$el;

      if (timelineExists) {
        $el.setItems(timelineItems);

        var updatedOptions = void 0;

        // If animate option is set, we should animate the timeline to any new
        // start/end values instead of jumping straight to them
        if (animate) {
          updatedOptions = (0, _omit2.default)(options, 'start', 'end');
          $el.setWindow(options.start, options.end, { animation: animate });
        }

        $el.setOptions(updatedOptions);
      } else {
        $el = this.TimelineElement = new _vis2.default.Timeline(container, timelineItems, groups, options);

        events.forEach(function (event) {
          $el.on(event, _this2.props[event + 'Handler']);
        });
      }

      // diff the custom times to decipher new, removing, updating
      var customTimeKeysPrev = (0, _keys2.default)(this.state.customTimes);
      var customTimeKeysNew = (0, _keys2.default)(customTimes);
      var customTimeKeysToAdd = (0, _difference2.default)(customTimeKeysNew, customTimeKeysPrev);
      var customTimeKeysToRemove = (0, _difference2.default)(customTimeKeysPrev, customTimeKeysNew);
      var customTimeKeysToUpdate = (0, _intersection2.default)(customTimeKeysPrev, customTimeKeysNew);

      // NOTE this has to be in arrow function so context of `this` is based on
      // $el and not `each`
      (0, _each2.default)(customTimeKeysToRemove, function (id) {
        return $el.removeCustomTime(id);
      });
      (0, _each2.default)(customTimeKeysToAdd, function (id) {
        var datetime = customTimes[id];
        $el.addCustomTime(datetime, id);
      });
      (0, _each2.default)(customTimeKeysToUpdate, function (id) {
        var datetime = customTimes[id];
        $el.setCustomTime(datetime, id);
      });

      // store new customTimes in state for future diff
      this.setState({ customTimes: customTimes });
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
  items: _react.PropTypes.array,
  options: _react.PropTypes.object,
  groups: _react.PropTypes.array,
  customTimes: _react.PropTypes.shape({
    datetime: _react.PropTypes.instanceOf(Date),
    id: _react.PropTypes.string
  }),
  animate: _react.PropTypes.oneOfType([_react.PropTypes.bool, _react.PropTypes.object])
}, eventPropTypes);

Timeline.defaultProps = (0, _assign2.default)({
  items: [],
  options: {},
  groups: [],
  customTimes: {}
}, eventDefaultProps);