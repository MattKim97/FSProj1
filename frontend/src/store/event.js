import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/GET_EVENTS';
const GET_EVENT = 'events/GET_EVENT';
const CREATE_EVENT = "event/CREATE_EVENT";
const CREATE_EVENT_IMAGE = "event/CREATE_EVENT_IMAGE"


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

const createEventImage = (eventImage) => {
  return {
    type: CREATE_EVENT_IMAGE,
    eventImage,
  };
}

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event,
  };
};

export const createAEvent = (event) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/groups/${event.groupId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createEvent(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createAEventImage = (eventId, eventImage) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/events/${eventId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(eventImage),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(createEventImage(data));
      return data;
    }
  } catch (err) {
    console.error(err);
  }
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
          case CREATE_EVENT:
            return {...state, events: [...state.events,action.event]}
      default:
        return state;
    }
  };
  
  export default eventReducer;
