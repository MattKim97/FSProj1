import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/GET_GROUPS";
const GET_GROUP = "groups/GET_GROUP";
const GET_GROUP_EVENTS = "group/GET_GROUP_EVENTS";
const CREATE_GROUP = "group/CREATE_GROUP";
const CREATE_GROUP_IMAGE = "group/CREATE_GROUP_IMAGE"

const fetchGroups = (groups) => {
  return {
    type: GET_GROUPS,
    groups,
  };
};

const fetchGroup = (group) => {
  return {
    type: GET_GROUP,
    group,
  };
};

const fetchEvents = (events) => {
  return {
    type: GET_GROUP_EVENTS,
    events,
  };
};

const createGroupImage = (groupImage) => {
  return {
    type: CREATE_GROUP_IMAGE,
    groupImage,
  };
}

const createGroup = (group) => {
  return {
    type: CREATE_GROUP,
    group,
  };
};

export const getGroups = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/groups");
    if (response.ok) {
      const data = await response.json();
      dispatch(fetchGroups(data.Groups));
      return response;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getGroup = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}`);
    if (response.ok) {
      const data = await response.json();
      dispatch(fetchGroup(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const getGroupEvents = (groupId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/events`);
    if (response.ok) {
      const data = await response.json();
      dispatch(fetchEvents(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createAGroup = (group) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(group),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createGroup(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createAGroupImage = (groupId, groupImage) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(groupImage),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createGroupImage(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

const initialState = { groups: [] };

const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_GROUPS:
      newState = { ...state, groups: action.groups };
      return newState;
    case GET_GROUP:
      newState = { ...state, group: action.group };
      return newState;
    case GET_GROUP_EVENTS:
      newState = { ...state, Events: [...action.events.Events] };
      return newState;
    case CREATE_GROUP:
      newState = {...state, groups: [...state.groups,action.group]}
      return newState
    // case CREATE_GROUP_IMAGE:
    //     newState = {
    //       ...state,
    //       GroupImages: [...state.GroupImages, action.groupImage],
    //     };
    default:
      return state;
  }
  
};

export default groupReducer;
