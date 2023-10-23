import React from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch, useSelector } from "react-redux";
import { getGroup } from "../../store/group";
import { useEffect } from "react";
import "./GroupDetails.css";

export default function GroupDetails() {
  const dispatch = useDispatch();

  const { groupId } = useParams();

  const group = useSelector((state) => state.groupReducer.group)
  console.log("🚀 ~ file: GroupDetails.js:14 ~ GroupDetails ~ group:", group)

  const sessionUser = useSelector(state => state.session.user);
  console.log("🚀 ~ file: GroupDetails.js:16 ~ GroupDetails ~ sessionUser:", sessionUser)
  
    const handleOnClick = () => {
    window.alert("Feature Coming Soon...");
  };

  useEffect(() => {
    dispatch(getGroup(groupId));
  }, [dispatch]);

  if (!group) return null;

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
          <div>Organized by: {group.Organizer.firstName} {group.Organizer.lastName}</div>
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
            {sessionUser ? sessionUser.id === group.Organizer.id && (
            <div className="groupOwnerButtonsContainer">
            <button className="groupOwnerButtons">Create event</button>
            <button className="groupOwnerButtons">Update event</button>
            <button className="groupOwnerButtons">Delete event</button>
            </div>
            ): null}
                
          </div>
        </div>
      </div>

      <div className="groupDetailsBottom">

        <div>
          <h2 >Organizer</h2>
          <div >{group.Organizer.firstName} {group.Organizer.lastName}</div>
        </div>

        <div>
          <h2>What we're about</h2>
          <div>{group.about}</div>
        </div>

        <div>
            <h2>Upcoming Events</h2>
            <div>Events</div>
        </div>

        <div>
            <h2>Past Events</h2>
            <div>Past Events</div>
        </div>

      </div>
    </div>
  );
}
