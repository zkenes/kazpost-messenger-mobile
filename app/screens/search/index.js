// Copyright (c) 2016-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {selectFocusedPostId, selectPost} from 'mattermost-redux/actions/posts';
import {clearSearch, removeSearchTerms, searchPosts} from 'mattermost-redux/actions/search';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import {loadChannelsByTeamName, loadThreadIfNecessary} from 'app/actions/views/channel';
import {isLandscape} from 'app/selectors/device';
import {makePreparePostIdsForSearchPosts} from 'app/selectors/post_list';
import {handleSearchDraftChanged} from 'app/actions/views/search';

import Search from './search';

function makeMapStateToProps() {
    const preparePostIds = makePreparePostIdsForSearchPosts();

    return (state) => {
        const postIds = preparePostIds(state, state.entities.search.results);
        const currentTeamId = getCurrentTeamId(state);
        const currentChannelId = getCurrentChannelId(state);
        const {recent} = state.entities.search;
        const {searchPosts: searchRequest} = state.requests.search;

        return {
            currentTeamId,
            currentChannelId,
            isLandscape: isLandscape(state),
            postIds,
            recent: recent[currentTeamId],
            searchingStatus: searchRequest.status,
            theme: getTheme(state),
        };
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            clearSearch,
            handleSearchDraftChanged,
            loadChannelsByTeamName,
            loadThreadIfNecessary,
            removeSearchTerms,
            selectFocusedPostId,
            searchPosts,
            selectPost,
        }, dispatch),
    };
}

export default connect(makeMapStateToProps, mapDispatchToProps)(Search);
