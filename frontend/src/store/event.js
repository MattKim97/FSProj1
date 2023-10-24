import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/GET_EVENTS';
const GET_EVENT = 'events/GET_EVENT';


const fetchEvents = (events)=> {
    return {
        type: GET_EVENTS,
        events
    }
}

const fetchEvent = (event) => {
  return {
    type: GET_EVENT,
    event,
  };
};

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

  export const getEvent = (eventId) => async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        dispatch(fetchEvent(data));
        return data
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
        case GET_EVENT:
          return {
            ...state,
            event: {...action.event}
          };
      default:
        return state;
    }
  };
  
  export default eventReducer;
