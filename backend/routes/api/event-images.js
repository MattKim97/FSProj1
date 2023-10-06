const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationEvents, requireAuthorizationEventsHostsOnly} = require("../../utils/auth.js");
const { Event, Group, Venue, Attendance, User, Membership, } = require('../../db/models');

const { EventImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId',requireAuth,async (req,res,next) => {

    const user = req.user
    
    const membership = await user.getMemberships()

    const image = await EventImage.findByPk(req.params.imageId)

    if(!image){
        return res.status(404).json({message: "Event Image couldn't be found"})
    }

    const event = await image.getEvent()

    const group = await event.getGroup()

    if(membership.length !== 0){
        if(membership[0].status == "co-host"){
            await image.destroy()
            return res.json({
                "message": "Successfully deleted"
            })
        }
      } 
    if(user.id === group.organizerId) {
            await image.destroy()
            return res.json({
                "message": "Successfully deleted"
            })
      } else {
        return res.status(403).json({message: "Forbidden"})
    }
})


module.exports = router;
