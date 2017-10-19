#!./node_modules/.bin/babel-node

import {mapStateToProps} from './app/components/post/index.js';
import {mapStateToPropsWithPostSelectors} from './app/components/post/index-getposts.js';
import {makeMapStateToProps} from './app/components/post/index-moreselectors.js';

const mapStateToPropsWithMoreSelectors = makeMapStateToProps();

function makeState() {
    return {
        entities: {
            channels: {
                channels: {
                    mno: {id: 'mno'}
                },
                currentChannelId: 'mno',
                myMembers: {
                    mno: {user_id: '1234', channel_id: 'mno', roles: 'channel_user'}
                }
            },
            general: {
                config: {},
                license: {}
            },
            posts: {
                posts: {
                    aaa: {id: 'aaa', root_id: '', channel_id: 'abcd', create_at: 1000},
                    aab: {id: 'aab', root_id: 'aaa', channel_id: 'abcd', create_at: 1001},
                    aac: {id: 'aac', root_id: 'aaa', channel_id: 'abcd', create_at: 1002},
                    aad: {id: 'aad', root_id: 'aaa', channel_id: 'abcd', create_at: 1003},
                }
            },
            preferences: {
                myPreferences: {}
            },
            teams: {
                currentTeamId: 'xyz',
                myMembers: {
                    xyz: {user_id: '1234', team_id: 'xyz', roles: 'team_user'}
                },
                teams: {
                    xyz: {id: 'xyz'}
                }
            },
            users: {
                currentUserId: '1234',
                profiles: {
                    1234: {id: '1234', roles: 'system_user'}
                }
            }
        }
    };
}

const state = makeState();

// console.log(mapStateToProps(state, {postId: 'aab', }));

console.time('original');

for (const i = 0; i < 1000000; i++) {
    mapStateToProps(state, {postId: 'aab', renderReplies: true});
}

console.timeEnd('original');


console.time('passing previousPost/nextPost instead of isFirstReply/isLastReply');

for (const i = 0; i < 1000000; i++) {
    mapStateToPropsWithPostSelectors(state, {postId: 'aab', renderReplies: true});
}

console.timeEnd('passing previousPost/nextPost instead of isFirstReply/isLastReply');


console.time('using isPostFirstReply/isPostLastReply selectors');

// This one is actually broken since it returns commentedOnPost when it shouldn't

for (const i = 0; i < 1000000; i++) {
    mapStateToPropsWithMoreSelectors(state, {postId: 'aab', renderReplies: true});
}

console.timeEnd('using isPostFirstReply/isPostLastReply selectors');



console.time('original, with state changes');

for (const i = 0; i < 1000000; i++) {
    mapStateToProps(makeState(), {postId: 'aab', renderReplies: true});
}

console.timeEnd('original, with state changes');


console.time('passing previousPost/nextPost instead of isFirstReply/isLastReply, with state changes');

for (const i = 0; i < 1000000; i++) {
    mapStateToPropsWithPostSelectors(makeState(), {postId: 'aab', renderReplies: true});
}

console.timeEnd('passing previousPost/nextPost instead of isFirstReply/isLastReply, with state changes');


console.time('using isPostFirstReply/isPostLastReply selectors, with state changes');

// This one is actually broken since it returns commentedOnPost when it shouldn't

for (const i = 0; i < 1000000; i++) {
    mapStateToPropsWithMoreSelectors(makeState(), {postId: 'aab', renderReplies: true});
}

console.timeEnd('using isPostFirstReply/isPostLastReply selectors, with state changes');

