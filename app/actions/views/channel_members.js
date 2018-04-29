// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {removeChannelMember} from 'mattermost-redux/actions/channels';

export function handleRemoveChannelMembers(channelId, members) {
    return async (dispatch, getState) => {
        try {
            const requests = members.map((m) => dispatch(removeChannelMember(channelId, m, getState)));

            return await Promise.all(requests);
        } catch (error) {
            return error;
        }
    };
}
