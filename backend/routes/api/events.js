const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const {
  requireAuth,
  requireAuthorizationGroup,
  requireAuthorizationVenue,
  requireAuthorizationEvents,
  requireAuthorizationEventsHostsOnly,
} = require("../../utils/auth.js");

const {
  Event,
  Group,
  Venue,
  Attendance,
  User,
  Membership,
} = require("../../db/models");

const router = express.Router();

const validateEvents = [
  check("venueId")
    // .exists({ checkFalsy: true })
    // .withMessage('Venue must be provided')
    .custom(async (value) => {
      if (value == null) return true;

      const venues = await Venue.findByPk(value);

      if (!venues) throw new Error("Venue does not exist");

      return true;
    }),
  check("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a type.")
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("capacity")
    .exists({ checkFalsy: true })
    .withMessage("Capacity is required")
    .isInt()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    .withMessage("Price is required")
    .isDecimal()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .withMessage("Start date is required")
    .isAfter(new Date().toLocaleDateString())
    .withMessage("Start date must be in the future"),
  check("endDate")
    .exists({ checkFalsy: true })
    .withMessage("End date is required")
    .isAfter(this.startDate)
    .withMessage("End date is less than start date"),

  handleValidationErrors,
];

const validateQuery = [
  check("page")
    .custom((value) => {
      if (!value) return true;

      if (value > 0) return true;

      // if (value > 10) {
      //     value = 10
      //     return true
      // }

      return false;
    })
    .withMessage("Page must be greater than or equal to 1")
    .custom((value) => {
      if (!value) return true;

      if (isNaN(value)) return false;
      else return true;
    })
    .withMessage("Page must be a integer"),
  check("size")
    .custom((value) => {
      if (!value) return true;

      if (value > 0) return true;
 

      return false;
    })
    .withMessage("Page must be greater than or equal to 1")
    .custom((value) => {
      if (!value) return true;

      if (isNaN(value)) return false;
      else return true;
    })
    .withMessage("Page must be a integer"),
  check("name")
    .custom((value) => {
      if (!value) return true;
      if (isNaN(value)) return true;
      else return false;
    })
    .withMessage("Name must be a string"),
  check("type")
    .custom((value) => {
      if (!value) return true;
      if (value == "Online" || value == "In person") return true;
      else return false;
    })
    .withMessage("Type must be 'Online' or 'In person'"),
  check("startDate")
    .custom((value) => {
      if (!value) return true;

      if (isNaN(new Date(value).getTime())) {
        return false;
      }
      return true;
    })
    .withMessage("Start date must be a valid datetime"),

  handleValidationErrors,
];

router.get("/", validateQuery, async (req, res, next) => {
  let { page, size, name, type, startDate } = req.query;

  const whereObj = {};

  const pagination = {};

  if (!size) {
    size = 20;
  }
  if (!page) {
    page = 1;
  }

  if (size > 20) {
    size = 20;
  }

  if (page > 10) {
    page = 10;
  }

  pagination.limit = size;
  pagination.offset = size * (page - 1);

  if (name) {
    whereObj.name = name;
  }

  if (type) {
    whereObj.type = type;
  }

  if (startDate) {
    whereObj.startDate = startDate;
  }

  const preEvents = await Event.findAll({
    where: { ...whereObj },
    attributes: {
      exclude: ["createdAt", "updatedAt", "capacity", "price"],
    },
    ...pagination,
  });

  const Events = preEvents.map((event) => {
    const eventData = event.toJSON();
    return eventData;
  });

  for (let i = 0; i < preEvents.length; i++) {
    const group = await preEvents[i].getGroup({
      attributes: ["id", "name", "city", "state"],
      // exclude: ['createdAt','updatedAt']
    });
    const venue = await preEvents[i].getVenue({
      attributes: {
        exclude: ["createdAt", "updatedAt", "groupId", "address", "lat", "lng"],
      },
    });

    const image = await preEvents[i].getEventImages();

    const startHours = ("0" + new Date(Events[i].startDate).getHours()).slice(
      -2
    );
    const startMinutes = (
      "0" + new Date(Events[i].startDate).getMinutes()
    ).slice(-2);
    const startSeconds = (
      "0" + new Date(Events[i].startDate).getSeconds()
    ).slice(-2);

    const endHours = ("0" + new Date(Events[i].endDate).getHours()).slice(-2);
    const endMinutes = ("0" + new Date(Events[i].endDate).getMinutes()).slice(
      -2
    );
    const endSeconds = ("0" + new Date(Events[i].endDate).getSeconds()).slice(
      -2
    );
    Events[i].startDate = new Date(Events[i].startDate)
      .toISOString()
      .slice(0, 10);
    Events[i].startTime = startHours + ":" + startMinutes + ":" + startSeconds;
    Events[i].endDate = new Date(Events[i].endDate).toISOString().slice(0, 10);
    Events[i].endTime = endHours + ":" + endMinutes + ":" + endSeconds;

    const attendances = await preEvents[i].getAttendances({
      where: { status: "attending" },
    });
    Events[i].numAttending = attendances.length;
    if (image.length === 0) {
      Events[i].previewImage = null;
    } else {
      Events[i].previewImage = image[0].url;
    }
    Events[i].Group = group;
    if (venue.length === 0) {
      Events[i].venueId = null;
      Events[i].Venues = null;
    }
    Events[i].Venues = venue;
  }

  res.json({
    Events,
  });
});

router.get("/:eventId/attendees", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const user = req.user;

  const group = await event.getGroup();

  const membership = await group.getMemberships({
    where: {
      userId: user.id,
    },
  });

  let object = {
    Attendees: [],
  };

  if (membership.length == 0) {
    if (user.id == group.organizerId) {
      const attendees = await event.getAttendances({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const attendeesJSON = attendees.map((attendee) => {
        const attendeeData = attendee.toJSON();
        return attendeeData;
      });

      for (const attendee of attendeesJSON) {
        const user = await User.findByPk(attendee.userId);

        const newUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: {
            status: attendee.status,
          },
        };

        object.Attendees.push(newUser);
      }
    } else {
      const attendees = await event.getAttendances({
        where: {
          status: {
            [Op.not]: "pending",
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const attendeesJSON = attendees.map((attendee) => {
        const attendeeData = attendee.toJSON();
        return attendeeData;
      });

      for (const attendee of attendeesJSON) {
        const user = await User.findByPk(attendee.userId);

        const newUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: {
            status: attendee.status,
          },
        };

        object.Attendees.push(newUser);
      }
    }
  } else {
    if (user.id == group.organizerId || membership[0].status == "co-host") {
      const attendees = await event.getAttendances({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const attendeesJSON = attendees.map((attendee) => {
        const attendeeData = attendee.toJSON();
        return attendeeData;
      });

      for (const attendee of attendeesJSON) {
        const user = await User.findByPk(attendee.userId);

        const newUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: {
            status: attendee.status,
          },
        };

        object.Attendees.push(newUser);
      }
    } else {
      const attendees = await event.getAttendances({
        where: {
          status: {
            [Op.not]: "pending",
          },
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      const attendeesJSON = attendees.map((attendee) => {
        const attendeeData = attendee.toJSON();
        return attendeeData;
      });

      for (const attendee of attendeesJSON) {
        const user = await User.findByPk(attendee.userId);

        const newUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          Attendance: {
            status: attendee.status,
          },
        };

        object.Attendees.push(newUser);
      }
    }
  }

  return res.json(object);
});

router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const user = req.user;

  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const group = await event.getGroup();

  const membership = await group.getMemberships({
    where: {
      userId: user.id,
    },
  });

  if (!membership.length) {
    return res.status(403).json({ message: "Forbidden" });
  } else if (membership[0].status == "pending") {
    return res.status(403).json({ message: "Forbidden" });
  } else {
    const attendance = await event.getAttendances({
      where: {
        userId: user.id,
      },
    });
    if (attendance.length) {
      if (attendance[0].status == "pending") {
        res
          .status(400)
          .json({ message: "Attendance has already been requested" });
      } else {
        res
          .status(400)
          .json({ message: "User is already an attendee of the event" });
      }
    } else {
      await event.createAttendance({
        userId: user.id,
        status: "pending",
      });

      res.json({
        userId: user.id,
        status: "pending",
      });
    }
  }
});

router.put(
  "/:eventId/attendance",
  requireAuth,
  requireAuthorizationEventsHostsOnly,
  async (req, res, next) => {
    const { userId, status } = req.body;

    const event = await Event.findByPk(req.params.eventId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const attendance = await user.getAttendances({
      where: {
        eventId: event.id,
      },
    });

    if (!attendance.length) {
      return res
        .status(404)
        .json({
          message: "Attendance between the user and the event does not exist",
        });
    }

    if (status == "pending") {
      return res
        .status(404)
        .json({ message: "Cannot change an attendance status to pending" });
    }

    if (status == "attending" && attendance[0].status == "attending") {
      return res
        .status(404)
        .json({ message: "User is already attending event" });
    }

    await attendance[0].update({
      userId,
      status,
    });

    const updatedAttendance = {
      id: attendance[0].id,
      eventId: event.id,
      userId,
      status,
    };

    res.json({ updatedAttendance });
  }
);

router.get("/:eventId", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    attributes: {
      exclude: ["createdAt", "updatedAt"],
    },
  });

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const eventJSON = event.toJSON();

  const startHours = ("0" + new Date(eventJSON.startDate).getHours()).slice(-2);
  const startMinutes = ("0" + new Date(eventJSON.startDate).getMinutes()).slice(
    -2
  );
  const startSeconds = ("0" + new Date(eventJSON.startDate).getSeconds()).slice(
    -2
  );

  const endHours = ("0" + new Date(eventJSON.endDate).getHours()).slice(-2);
  const endMinutes = ("0" + new Date(eventJSON.endDate).getMinutes()).slice(-2);
  const endSeconds = ("0" + new Date(eventJSON.endDate).getSeconds()).slice(-2);

 eventJSON.startDate = new Date(eventJSON.startDate)
    .toISOString()
    .slice(0, 10);
 eventJSON.startTime = startHours + ":" + startMinutes + ":" + startSeconds;
 eventJSON.endDate = new Date(eventJSON.endDate).toISOString().slice(0, 10);
 eventJSON.endTime = endHours + ":" + endMinutes + ":" + endSeconds;

  const attendances = await event.getAttendances();

  eventJSON.numAttending = attendances.length;

  const group = await event.getGroup({
    attributes: ["id", "name", "private", "city", "state"],
  });

  const venue = await event.getVenue({
    attributes: ["id", "address", "city", "state", "lat", "lng"],
  });

  const images = await event.getEventImages({
    attributes: ["id", "url", "preview"],
  });

  eventJSON.Group = group;
  eventJSON.Venue = venue;
  eventJSON.EventImages = images;

  res.json(eventJSON);
});

router.post(
  "/:eventId/images",
  requireAuth,
  requireAuthorizationEvents,
  async (req, res, next) => {
    const { url, preview } = req.body;

    const event = await Event.findByPk(req.params.eventId, {
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const image = await event.createEventImage({
      url,
      preview,
    });

    const imageObj = {
      id: image.id,
      url: image.url,
      preview: image.preview,
    };

    res.json(imageObj);
  }
);

router.put(
  "/:eventId",
  requireAuth,
  requireAuthorizationEventsHostsOnly,
  validateEvents,
  async (req, res, next) => {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const venues = await Venue.findByPk(venueId);

    if (!venues) {
      return res.status(404).json({ message: "Venue couldn't be found" });
    }

    const event = await Event.findByPk(req.params.eventId, {});

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    const updatedEvent = await event.update({
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    });

    const updatedEventObj = {
      id: updatedEvent.id,
      groupId: updatedEvent.groupId,
      venueId: updatedEvent.venueId,
      startDate: new Date(startDate).toISOString().slice(0, 10),
      endDate: new Date(endDate).toISOString().slice(0, 10),
      venueId,
      name,
      type,
      capacity,
      price,
      description,
    };

    res.json(updatedEventObj);
  }
);

router.delete("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const currentUser = req.user;

  const { userId } = req.body;

  const event = await Event.findByPk(req.params.eventId, {});

  if (!event) {
    return res.status(404).json({ message: "Event couldn't be found" });
  }

  const user = await User.findByPk(userId);

  const group = await event.getGroup();

  const attendance = await user.getAttendances({
    where: {
      eventId: event.id,
    },
  });

  if (!attendance.length) {
    return res
      .status(404)
      .json({ message: "Attendance does not exist for this User" });
  }

  if (currentUser.id == group.organizerId) {
    await attendance[0].destroy();

    res.json({ message: "Successfully deleted attendance from event" });
  } else if (currentUser.id == userId) {
    await attendance[0].destroy();

    res.json({ message: "Successfully deleted attendance from event" });
  } else {


    return res
      .status(403)
      .json({ message: "Only the User or organizer may delete an Attendance" });
  }
});

router.delete(
  "/:eventId",
  requireAuth,
  requireAuthorizationEventsHostsOnly,
  async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {});

    if (!event) {
      return res.status(404).json({ message: "Event couldn't be found" });
    }

    await event.destroy();

    res.json({
      message: "Successfully deleted",
    });
  }
);

module.exports = router;
