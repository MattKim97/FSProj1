import React from "react";
import "./Home.css";
import { useSelector } from "react-redux";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import SignupFormModal
 from "../SignupFormModal";
import { useState, useRef } from "react";

export default function Home() {
  const sessionUser = useSelector((state) => state.session.user);

  const [showModal, setShowModal] = useState(false);


  const signUpModal = () => {
    setShowModal(true)
  }

  return (
    <div style={{marginBottom:'50px'}}>
      
      <div className="gridContainer">
        <div className="textContainer">
          <h1 className="textHeader">
            The people platform — Where interests become friendships
          </h1>
          <div className="textBody">
            Whatever your interest, from hiking and reading to networking and
            skill sharing, there are thousands of people who share it on Meetup.
            Events are happening every day—sign up to join the fun.
          </div>
        </div>
        <div className="imageContainer">
          <img
            src="https://www.meetup.com/blog/wp-content/uploads/2020/08/holding-hands.jpg"
            alt="Meetup Image"
            className="meetupImage"
          />
        </div>
      </div>
      <div className="textBodySecond">
        <h2>How Meetup Works! </h2>
        <p>
          Since 2002, members have used Meetup to make new friends, meet
          like-minded people, spend time on hobbies, and connect with locals
          over shared interests.
        </p>
      </div>
      <div className="gridContainerSec3">
        <div>
          <img
            className="meetupGridImages"
            src="https://secure.meetupstatic.com/next/images/indexPage/blog/first_article.webp?w=384"
          />
          <a className="meetupGridLinks" href="/groups">
            See all groups
          </a>
          <p className="meetupGridText">
            Discover people who are just like you!
          </p>
        </div>
        <div>
          <img
            className="meetupGridImages"
            src="https://secure.meetupstatic.com/next/images/indexPage/blog/second_article.webp?w=384"
          />
          <a className="meetupGridLinks" href="/events">
            Find an event
          </a>
          <p className="meetupGridText">Discover events for people like you!</p>
        </div>
        <div>
          <img
            className="meetupGridImages"
            src="https://secure.meetupstatic.com/next/images/indexPage/blog/third_article.webp?w=384"
          />
          {sessionUser ? (
            <a className="meetupGridLinks" href="/groups/new">
              Create a group
            </a>
          ) : (
            <span className="meetupGridLinksDisabled">Create a group</span>
          )}{" "}
          <p className="meetupGridText">
            Don't see a group for your hobbies? Create your own!
          </p>
        </div>
      </div>
      {!sessionUser && (
      <div className="meetupButton">
        <button  onClick={(e)=> signUpModal()}className="meetupButtonStyle">Join Meetup</button>
      </div>
      )}
      {showModal && (
        <div className="modal">
      <SignupFormModal
        onClose={() => setShowModal(false)}
      />
      </div>
    )}
    </div>
  );
}
