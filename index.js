import React, { Component } from 'react';
import {
  StatusBar,
  Text,
  View,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import ViewPropTypes from './lib';

import NavbarButton from './NavbarButton';
import styles from './styles';


const ButtonShape = {
  title: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
  handler: PropTypes.func,
  disabled: PropTypes.bool,
};

const TitleShape = {
  title: PropTypes.string.isRequired,
  tintColor: PropTypes.string,
  ellipsizeMode: PropTypes.string,
  numberOfLines: PropTypes.number
};

const StatusBarShape = {
  style: PropTypes.oneOf(['light-content', 'default']),
  hidden: PropTypes.bool,
  tintColor: PropTypes.string,
  hideAnimation: PropTypes.oneOf(['fade', 'slide', 'none']),
  showAnimation: PropTypes.oneOf(['fade', 'slide', 'none']),
  height: PropTypes.number
};

function getButtonElement(data, style) {
  return (
    <View style={[styles.navBarButtonContainer, style.containerMargin]}>
      {(!data || data.props) ? data : (
        <NavbarButton
          title={data.title}
          style={[data.style, style]}
          tintColor={data.tintColor}
          handler={data.handler}
          accessible={data.accessible}
          accessibilityLabel={data.accessibilityLabel}
          textStyle={data.textStyle}
        />
      )}
    </View>
  );
}

function getTitleElement(data) {
  if (!data || data.props) {
    return <View style={styles.customTitle}>{data}</View>;
  }

  const colorStyle = data.tintColor ? { color: data.tintColor } : null;

  return (
    <View style={styles.navBarTitleContainer}>
      <Text ellipsizeMode={data.ellipsizeMode} numberOfLines={data.numberOfLines} style={[styles.navBarTitleText, data.style, colorStyle]}>
        {data.title}
      </Text>
    </View>
  );
}

export default class NavigationBar extends Component {
  static propTypes = {
    style: ViewPropTypes.style,
    tintColor: PropTypes.string,
    statusBar: PropTypes.shape(StatusBarShape),
    leftButton: PropTypes.oneOfType([
      PropTypes.shape(ButtonShape),
      PropTypes.element,
      PropTypes.oneOf([null]),
    ]),
    rightButton: PropTypes.oneOfType([
      PropTypes.shape(ButtonShape),
      PropTypes.element,
      PropTypes.oneOf([null]),
    ]),
    title: PropTypes.oneOfType([
      PropTypes.shape(TitleShape),
      PropTypes.element,
      PropTypes.oneOf([null]),
    ]),
    containerStyle: ViewPropTypes.style,
    isModal: PropTypes.bool
  };

  static defaultProps = {
    style: {},
    tintColor: '',
    leftButton: null,
    rightButton: null,
    title: null,
    statusBar: {
      style: 'default',
      hidden: false,
      hideAnimation: 'slide',
      showAnimation: 'slide',
    },
    containerStyle: {},
    isModal: false
  };

  componentDidMount() {
    this.customizeStatusBar();
  }

  componentWillReceiveProps() {
    this.customizeStatusBar();
  }

  customizeStatusBar() {
    const { statusBar } = this.props;
    if (Platform.OS === 'ios') {
      if (statusBar.style) {
        StatusBar.setBarStyle(statusBar.style);
      }

      const animation = statusBar.hidden ?
        statusBar.hideAnimation : statusBar.showAnimation;

      StatusBar.showHideTransition = animation;
      StatusBar.hidden = statusBar.hidden;
    }
  }

  render() {
    const {
      containerStyle,
      tintColor,
      title,
      leftButton,
      rightButton,
      style,
    } = this.props;
    const customTintColor = tintColor ? { backgroundColor: tintColor } : null;

    const customStatusBarTintColor = this.props.statusBar.tintColor ?
      { backgroundColor: this.props.statusBar.tintColor } : null;

    const customStatusBarHeight = { height: this.props.statusBar.height };

    let statusBar = null;

    if (Platform.OS === 'ios') {
      statusBar = !this.props.statusBar.hidden ?
        <View style={[styles.statusBar, customStatusBarTintColor, customStatusBarHeight]} /> : null;
    }

    const majorVersionIOS = parseInt(Platform.Version, 10);
    const navBarHeight = majorVersionIOS >= 13 && this.props.isModal ? 56 : 44

    return (
      <View style={[styles.navBarContainer, containerStyle, customTintColor]}>
        {statusBar}
        <View style={[styles.navBar, { height: navBarHeight }, style]}>
          {getTitleElement(title)}
          {getButtonElement(leftButton, { marginLeft: 8, containerMargin: { marginLeft: 8 } })}
          {getButtonElement(rightButton, { marginRight: 8, containerMargin: { marginRight: 8 } })}
        </View>
      </View>
    );
  }
}
