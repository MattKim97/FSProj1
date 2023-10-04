const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationEvents, requireAuthorizationEventsHostsOnly} = require("../../utils/auth.js");
const { Event, Group, Venue, Attendance, User, Membership, EventImage} = require('../../db/models');


const { GroupImage } = require('../../db/models');

const router = express.Router();

router.delete('/:imageId',requireAuth,async (req,res,next) => {

    const user = req.user
    
    const membership = await user.getMemberships()

    const image = await GroupImage.findByPk(req.params.imageId)

    if(!image){
        return res.status(404).json({message: "Group Image couldn't be found"})
    }

    const group = await image.getGroup()
    
    if(user.id !== group.organizerId || membership[0].status !== 'co-host'){
        return res.status(403).json({message: "Forbidden"})
    } else {
        await image.destroy()
        res.json({
            "message": "Successfully deleted"
        })
    }
})



module.exports = router;
