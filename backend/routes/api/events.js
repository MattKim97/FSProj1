const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Event, Group, Venue } = require('../../db/models');

const router = express.Router();

router.get('/', async (req,res,next) => {

    const preEvents = await Event.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })

     const Events = preEvents.map((event) => {
        const eventData = event.toJSON()
        return eventData;
    });

    for (let i = 0; i<preEvents.length; i++){
        const group = await preEvents[i].getGroup({ attributes:{
            exclude: ['createdAt','updatedAt']
        }});
        const venue = await preEvents[i].getVenue({ attributes:{
            exclude: ['createdAt','updatedAt']
        }});
        Events[i].Group = group
        if(venue.length === 0){
            Events[i].venueId = null
            Events[i].Venues = null
        }
        Events[i].Venues = venue
    }


    
    res.json({
        Events
    })

})


module.exports = router;
