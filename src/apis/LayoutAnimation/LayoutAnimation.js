/**
 * 名称：LayoutAnimation
 * 日期：2017-04-15
 * 描述：react-native LayoutAnimation  web实现
 */

import { checkPropTypes, PropTypes } from 'react';

const Types = {
  spring: true,
  linear: true,
  easeInEaseOut: true,
  easeIn: true,
  easeOut: true,
  keyboard: true,
};

const Properties = {
  opacity: true,
  scaleXY: true,
};

const animType = PropTypes.shape({
  duration: PropTypes.number,
  delay: PropTypes.number,
  springDamping: PropTypes.number,
  initialVelocity: PropTypes.number,
  type: PropTypes.oneOf(
    Object.keys(Types)
  ).isRequired,
  property: PropTypes.oneOf( // Only applies to create/delete
    Object.keys(Properties)
  ),
});

const configType = PropTypes.shape({
  duration: PropTypes.number.isRequired,
  create: animType,
  update: animType,
  delete: animType,
});


function checkConfig(config, locationring, name) {
  checkPropTypes({ config: configType }, { config }, locationring, name);
}

function configureNext(config, onAnimationDidEnd) {
}

function create(duration, type, creationProp) {
  return {
    duration,
    create: {
      type,
      property: creationProp,
    },
    update: {
      type,
    },
    delete: {
      type,
      property: creationProp,
    },
  };
}

var Presets = {
  easeInEaseOut: create(
    300, Types.easeInEaseOut, Properties.opacity
  ),
  linear: create(
    500, Types.linear, Properties.opacity
  ),
  spring: {
    duration: 700,
    create: {
      type: Types.linear,
      property: Properties.opacity,
    },
    update: {
      type: Types.spring,
      springDamping: 0.4,
    },
    delete: {
      type: Types.linear,
      property: Properties.opacity,
    },
  },
};

/**
 * Automatically animates views to their new positions when the
 * next layout happens.
 *
 * A common way to use this API is to call it before calling `setState`.
 *
 * Note that in order to get this to work on **Android** you need to set the following flags via `UIManager`:
 *
 *     UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
 */
const LayoutAnimation = {
  /**
   * Schedules an animation to happen on the next layout.
   *
   * @param config Specifies animation properties:
   *
   *   - `duration` in milliseconds
   *   - `create`, config for animating in new views (see `Anim` type)
   *   - `update`, config for animating views that have been updated
   * (see `Anim` type)
   *
   * @param onAnimationDidEnd Called when the animation finished.
   * Only supported on iOS.
   * @param onError Called on error. Only supported on iOS.
   */
  configureNext,
  /**
   * Helper for creating a config for `configureNext`.
   */
  create,
  Types,
  Properties,
  checkConfig,
  Presets,
  easeInEaseOut: configureNext.bind(
    null, Presets.easeInEaseOut
  ),
  linear: configureNext.bind(
    null, Presets.linear
  ),
  spring: configureNext.bind(
    null, Presets.spring
  ),
};

module.exports = LayoutAnimation;