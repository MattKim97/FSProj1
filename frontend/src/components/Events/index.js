import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getEvents } from '../../store/event';
import './Events.css'

export default function Events() {

    const dispatch = useDispatch();
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("events");

    const events = useSelector((state) => state.eventReducer.events.Events)

    useEffect(() => {
        dispatch(getEvents());
      }, [dispatch]);

      if(!events || events.length === 0) return null
  
  
    const handleTabClick = (tab) => {
      setActiveTab(tab);
    };

  return (
    <div className='eventsContainer'>
         <div className="eventLinksContainer">
            <div className='eventLinks'>
        <a
          href="/events"
          style={{marginRight:'10px'}}
          className={activeTab === 'events' ? 'linkOn': 'linkOff'}
          onClick={() => handleTabClick("events")}
        >
          Events
        </a>
        <a
          href="/groups"
          className={activeTab === 'groups' ? 'linkOn': 'linkOff'}
          onClick={() => handleTabClick("groups")}
        >
          Groups
        </a>
            </div>
        <div className="eventsHeaderText">Events in Meetup</div>
      </div>
      {events.map((event) => (
              <div key={event.id}>
                <div className="eventsGridContainer" >
                  <img
                    className=" eventImages"
                    src={event.previewImage}
                  />
                  <div className="eventTextContainer">
                    <div className="eventTime">
                      <div>{event.startDate}</div>
                      <i
                        style={{
                          fontSize: "3px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        class="fa-solid fa-circle"
                      ></i>
                      <div>{event.startTime}</div>
                    </div>
                    <div className="eventName">{event.name}</div>
                    <div className=" eventLocation">
                      {event.Venues.city} {event.Venues.state}{" "}
                    </div>
                </div>
                <div className="eventDescription">{event.description}</div>
              </div>
                  </div>
            ))}
    </div>
  )
}
