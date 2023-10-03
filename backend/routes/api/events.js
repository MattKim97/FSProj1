const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationEvents} = require("../../utils/auth.js");


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
        if(image.length === 0){
            Events[i].previewImage = null
        } else {
            Events[i].previewImage = image[0].url
        }
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

router.get('/:eventId', async (req,res,next) => {

    const event = await Event.findByPk(req.params.eventId,{
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })

    if(!event){
        return res.status(404).json({message: "Event couldn't be found"})
    }

    const eventJSON = event.toJSON()

    const attendances = await event.getAttendances()

    eventJSON.numAttending = attendances.length

    const group = await event.getGroup({
        attributes: ['id','name','private','city','state']
    })

    const venue = await event.getVenue({
        attributes: ['id','address','city','state','lat','lng']
    })

    const images = await event.getEventImages({
        attributes: ['id','url','preview']
    })

    eventJSON.Group = group
    eventJSON.Venue = venue
    eventJSON.EventImages = images

    res.json(eventJSON)

})

router.post('/:eventId/images',requireAuth,requireAuthorizationEvents, async (req,res,next) => {
    const{url,preview} = req.body

    const event = await Event.findByPk(req.params.eventId,{
        attributes:{
            exclude: ['createdAt','updatedAt']
        }
    })

    if(!event){
        return res.status(404).json({message: "Event couldn't be found"})
    }

    const image = await event.createEventImage({
        url,
        preview
    })

    const imageObj = {
        id: image.id,
        url: image.url,
        preview: image.preview
    }


    res.json(imageObj)

})



module.exports = router;
