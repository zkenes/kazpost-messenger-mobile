// Copyright (c) 2016-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

// import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {addReaction, createPost, deletePost, removePost} from 'mattermost-redux/actions/posts';
import {getPost} from 'mattermost-redux/selectors/entities/posts';
import {getCurrentUserId, getCurrentUserRoles} from 'mattermost-redux/selectors/entities/users';

import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

// import Post from './post';

export function mapStateToPropsWithPostSelectors(state, ownProps) {
    const post = getPost(state, ownProps.postId);

    const {config, license} = state.entities.general;
    const roles = getCurrentUserId(state) ? getCurrentUserRoles(state) : '';

    let rootPost = null;
    let previousPost = null;
    let nextPost = null;
    if (post && post.root_id && ownProps.renderReplies) {
        rootPost = getPost(state, post.root_id);
        previousPost = ownProps.previousPostId ? getPost(state, ownProps.previousPostId) : null;
        nextPost = ownProps.nextPostId ? getPost(state, ownProps.nextPostId) : null;
    }

    return {
        config,
        currentUserId: getCurrentUserId(state),
        post,
        rootPost,
        previousPost,
        nextPost,
        license,
        roles,
        theme: getTheme(state)
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

// export default connect(mapStateToProps, mapDispatchToProps)(Post);
