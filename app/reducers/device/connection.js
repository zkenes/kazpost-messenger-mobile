// Copyright (c) 2017-present TinkerTech, Inc. All Rights Reserved.
// See License.txt for license information.

import {UserTypes} from 'mattermost-redux/action_types';
import {DeviceTypes} from 'app/constants';

export default function connection(state = true, action) {
    switch (action.type) {
    case DeviceTypes.CONNECTION_CHANGED:
        return action.data;

    case UserTypes.LOGOUT_SUCCESS:
        return true;
    }

    return state;
}

