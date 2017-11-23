// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {injectIntl, intlShape} from 'react-intl';
import {
    Animated,
    Platform,
    StyleSheet,
    View
} from 'react-native';

import PostList from 'app/components/post_list';
import PostListRetry from 'app/components/post_list_retry';
import RetryBarIndicator from 'app/components/retry_bar_indicator';

const {View: AnimatedView} = Animated;

class ChannelPostList extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            loadPostsIfNecessaryWithRetry: PropTypes.func.isRequired,
            loadThreadIfNecessary: PropTypes.func.isRequired,
            increasePostVisibility: PropTypes.func.isRequired,
            selectPost: PropTypes.func.isRequired,
            refreshChannelWithRetry: PropTypes.func.isRequired
        }).isRequired,
        channelId: PropTypes.string.isRequired,
        channelIsLoading: PropTypes.bool,
        channelRefreshingFailed: PropTypes.bool,
        currentUserId: PropTypes.string,
        intl: intlShape.isRequired,
        lastViewedAt: PropTypes.number,
        navigator: PropTypes.object,
        postIds: PropTypes.array.isRequired,
        postVisibility: PropTypes.number,
        totalMessageCount: PropTypes.number,
        theme: PropTypes.object.isRequired
    };

    static defaultProps = {
        postVisibility: 15
    };

    constructor(props) {
        super(props);

        this.animatedHeight = new Animated.Value(100);
        this.animatedHeight.addListener(({value: height}) => this.setState({height}));

        this.state = {
            opacity: new Animated.Value(1),
            height: 100,
            visiblePostIds: this.getVisiblePostIds(props),
            showLoadMore: props.postIds.length >= props.postVisibility
        };
    }

    componentWillReceiveProps(nextProps) {
        const {postIds: nextPostIds} = nextProps;

        const showLoadMore = nextPostIds.length >= nextProps.postVisibility;
        let visiblePostIds = this.state.visiblePostIds;

        if (nextPostIds !== this.props.postIds || nextProps.postVisibility !== this.props.postVisibility) {
            visiblePostIds = this.getVisiblePostIds(nextProps);
        }

        if (nextProps.channelIsLoading !== this.props.channelIsLoading) {
            if (nextProps.channelIsLoading) {
                this.fade(false);
            } else {
                this.fade(true);
            }
        }

        this.setState({
            showLoadMore,
            visiblePostIds
        });
    }

    fade = (show) => {
        const duration = 150;
        let maxHeight = 0;
        let maxOpacity = 0;

        if (show) {
            maxHeight = 100;
            maxOpacity = 1;
        }

        Animated.parallel([
            Animated.timing(this.state.opacity, {
                toValue: maxOpacity,
                duration,
                useNativeDriver: true
            }).start(),
            Animated.timing(this.animatedHeight, {
                toValue: maxHeight,
                duration,
                useNativeDriver: true
            }).start()
        ]);
    };

    getVisiblePostIds = (props) => {
        return props.postIds.slice(0, props.postVisibility);
    };

    goToThread = (post) => {
        const {actions, channelId, navigator, theme} = this.props;
        const rootId = (post.root_id || post.id);

        actions.loadThreadIfNecessary(post.root_id, channelId);
        actions.selectPost(rootId);

        const options = {
            screen: 'Thread',
            animated: true,
            backButtonTitle: '',
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg
            },
            passProps: {
                channelId,
                rootId
            }
        };

        if (Platform.OS === 'android') {
            navigator.showModal(options);
        } else {
            navigator.push(options);
        }
    };

    loadMorePosts = () => {
        if (this.state.showLoadMore) {
            const {actions, channelId} = this.props;
            actions.increasePostVisibility(channelId);
        }
    };

    loadPostsRetry = () => {
        const {actions, channelId} = this.props;
        actions.loadPostsIfNecessaryWithRetry(channelId);
    };

    render() {
        const {
            actions,
            channelId,
            channelRefreshingFailed,
            currentUserId,
            lastViewedAt,
            navigator,
            postIds,
            theme
        } = this.props;

        const {
            showLoadMore,
            visiblePostIds
        } = this.state;

        let component;
        if (!postIds.length && channelRefreshingFailed) {
            component = (
                <PostListRetry
                    retry={this.loadPostsRetry}
                    theme={theme}
                />
            );
        } else {
            component = (
                <PostList
                    postIds={visiblePostIds}
                    loadMore={this.loadMorePosts}
                    showLoadMore={showLoadMore}
                    onPostPress={this.goToThread}
                    onRefresh={actions.setChannelRefreshing}
                    renderReplies={true}
                    indicateNewMessages={true}
                    currentUserId={currentUserId}
                    lastViewedAt={lastViewedAt}
                    channelId={channelId}
                    navigator={navigator}
                />
            );
        }

        return (
            <View style={style.container}>
                <AnimatedView style={{opacity: this.state.opacity, height: `${this.state.height}%`}}>
                    {component}
                    <RetryBarIndicator/>
                </AnimatedView>
            </View>
        );
    }
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});

export default injectIntl(ChannelPostList);
