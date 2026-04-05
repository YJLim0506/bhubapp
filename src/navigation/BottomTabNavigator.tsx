import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors, Shadow } from '../theme';
import { DrawerNavigator } from './DrawerNavigator';
import MapScreen from '../screens/Map/MapScreen';
import BetaScreen from '../screens/Beta/BetaScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

import Svg, { Path, G, Circle } from 'react-native-svg';

const Tab = createBottomTabNavigator();

const { width: SCREEN_W } = Dimensions.get('window');
const BAR_MARGIN = 32;
const W = SCREEN_W - BAR_MARGIN * 2;
const H = 60;
const TAB_W = W / 4;
const SVG_W = W * 3;
const CX = SVG_W / 2;

const pathD = `
  M 0 0
  L ${CX - 40} 0
  C ${CX - 15} 0, ${CX - 20} 28, ${CX} 28
  C ${CX + 20} 28, ${CX + 15} 0, ${CX + 40} 0
  L ${SVG_W} 0
  L ${SVG_W} ${H}
  L 0 ${H}
  Z
`;

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const HomeIcon = ({ focused }: { focused: boolean }) => (
  <Svg width="44" height="44" viewBox="0 0 44 44">
    {focused && <Circle cx="22" cy="22" r="22" fill="rgba(255, 255, 255, 0.3)" />}
    <G x="10" y="10">
      <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#FFFFFF" />
    </G>
  </Svg>
);

const BookmarkIcon = ({ focused }: { focused: boolean }) => (
  <Svg width="44" height="44" viewBox="0 0 44 44">
    {focused && <Circle cx="22" cy="22" r="22" fill="rgba(255, 255, 255, 0.3)" />}
    <G x="10" y="10">
      <Path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" fill="#FFFFFF" />
    </G>
  </Svg>
);

const PlayIcon = ({ focused }: { focused: boolean }) => (
  <Svg width="44" height="44" viewBox="0 0 44 44">
    {focused && <Circle cx="22" cy="22" r="22" fill="rgba(255, 255, 255, 0.3)" />}
    <G x="10" y="10">
      <Path d="M8 5v14l11-7z" fill="#FFFFFF" />
    </G>
  </Svg>
);

const PersonIcon = ({ focused }: { focused: boolean }) => (
  <Svg width="44" height="44" viewBox="0 0 44 44">
    {focused && <Circle cx="22" cy="22" r="22" fill="rgba(255, 255, 255, 0.3)" />}
    <G x="10" y="10">
      <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#FFFFFF" />
    </G>
  </Svg>
);

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const animatedIndex = useRef(new Animated.Value(state.index)).current;

  useEffect(() => {
    Animated.timing(animatedIndex, {
      toValue: state.index,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [state.index, animatedIndex]);

  const translateX = animatedIndex.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => (i + 0.5) * TAB_W - CX),
  });

  return (
    <View style={tabStyles.wrapper}>
      {/* Background with Notch */}
      <View style={[StyleSheet.absoluteFillObject, tabStyles.barContainer]}>
        <AnimatedSvg
          width={SVG_W}
          height={H}
          viewBox={`0 0 ${SVG_W} ${H}`}
          style={{ transform: [{ translateX }] }}
        >
          <Path d={pathD} fill={Colors.primary} />
        </AnimatedSvg>
      </View>

      {/* Tabs */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="box-none">
        <View style={tabStyles.tabsRow} pointerEvents="box-none">
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const isActiveAnim = animatedIndex.interpolate({
              inputRange: [index - 1, index, index + 1],
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            });

            const translateIconY = isActiveAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -18], // Float up by 18px
            });

            return (
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={tabStyles.tab}
                activeOpacity={1}
              >
                {/* Floating Icon Container */}
                <Animated.View style={[tabStyles.iconBubble, { transform: [{ translateY: translateIconY }] }]}>
                  {options.tabBarIcon?.({ focused: isFocused, color: '', size: 24 })}
                </Animated.View>

                {/* Below Dot */}
                <Animated.View style={[tabStyles.dot, { opacity: isActiveAnim }]} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const tabStyles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: BAR_MARGIN,
    right: BAR_MARGIN,
    height: H,
    ...Shadow.md, // Give the whole bar a nice float shadow
  },
  barContainer: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  tabsRow: {
    flex: 1,
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBubble: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.primary, // Matches the bar
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    bottom: 8,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="HomeTab"
        component={DrawerNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <HomeIcon focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <BookmarkIcon focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="BetaTab"
        component={BetaScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <PlayIcon focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <PersonIcon focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
