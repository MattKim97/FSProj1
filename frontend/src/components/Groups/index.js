import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getGroups } from "../../store/group";
import { useDispatch } from "react-redux";
import './Groups.css'


export default function Groups() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groupReducer.groups);
  

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  if (!groups || groups.length === 0) return null;

  return (
    <div>
    <div>
        <a href ='/events'>Events</a>
        <a href ='/groups'>Groups</a>
    </div>
    <div>
        <div>
        Groups in Meetup
        </div>
    </div>
      {groups.map((group) => (
        <div key={group.id} className="groupsList">
          <div>
            <img src={group.previewImage} />
            <div>{group.previewImage}</div>
            <div>Name: {group.name}</div>
            <div>Location: {group.city}, {group.state}</div>
            <div>About: {group.about}</div>
            <div>Events:</div>
           {group.private ? <div>Private</div> : <div>Public</div> }
          </div>
        </div>
      ))}
    </div>
  );
}
