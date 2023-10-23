import { csrfFetch } from "./csrf";

const GET_GROUPS = 'groups'

const fetchGroups = (groups) => {
    return {
      type: GET_GROUPS,
      groups
    };
  };

  
  export const getGroups = () => async (dispatch) => {
    try{
        const response = await csrfFetch('/api/groups')
        if(response.ok){
            console.log(" the response" , response)
            const data = await response.json()
            dispatch(fetchGroups(data.Groups));    
            return response;
        }
      } catch(err){
        console.error(err)
      }
    }

  const initialState = {groups:[]}

  const groupReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
      case GET_GROUPS:
        newState = { ...state, groups: action.groups };
        return newState;
      default:
        return state;
    }
  };

  export default groupReducer;
