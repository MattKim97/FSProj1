import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/GET_EVENTS';

const fetchEvents = (events)=> {
    return {
        type: GET_EVENTS,
        events
    }
}

export const getEvents = () => async (dispatch) => {
    try {
      const response = await csrfFetch("/api/events");
      if (response.ok) {
        const data = await response.json();
        dispatch(fetchEvents(data));
        return response;
      }
    } catch (err) {
      console.error(err);
    }
  };

  
const initialState = {
    events: [],
  };
  
  const eventReducer = (state = initialState, action) => {
    switch (action.type) {
      case GET_EVENTS:
        return {
          ...state,
          events: action.events,
        };
  
  
      default:
        return state;
    }
  };
  
  export default eventReducer;
