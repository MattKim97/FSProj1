import React from "react";
import "./Home.css";

export default function Home() {
  return (
    <div className="gridContainer">
      <div className="textContainer">
        <h1 className="textHeader">The people platform — Where interests become friendships</h1>
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
      <div className="textBodySecond">
        <h2>How Meetup Works! </h2>
        <p>Since 2002, members have used Meetup to make new friends, meet like-minded people, spend time on hobbies, and connect with locals over shared interests.</p>
      </div>
    </div>
  );
}
