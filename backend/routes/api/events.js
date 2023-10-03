const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Event, Group, Venue, Attendance } = require('../../db/models');

const router = express.Router();

router.get('/', async (req,res,next) => {

    const preEvents = await Event.findAll({
        attributes:{
            exclude: ['createdAt','updatedAt','description','capacity','price']
            }
    })

     const Events = preEvents.map((event) => {
        const eventData = event.toJSON()
        return eventData;
    });

    for (let i = 0; i<preEvents.length; i++){
        const group = await preEvents[i].getGroup({ 
            attributes: ['id','name','city','state']
            // exclude: ['createdAt','updatedAt']
        });
        const venue = await preEvents[i].getVenue({ attributes:{
            exclude: ['createdAt','updatedAt','groupId','address','lat', 'lng']
        }});

        const image = await preEvents[i].getEventImages()


        const attendances = await preEvents[i].getAttendances({where:{status: 'Attending'}})
        Events[i].numAttending = attendances.length
        Events[i].previewImage = image[0].url
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
