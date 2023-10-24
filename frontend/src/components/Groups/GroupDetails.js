import React from "react";
import { useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { getGroup, getGroupEvents } from "../../store/group";
import { useEffect } from "react";
import "./GroupDetails.css";

export default function GroupDetails() {
  const dispatch = useDispatch();

  const { groupId } = useParams();

  const group = useSelector((state) => state.groupReducer.group);

  const sessionUser = useSelector((state) => state.session.user);

  const events = useSelector((state) => state.groupReducer.Events);

  const history = useHistory()

  const handleOnClick = () => {
    window.alert("Feature Coming Soon...");
  };

  const onClick = () => {
    history.push(`/events`)
  }

  useEffect(() => {
    dispatch(getGroup(groupId));
    dispatch(getGroupEvents(groupId));
  }, [dispatch]);

  if (!events) return null;

  // if (!group.length || !group) return null;

  return (
    <div>
      <div>
        <i class="fa-solid fa-less-than"></i>
        <a href="/groups"> Groups </a>
      </div>

      <div className="groupDetailGridContainer">
        <div>
          <img className="groupDetailsImages" src={group.GroupImages[0].url} />
        </div>
        <div className="groupDetailsTextContainer">
          <div>
            <h1>{group.name}</h1>
          </div>
          <div>
            {group.city}, {group.state}
          </div>
          <div className="eventsprivateContainter">
            <div>## events</div>
            <i
              style={{ fontSize: "3px", display: "flex", alignItems: "center" }}
              class="fa-solid fa-circle"
            ></i>
            {group.private ? <div>Private</div> : <div>Public</div>}
          </div>
          <div>
            Organized by: {group.Organizer.firstName} {group.Organizer.lastName}
          </div>
          <div>
            <button
              onClick={(e) => handleOnClick()}
              className={
                sessionUser
                  ? sessionUser.id === group.Organizer.id
                    ? "groupDetailsButtonGone"
                    : "groupDetailsButton"
                  : "groupDetailsButtonGone"
              }
            >
              Join this group
            </button>
            {sessionUser
              ? sessionUser.id === group.Organizer.id && (
                  <div className="groupOwnerButtonsContainer">
                    <button className="groupOwnerButtons">Create event</button>
                    <button className="groupOwnerButtons">Update event</button>
                    <button className="groupOwnerButtons">Delete event</button>
                  </div>
                )
              : null}
          </div>
        </div>
      </div>

      <div className="groupDetailsBottom">
        <div>
          <h2>Organizer</h2>
          <div>
            {group.Organizer.firstName} {group.Organizer.lastName}
          </div>
        </div>

        <div>
          <h2>What we're about</h2>
          <div>{group.about}</div>
        </div>

        <div>
          <h2>Upcoming Events({events.length})</h2>
          <div className="groupDetailsBottom">
            {events.map((event) => (
              <div key={event.id}>
                <div className="groupEventDetailGridContainer" onClick={(e) => onClick()}>
                  <img
                    className="groupDetailsBottom groupEventImg"
                    src={event.previewImage}
                  />
                  <div className="groupDetailsBottom">
                    <div className="groupDetailsTime">
                      <div>{event.startDate}</div>
                      <i
                        style={{
                          fontSize: "3px",
                          display: "flex",
                          alignItems: "center",
                          backgroundColor: "#CCCCCC"
                        }}
                        class="fa-solid fa-circle"
                      ></i>
                      <div>{event.startTime}</div>
                    </div>
                    <div className="groupDetailsName">{event.name}</div>
                    <div className="groupDetailsLocation">
                      {event.Venues.city} {event.Venues.state}{" "}
                    </div>
                </div>
                <div className="groupEventBottom groupDetailsEventsDescription">{event.description}</div>
              </div>
                  </div>
            ))}
          </div>
        </div>

        <div>
          <h2>Past Events:</h2>
          <div>Past Events</div>
        </div>
      </div>
    </div>
  );
}
