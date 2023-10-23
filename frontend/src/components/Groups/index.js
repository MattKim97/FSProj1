import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getGroups } from "../../store/group";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./Groups.css";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export default function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groupReducer.groups);
  const history = useHistory();

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);


  function handleOnClick(groupId) {
    history.push(`/groups/${groupId}`);
  }

  if (!groups || groups.length === 0) return null;

  return (
    <div className="groupsContainer">
      <div>
        <a href="/events">Events</a>
        <a href="/groups">Groups</a>
      </div>
      <div>
        <div>Groups in Meetup</div>
      </div>
      {groups.map((group) => (
        <div key={group.id} className="groupsList">
          <div className="groupsGridContainer" onClick={() => handleOnClick(group.id)}>
            {group.previewImage === "No preview available" ? (
              <img
                className="groupImages"
                src="https://www.penworthy.com/Image/Getimage?id=ItemImages\BigCover\9781685053703.jpg"
                alt="no preview"
              />
            ) : (
              <img
                className="groupImages"
                src={group.previewImage}
                alt="preview"
              />
            )}
            <div className="groupTextContainer">
              <div className="groupName">{group.name}</div>
              <div>
                Location: {group.city}, {group.state}
              </div>
              <div>About: {group.about}</div>
              <div className="eventsprivateContainter">
                <div>Events:</div>
                <i style={{fontSize:'3px', display:'flex', alignItems:'center'}} class="fa-solid fa-circle"></i>
                {group.private ? <div>Private</div> : <div>Public</div>}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
