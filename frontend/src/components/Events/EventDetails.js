import React from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { getGroup } from "../../store/group";
import { useEffect } from "react";
import "./Events.css";
import { getEvent } from "../../store/event";

export default function EventDetails() {
  const dispatch = useDispatch();

  const { eventId } = useParams();

  const event = useSelector((state) => state.eventReducer.event);

  const eventGroup = useSelector((state) => state.groupReducer.group);

  useEffect(() => {
    dispatch(getEvent(eventId));
  }, [dispatch]);

  useEffect(() => {
    if (event && event.groupId) {
      dispatch(getGroup(event.groupId));
    }
  }, [dispatch, event]);

  if (!event || !eventGroup) return null;

  return (
    <div>
      <div className="eventDetailsContainerPage">
        <div className="eventDetailsHeader">
          <div>
            <i style={{fontSize:'10px'}} class="fa-solid fa-less-than"></i>
            <a href="/events" > Events </a>
          </div>
          <div style={{fontSize:'24px',fontWeight:'bold'}}>{event.name}</div>
          <div style= {{color:'grey'}}>
            Hosted by {eventGroup.Organizer.firstName}{" "}
            {eventGroup.Organizer.lastName}
          </div>
        </div>
        <div className="eventsDetailsGridContainer">
          <div>
            <img
              className="eventDetailsGridImage"
              src={event.EventImages[0].url}
            />
          </div>
          <div className="rightHandContainer">
            <div className="eventDetailsGroupDetails">
              <div>
                <img
                  className="eventDetailsGroupImage"
                  src={eventGroup.GroupImages[0].url}
                />
              </div>

              <div className="eventDetailsGroupDetailsText">
                <div style= {{fontSize:'large',fontWeight:'bold'}}>{eventGroup.name}</div>
                <div style={{color:'grey'}}>{eventGroup.private ? "Private" : "Public"}</div>
              </div>
            </div>
            <div className="eventDetailsGridDetails">
              <div className="eventDetailsTime">
                <div className="eventDetailsTimes">
                <i class="fa-regular fa-clock"></i>
                  START <span style={{ color: "teal" }}>{event.startDate}</span>{" "}
                  <i
                    style={{
                      fontSize: "3px",
                      display: "flex",
                      alignItems: "center",
                      color: "teal",
                    }}
                    class="fa-solid fa-circle"
                  ></i>{" "}
                  <span style={{ color: "teal" }}>{event.startTime}</span>{" "}
                </div>
                <div className="eventDetailsTimes">
                  END <span style={{ color: "teal" }}>{event.endDate}</span>{" "}
                  <i
                    style={{
                      fontSize: "3px",
                      display: "flex",
                      alignItems: "center",
                      color: "teal",
                    }}
                    class="fa-solid fa-circle"
                  ></i>
                  <span style={{ color: "teal" }}>{event.endTime}</span>{" "}
                </div>
              </div>
              <div className="eventDetailsPrice">
                <div><i class="fa-solid fa-dollar-sign"></i> {event.price}</div>
              </div>
              <div className="eventDetailsType">
                <div><i class="fa-solid fa-map-pin"></i> {event.type}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="eventDetailsBottom">
          <div style={{fontSize:'x-large',fontWeight:'bold'}}>Details</div>
          {event.description}
        </div>
      </div>
    </div>
  );
}
