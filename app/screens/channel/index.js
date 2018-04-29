// Copyright (c) 2016-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {startPeriodicStatusUpdates, stopPeriodicStatusUpdates} from 'mattermost-redux/actions/users';
import {init as initWebSocket, close as closeWebSocket} from 'mattermost-redux/actions/websocket';
import {RequestStatus} from 'mattermost-redux/constants';
import {getCurrentChannelId} from 'mattermost-redux/selectors/entities/channels';
import {getCurrentTeamId} from 'mattermost-redux/selectors/entities/teams';

import {
    loadChannelsIfNecessary,
    loadProfilesAndTeamMembersForDMSidebar,
    selectInitialChannel,
} from 'app/actions/views/channel';
import {connection} from 'app/actions/device';
import {recordLoadTime} from 'app/actions/views/root';
import {selectFirstAvailableTeam} from 'app/actions/views/select_team';
import {getTheme} from 'mattermost-redux/selectors/entities/preferences';

import Channel from './channel';

function mapStateToProps(state) {
    const {myChannels: channelsRequest} = state.requests.channels;

    return {
        channelsRequestFailed: channelsRequest.status === RequestStatus.FAILURE,
        currentTeamId: getCurrentTeamId(state),
        currentChannelId: getCurrentChannelId(state),
        theme: getTheme(state),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            connection,
            loadChannelsIfNecessary,
            loadProfilesAndTeamMembersForDMSidebar,
            selectFirstAvailableTeam,
            selectInitialChannel,
            initWebSocket,
            closeWebSocket,
            recordLoadTime,
            startPeriodicStatusUpdates,
            stopPeriodicStatusUpdates,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Channel);
