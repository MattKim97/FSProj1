import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getGroup } from "../../store/group";

export default function EventsForm() {
  const { groupId } = useParams();

  const [eventName, setEventName] = useState("");

  const [eventType, setEventType] = useState("Select One");

  const [eventStatus, setEventStatus] = useState("Select One");

  const [eventPrice, setEventPrice] = useState(0);

  const [eventStartDate, setEventStartDate] = useState("");

  const [eventEndDate, setEventEndDate] = useState("");

  const [eventImage, setEventImage] = useState("");

  const [eventDescription, setEventDescription] = useState("");

  const [submit, setSubmit] = useState(false);

  const [errors, setErrors] = useState({});

  const group = useSelector((state) => state.groupReducer.group);

  const dispatch = useDispatch();

  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getGroup(groupId));
  }, [dispatch]);

  if (!group) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    let formErrors = {};

    if (eventName === "") {
      formErrors.eventName = "Name is required";
    }

    if (eventStatus == "Select One") {
      formErrors.eventStatus = "Event Type is required";
    }
    if (eventType == "Select One") {
      formErrors.eventType = "Visibility is required";
    }
    if (eventPrice == 0) {
      formErrors.eventPrice = "Price is required";
    }

    if (eventStartDate === "") {
      formErrors.eventStartDate = "Event start is required";
    }

    if (eventEndDate === "") {
      formErrors.eventEndDate = "Event end is required";
    }

    if (
      !eventImage.endsWith(".jpg") &&
      !eventImage.endsWith(".png") &&
      !eventImage.endsWith(".jpeg") &&
      !eventImage.endsWith(".jpg")
    ) {
      formErrors.eventImage = "Image URL must end in .png,.jpg, or .jpeg";
    }
    if (eventDescription.length < 30) {
      formErrors.eventDescription = "Description needs 50 or more characters";
    }

    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <section>
          <h1>Create an event for {group.name}</h1>
          <label>What is the name of your event?</label>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className=""
          />
          {errors.eventName && (
            <div className="groupFormErrors">{errors.eventName}</div>
          )}
        </section>

        <section>
          <label>Is this an in person or online event?</label>
          <select
            id="eventType"
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className=""
          >
            <option value="Select One">Select One</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {errors.eventType && (
            <div className="groupFormErrors">{errors.eventType}</div>
          )}

          <label>Is this group private or public?</label>

          <select
            value={eventStatus}
            className=""
            onChange={(e) => setEventStatus(JSON.parse(e.target.value))}
          >
            <option value="Select One">Select One</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          {errors.eventStatus && (
            <div className="groupFormErrors">{errors.eventStatus}</div>
          )}

          <label>What is the price for your event?</label>
          <input
            type="number"
            placeholder="0"
            className=""
            value={eventPrice}
            onChange={(e) => setEventPrice(e.target.value)}
          />
          {errors.eventPrice && (
            <div className="groupFormErrors">{errors.eventPrice}</div>
          )}
        </section>

        <section>
          <label>When does your event start?</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY HH/mm AM"
            className=""
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
          />
          {errors.eventStartDate && (
            <div className="groupFormErrors">{errors.eventStartDate}</div>
          )}

          <label>When does your event end?</label>
          <input
            type="text"
            placeholder="MM/DD/YYYY HH/mm PM"
            className=""
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />
            {errors.eventEndDate && (
            <div className="groupFormErrors">{errors.eventEndDate}</div>
          )}
        </section>
        <section>
          <label>Please add an image URL for your event below:</label>
          <input
            type="text"
            className="groupImageInput"
            placeholder="Image URL"
            value={eventImage}
            onChange={(e) => setEventImage(e.target.value)}
          />
              {errors.eventImage && (
            <div className="groupFormErrors">{errors.eventImage}</div>
          )}
        </section>
        <section>
          <label>Please describe your event:</label>
          <textarea
            placeholder="Please include at least 30 characters"
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
          />
            {errors.eventDescription && (
            <div className="groupFormErrors">{errors.eventDescription}</div>
          )}
        </section>

        <button className="createGroupButton" type="submit">
          Create Event
        </button>
      </form>
    </div>
  );
}
