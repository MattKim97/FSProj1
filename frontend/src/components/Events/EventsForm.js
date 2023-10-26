import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { getGroup } from "../../store/group";
import { createAEvent,createAEventImage } from "../../store/event";
import "./Events.css"
import { getEvents } from "../../store/event";

export default function EventsForm() {
  const { groupId } = useParams();

  const [eventName, setEventName] = useState("");

  const [eventType, setEventType] = useState("Select One");

  const [eventCapacity, setEventCapacity] = useState(0);

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

  const events = useSelector((state) => state.eventReducer.events)

  useEffect(() => {
      dispatch(getEvents());
      dispatch(getGroup(groupId));

    }, [dispatch]);

  const history = useHistory()


  if (!group) return null;
  if(!events || events.length === 0) return null


  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmit(true);
    let formErrors = {};

    if (eventName === "") {
      formErrors.eventName = "Name is required";
    }

    if (eventCapacity == 0) {
      formErrors.eventCapacity = "Capacity is required";
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
      formErrors.eventDescription = "Description needs 30 or more characters";
    }

    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    const createdEvent = {
        venueId: group.Venues[0].id,
        groupId,
        name: eventName,
        description: eventDescription,
        type: eventType,
        capacity: eventCapacity,
        price: eventPrice,
        startDate: eventStartDate,
        endDate: eventEndDate
    }

    const response = await dispatch(createAEvent(createdEvent))

    if(response) {
        const createdEventImage = {
            eventId: response.id,
            url: eventImage,
            preview: true
        }
        dispatch(createAEventImage(response.id,createdEventImage))
        history.push(`/events/${response.id}`)
    }

    setEventName("");
    setEventType("In Person")
    setEventPrice(0)
    setEventCapacity(0)
    setEventStartDate("")
    setEventEndDate("")
    setEventImage("")
    setEventDescription("")


  };
  
  if(!sessionUser || sessionUser.id !== group.Organizer.id){
    history.push('/')
    return;
}

  return (
    <div>
      <form onSubmit={onSubmit} className="eventsFormContainer">
        <section className="eventsFormSections"> 
          <h1>Create an event for {group.name}</h1>
          <label>What is the name of your event?</label>
          <input
            type="text"
            placeholder="Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="eventsFormInputText"
          />
          {errors.eventName && (
            <div className="groupFormErrors">{errors.eventName}</div>
          )}
        </section>

        <section className="eventsFormSections">
          <label>Is this an in person or online event?</label>
          <select
            id="eventType"
            name="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="eventsFormSelection"
          >
            <option value="Select One">Select One</option>
            <option value="In person">In Person</option>
            <option value="Online">Online</option>
          </select>
          {errors.eventType && (
            <div className="groupFormErrors">{errors.eventType}</div>
          )}

          <label>What is the capacity for this event?</label>
          <input
            type="number"
            placeholder="0"
            className="eventsFormPrice"
            value={eventCapacity}
            onChange={(e) => setEventCapacity(e.target.value)}
          />

          {errors.eventCapacity && (
            <div className="groupFormErrors">{errors.eventCapacity}</div>
          )}

          <label>What is the price for your event?</label>
          <input
            type="number"
            placeholder="0"
            className="eventsFormPrice"
            value={eventPrice}
            onChange={(e) => setEventPrice(e.target.value)}
          />
          {errors.eventPrice && (
            <div className="groupFormErrors">{errors.eventPrice}</div>
          )}
        </section>

        <section className="eventsFormSections">
          <label>When does your event start?</label>
          <input
            type="text"
            placeholder="MM-DD-YYYY HH:mm"
            className="eventsFormDate"
            value={eventStartDate}
            onChange={(e) => setEventStartDate(e.target.value)}
          />
          {errors.eventStartDate && (
            <div className="groupFormErrors">{errors.eventStartDate}</div>
          )}

          <label>When does your event end?</label>
          <input
            type="text"
            placeholder="MM-DD-YYYY HH:mm"
            className="eventsFormDate"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />
            {errors.eventEndDate && (
            <div className="groupFormErrors">{errors.eventEndDate}</div>
          )}
        </section>
        <section className="eventsFormSections">
          <label>Please add an image URL for your event below:</label>
          <input
            type="text"
            placeholder="Image URL"
            value={eventImage}
            onChange={(e) => setEventImage(e.target.value)}
            className="eventsFormInputText"
          />
              {errors.eventImage && (
            <div className="groupFormErrors">{errors.eventImage}</div>
          )}
        </section>
        <section className="eventsFormSections">
          <label>Please describe your event:</label>
          <textarea
            placeholder="Please include at least 30 characters"
            value={eventDescription}
            className="eventsFormDescription"
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
