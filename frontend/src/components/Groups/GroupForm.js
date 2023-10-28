import React from "react";
import "./Groups.css";
import { useState } from "react";
import { createAGroup } from "../../store/group";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getGroups } from "../../store/group";
import { createAGroupImage } from "../../store/group";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

export default function GroupForm() {
  const sessionUser = useSelector((state) => state.session.user);

  const groups = useSelector((state) => state.groupReducer.groups);

  const history = useHistory();

  const [city, setCity] = useState("");

  const [state, setState] = useState("");

  const [groupName, setGroupName] = useState("");

  const [groupPurpose, setGroupPurpose] = useState("");

  const [groupType, setGroupType] = useState("Select One");

  const [groupStatus, setGroupStatus] = useState("Select One");

  const [groupImage, setGroupImage] = useState("");

  const [submit, setSubmit] = useState(false);

  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);

  if (!groups.length) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    let formErrors = {};

    if (city === "") {
      formErrors.city = "City is required";
    }
    if (state === "") {
      formErrors.state = "State is required";
    }
    if (groupName === "") {
      formErrors.groupName = "Name is required";
    }
    if (groupName.length > 50) {
      formErrors.groupName = "Name should be less than 50 characters";
    }
    if (groupPurpose.length < 50) {
      formErrors.groupPurpose = "Description needs 50 or more characters";
    }
    if (
      !groupImage.endsWith(".jpg") &&
      !groupImage.endsWith(".png") &&
      !groupImage.endsWith(".jpeg") &&
      !groupImage.endsWith(".jpg")
    ) {
      formErrors.groupImage = "Image URL must end in .png,.jpg, or .jpeg";
    }
    if (groupStatus == "Select One") {
      formErrors.groupStatus = "Group Type is required";
    }
    if (groupType == "Select One") {
      formErrors.groupType = "Visibility is required";
    }

    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const createdGroup = {
      organizerId: sessionUser.id,
      name: groupName,
      about: groupPurpose,
      type: groupType,
      private: groupStatus,
      city,
      state,
    };

    const response = await dispatch(createAGroup(createdGroup));

    if (response) {
      const createdGroupImage = {
        groupId: response.id,
        url: groupImage,
        preview: true,
      };
     await dispatch(createAGroupImage(response.id, createdGroupImage));

      setCity("");
      setState("");
      setGroupName("");
      setGroupPurpose("");
      setGroupType("In Person");
      setGroupStatus("In Person");
      setGroupImage("");
      history.push(`/groups/${response.id}`);
    }


  };

  return (
    <div>
      <form className="groupFormContainer" onSubmit={onSubmit}>
        <h1 className="addALineUnderneatch">Start a New Group</h1>

        <section className="addALineUnderneatch">
          <h2>Set your group's location</h2>
          <p>
            Meetup groups meet locally, in person, and online. We'll connect you
            with people in your area.
          </p>

          <input
            type="text"
            placeholder="City"
            className="locationInput"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="text"
            placeholder="STATE"
            className="locationInput"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
          {errors.city && <div className="groupFormErrors">{errors.city}</div>}
          {errors.state && (
            <div className="groupFormErrors">{errors.state}</div>
          )}
        </section>

        <section className="addALineUnderneatch">
          <h2>What will your group's name be?</h2>
          <p>
            Choose a name that will give people a clear idea of what the group
            is about. Feel free to get creative! You can edit this later if you
            change your mind.
          </p>

          <input
            type="text"
            placeholder="What is your group name?"
            className="groupNameInput"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          {errors.groupName && (
            <div className="groupFormErrors">{errors.groupName}</div>
          )}
        </section>

        <section className="addALineUnderneatch">
          <h2>Describe the purpose of your group</h2>
          <p>
          People will see this when we promote your group, but you'll be able
          to add to it later, too.<br></br>
        1. What's the purpose of the group?  <br></br>
        2. Who should join? <br></br>
        3. What will you do at your events?
          </p>

          <textarea
            placeholder="Please write at least 50 characters"
            value={groupPurpose}
            onChange={(e) => setGroupPurpose(e.target.value)}
            className="groupDescriptionInput"
          />
          {errors.groupPurpose && (
            <div className="groupFormErrors">{errors.groupPurpose}</div>
          )}
        </section>

        <section className="groupTypeSelectSection">
          <h2>Final Steps...</h2>
          <label>Is this an in-person or online group?</label>
          <select
            id="groupType"
            name="groupType"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className="groupTypeSelect"
          >
            <option value="Select One">Select One</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {errors.groupType && (
            <div className="groupFormErrors">{errors.groupType}</div>
          )}
        </section>

        <section className="groupTypeSelectSection">
          <label>Is this group private or public?</label>
          <select
            value={groupStatus}
           className="groupTypeSelect"
            onChange={(e) => setGroupStatus(JSON.parse(e.target.value))}
          >
            <option value="Select One">Select One</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          {errors.groupStatus && (
            <div className="groupFormErrors">{errors.groupStatus}</div>
          )}
        </section>
        <section className="groupTypeSelectSection addALineUnderneatch">
          <label>Please add an image URL for your group below:</label>
          <input
            type="text"
            id="groupImage"
            name="groupImage"
            className="groupImageInput"
            placeholder="Image URL"
            value={groupImage}
            onChange={(e) => setGroupImage(e.target.value)}
          />
          {errors.groupImage && (
            <div className="groupFormErrors">{errors.groupImage}</div>
          )}
        </section>

        <button className='createGroupButton' type="submit">Create Group</button>
      </form>
    </div>
  );
}
