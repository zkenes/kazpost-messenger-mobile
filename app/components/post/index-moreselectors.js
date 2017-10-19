// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

// import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createSelector} from 'reselect';

import {addReaction, createPost, deletePost, removePost} from 'mattermost-redux/actions/posts';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId, getCurrentUserRoles} from 'mattermost-redux/selectors/entities/users';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

// import Post from './post';

function makeIsPostFirstReply() {
    return createSelector(
        (state, {previousPostId}) => getPost(state, previousPostId),
        (state, props, post) => post,
        (previousPost, post) => {
            return !(previousPost && previousPost.root_id === post.root_id);
        }
    );
}

function makeIsPostLastReply() {
    return createSelector(
        (state, {nextPostId}) => getPost(state, nextPostId),
        (state, props, post) => post,
        (nextPost, post) => {
            return !(nextPost && nextPost.root_id === post.root_id);
        }
    );
}

export function makeMapStateToProps() {
    const isPostFirstReply = makeIsPostFirstReply();
    const isPostLastReply = makeIsPostLastReply();

    return function mapStateToProps(state, ownProps) {
        const post = getPost(state, ownProps.postId);

        const {config, license} = state.entities.general;
        const roles = getCurrentUserId(state) ? getCurrentUserRoles(state) : '';

        let isFirstReply = true;
        let isLastReply = true;
        let commentedOnPost = null;
        if (post && post.root_id && ownProps.renderReplies) {
            isFirstReply = isPostFirstReply(state, ownProps, post);
            isLastReply = isPostLastReply(state, ownProps, post);

            if (isFirstReply && post.root_id !== ownProps.previousPostId) {
                // Last post is not a comment on the same message
                commentedOnPost = getPost(state, post.root_id);
            }
        }

        return {
            config,
            currentUserId: getCurrentUserId(state),
            post,
            isFirstReply,
            isLastReply,
            commentedOnPost,
            license,
            roles,
            theme: getTheme(state)
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            addReaction,
            createPost,
            deletePost,
            removePost
        }, dispatch)
    };
}

// export default connect(makeMapStateToProps, mapDispatchToProps)(Post);
