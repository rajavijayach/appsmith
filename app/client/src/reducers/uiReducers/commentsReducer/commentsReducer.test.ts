import commentsReducer from "./commentsReducer";
import { fetchApplicationThreadsMockResponse } from "mockResponses/CommentApiMockResponse";

import {
  createUnpublishedCommentThreadSuccess,
  removeUnpublishedCommentThreads,
  createCommentThreadSuccess,
  addCommentToThreadSuccess,
  fetchApplicationCommentsSuccess,
  updateCommentThreadSuccess,
} from "actions/commentActions";

import {
  newCommentEvent,
  newCommentThreadEvent,
  updateCommentThreadEvent,
} from "actions/commentActions";

import {
  applicationCommentThreadsByRefInitial,
  commentThreadsMapInitial,
  unpublishedCommentPayload,
  createCommentThreadSuccessPayload,
  addCommentToThreadSuccessPayload,
  updateCommentThreadPayload,
  newCommentThreadEventPayload,
  updateCommentThreadEventPayload,
  newCommentEventPayload,
} from "./testFixtures";

describe("Test comments reducer handles", () => {
  let state: any;
  it("fetch application comments success", () => {
    state = commentsReducer(
      undefined,
      fetchApplicationCommentsSuccess(fetchApplicationThreadsMockResponse.data),
    );

    expect(state.applicationCommentThreadsByRef).toStrictEqual(
      applicationCommentThreadsByRefInitial,
    );
    expect(state.commentThreadsMap).toStrictEqual(commentThreadsMapInitial);
  });

  it("create unpublished comment thread", () => {
    state = commentsReducer(
      state,
      createUnpublishedCommentThreadSuccess(unpublishedCommentPayload),
    );
    expect(state.unpublishedCommentThreads).toStrictEqual(
      unpublishedCommentPayload,
    );
  });

  it("remove unpublished comment thread", () => {
    state = commentsReducer(state, removeUnpublishedCommentThreads());
    expect(state.unpublishedCommentThreads).toStrictEqual({});
  });

  it("create comment thread", () => {
    const prevState = JSON.parse(JSON.stringify(state));
    state = commentsReducer(
      state,
      createCommentThreadSuccess(createCommentThreadSuccessPayload),
    );
    expect(state.commentThreadsMap).toStrictEqual({
      ...state.commentThreadsMap,
      [createCommentThreadSuccessPayload.id]: createCommentThreadSuccessPayload,
    });

    expect(state.applicationCommentThreadsByRef).toStrictEqual({
      ...prevState.applicationCommentThreadsByRef,
      [createCommentThreadSuccessPayload.applicationId]: {
        ...prevState.applicationCommentThreadsByRef[
          createCommentThreadSuccessPayload.applicationId
        ],
        [createCommentThreadSuccessPayload.refId]: Array.from(
          new Set([
            ...((prevState.applicationCommentThreadsByRef[
              createCommentThreadSuccessPayload.applicationId
            ] || {})[createCommentThreadSuccessPayload.refId] || []),
            createCommentThreadSuccessPayload.id,
          ]),
        ),
      },
    });
  });

  it("add comment to thread", () => {
    const prevState = JSON.parse(JSON.stringify(state));
    state = commentsReducer(
      state,
      addCommentToThreadSuccess(addCommentToThreadSuccessPayload),
    );

    expect(state.commentThreadsMap).toStrictEqual({
      ...state.commentThreadsMap,
      [addCommentToThreadSuccessPayload.commentThreadId]: {
        ...prevState.commentThreadsMap[
          addCommentToThreadSuccessPayload.commentThreadId
        ],
        comments: [
          ...prevState.commentThreadsMap[
            addCommentToThreadSuccessPayload.commentThreadId
          ].comments,
          addCommentToThreadSuccessPayload.comment,
        ],
      },
    });
  });

  it("thread updates", () => {
    state = commentsReducer(
      state,
      updateCommentThreadSuccess(updateCommentThreadPayload),
    );
    expect(
      state.commentThreadsMap[updateCommentThreadPayload.id],
    ).toStrictEqual({
      ...state.commentThreadsMap[updateCommentThreadPayload.id],
      ...updateCommentThreadPayload,
    });
  });

  it("new comment thread real time event", () => {
    const prevState = JSON.parse(JSON.stringify(state || {}));
    state = commentsReducer(
      state,
      newCommentThreadEvent(newCommentThreadEventPayload),
    );

    expect(state.commentThreadsMap).toStrictEqual({
      ...state.commentThreadsMap,
      [newCommentThreadEventPayload.thread._id]: {
        ...newCommentThreadEventPayload.thread,
        id: newCommentThreadEventPayload.thread._id,
        isVisible: false,
        comments:
          state.commentThreadsMap[newCommentThreadEventPayload.thread._id]
            .comments || [],
      },
    });

    expect(state.applicationCommentThreadsByRef).toStrictEqual({
      ...prevState.applicationCommentThreadsByRef,
      [newCommentThreadEventPayload.thread.applicationId]: {
        ...prevState.applicationCommentThreadsByRef[
          newCommentThreadEventPayload.thread.applicationId
        ],
        [newCommentThreadEventPayload.thread.refId]: Array.from(
          new Set([
            ...((prevState.applicationCommentThreadsByRef[
              newCommentThreadEventPayload.thread.applicationId
            ] || {})[newCommentThreadEventPayload.thread.refId] || []),
            newCommentThreadEventPayload.thread._id,
          ]),
        ),
      },
    });
  });

  it("new comment real time event", () => {
    const prevState = JSON.parse(JSON.stringify(state));
    state = commentsReducer(state, newCommentEvent(newCommentEventPayload));

    expect(
      state.commentThreadsMap[newCommentEventPayload.comment.threadId]
        .comments[1],
    ).toStrictEqual(
      {
        ...prevState.commentThreadsMap[newCommentEventPayload.comment.threadId],
        comments: [
          ...((
            prevState.commentThreadsMap[
              newCommentEventPayload.comment.threadId
            ] || {}
          ).comments || []),
          {
            ...newCommentEventPayload.comment,
            id: newCommentEventPayload.comment._id,
          },
        ],
      }.comments[1],
    );
  });

  it("thread update event", () => {
    state = commentsReducer(
      state,
      updateCommentThreadEvent(updateCommentThreadEventPayload),
    );

    expect(
      state.commentThreadsMap[updateCommentThreadEventPayload._id],
    ).toStrictEqual({
      ...state.commentThreadsMap[updateCommentThreadEventPayload._id],
      ...updateCommentThreadEventPayload,
    });
  });
});
