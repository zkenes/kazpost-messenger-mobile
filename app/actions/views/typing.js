// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {userTyping as wsUserTyping} from 'mattermost-redux/actions/websocket';

export function userTyping(channelId, rootId) {
    return async (dispatch, getState) => {
        const {websocket} = getState().device;
        if (websocket.connected) {
            wsUserTyping(channelId, rootId)(dispatch, getState);
        }
    };
}
