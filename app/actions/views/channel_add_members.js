// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {addChannelMember} from 'mattermost-redux/actions/channels';

export function handleAddChannelMembers(channelId, members) {
    return async (dispatch, getState) => {
        try {
            const requests = members.map((m) => dispatch(addChannelMember(channelId, m, getState)));

            return await Promise.all(requests);
        } catch (error) {
            return error;
        }
    };
}
