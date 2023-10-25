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

  const onClickCreate = () => {
    history.push(`/groups/${groupId}/events/new`)
  }

  const handleOnClick = () => {
    window.alert("Feature Coming Soon...");
  };

  // const onClick = () => {
  //   history.push(`/events/${event.id}`)
  // }

  useEffect(() => {
    dispatch(getGroup(groupId));
    dispatch(getGroupEvents(groupId));
  }, [dispatch]);

  // if (!events.length) return null;

  if (!group) return null;
  if (!events) return null;

  events.sort((a, b) => {
    const startDateA = new Date(a.startDate);
    const startDateB = new Date(b.startDate);
    
    if (startDateA < startDateB) {
      return -1;
    }
    if (startDateA > startDateB) {
      return 1;
    }
    return 0;
  });

  const currentDate = new Date();

  const upcomingEvents = events.filter((event) => {
    const eventStartDate = new Date(event.startDate);
    return eventStartDate >= currentDate;
  });
  
  const pastEvents = events.filter((event) => {
    const eventStartDate = new Date(event.startDate);
    return eventStartDate < currentDate;
  });
  

  return (
    <div>
    <div className="groupDetailsEntireContainer">
      <div className="groupDetailsHeader">
        <i class="fa-solid fa-less-than"></i>
        <a style={{color:'teal'}} href="/groups"> Groups </a>
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
            <div> {events.filter((event) => group.id == event.groupId).length} events</div>
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
                    <button onClick={(e)=> onClickCreate()}className="groupOwnerButtons">Create event</button>
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
          {events.length > 0 ?  <h2>Upcoming Events({upcomingEvents.length})</h2> : <h2>No Upcoming Events</h2> }
          <div className="groupDetailsBottom">
            {upcomingEvents.map((event) => (
              <div key={event.id}>
                <div className="groupEventDetailGridContainer" onClick={(e) => history.push(`/events/${event.id}`)}>
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
          <div className="groupDetailsBottom">
            {pastEvents.map((event) => (
              <div key={event.id}>
                <div className="groupEventDetailGridContainer" onClick={(e) => history.push(`/events/${event.id}`)}>
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
      </div>
    </div>
    </div>
  );
}
