import { csrfFetch } from "./csrf";

const GET_GROUPS = "groups/GET_GROUPS";
const GET_GROUP = "groups/GET_GROUP";

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
      return data
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
    default:
      return state;
  }
};

export default groupReducer;
