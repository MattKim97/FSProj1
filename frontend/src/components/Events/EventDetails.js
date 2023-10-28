import React from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { getGroup } from "../../store/group";
import { useEffect } from "react";
import "./Events.css";
import { deleteAEvent, getEvent } from "../../store/event";
import { useState } from "react";

export default function EventDetails() {
  const dispatch = useDispatch();

  const { eventId } = useParams();

  const groups = useSelector((state) => state.groupReducer.groups);

  const event = useSelector((state) => state.eventReducer.event);

  const eventGroup = useSelector((state) => state.groupReducer.group);

  const sessionUser = useSelector((state) => state.session.user);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const history = useHistory();

  const handleGroupClick = () => {
      history.push(`/groups/${eventGroup.id}`)
  }


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onClickDelete = () => {
    openModal();
  };

  const handleDelete = () => {
    dispatch(deleteAEvent(eventId))
    history.push(`/groups/${eventGroup.id}`); 

  };

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
    <div className="eventDetailsPage">
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this event?</p>
            <div className="modalButtons">
              <button className="deleteButton" onClick={handleDelete}>
                Yes (Delete Event)
              </button>
              <button className="keepButton" onClick={closeModal}>
                No (Keep Event)
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="eventDetailsContainerPage">
        <div className="eventDetailsHeader">
          <div>
            <i style={{ fontSize: "10px" }} class="fa-solid fa-less-than"></i>
            <a href="/events"> Events </a>
          </div>
          <div style={{ fontSize: "24px", fontWeight: "bold" }}>
            {event.name}
          </div>
          <div style={{ color: "grey" }}>
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
            <div className="eventDetailsGroupDetails" onClick={(e) => handleGroupClick()}>
              <div>
                <img
                  className="eventDetailsGroupImage"
                  src={eventGroup.GroupImages[0].url}
                />
              </div>

              <div className="eventDetailsGroupDetailsText">
                <div style={{ fontSize: "large", fontWeight: "bold", backgroundColor:'white'}}>
                  {eventGroup.name}
                </div>
                <div style={{ color: "grey", backgroundColor:'white'}}>
                  {eventGroup.private ? "Private" : "Public"}
                </div>
              </div>
            </div>
            <div className="eventDetailsGridDetails">
              <div className="eventDetailsTime">
                <i class="fa-regular fa-clock"></i>
                <div>
                  <div className="eventDetailsTimes">
                    START{" "}
                    <span style={{ color: "teal", backgroundColor: "white" }}>
                      {event.startDate}
                    </span>{" "}
                    <i
                      style={{
                        fontSize: "3px",
                        display: "flex",
                        alignItems: "center",
                        color: "teal",
                        backgroundColor: "white",
                      }}
                      class="fa-solid fa-circle"
                    ></i>{" "}
                    <span style={{ color: "teal", backgroundColor: "white" }}>
                      {event.startTime}
                    </span>{" "}
                  </div>
                  <div className="eventDetailsTimes">
                    END{" "}
                    <span style={{ color: "teal", backgroundColor: "white" }}>
                      {event.endDate}
                    </span>{" "}
                    <i
                      style={{
                        fontSize: "3px",
                        display: "flex",
                        alignItems: "center",
                        color: "teal",
                        backgroundColor: "white",
                      }}
                      class="fa-solid fa-circle"
                    ></i>
                    <span style={{ color: "teal", backgroundColor: "white" }}>
                      {event.endTime}
                    </span>{" "}
                  </div>
                </div>
              </div>
              <div className="eventDetailsPrice">
                <div>
                  <i class="fa-solid fa-dollar-sign"></i> {event.price == 0 ? "FREE" : `$${event.price}`}
                </div>
              </div>
              <div className="eventDetailsType">
                <div>
                  <i class="fa-solid fa-map-pin"></i> {event.type}
                </div>
                {sessionUser &&
                  event &&
                  sessionUser.id == eventGroup.Organizer.id && (
                    <button
                      onClick={(e) => onClickDelete()}
                      className="eventDeleteButton"
                    >
                      Delete
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
        <div className="eventDetailsBottom">
          <div style={{ fontSize: "x-large", fontWeight: "bold" }}>Details</div>
          {event.description}
        </div>
      </div>
    </div>
  );
}
