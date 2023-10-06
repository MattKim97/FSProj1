const express = require('express');
const { Op, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationVenueMemOnly} = require("../../utils/auth.js");


const { Group, GroupImage , Membership , User , Venue, Organizer} = require('../../db/models');

const router = express.Router();

  const validateVenues = [
check('address')
    .exists({ checkFalsy: true })
    .withMessage('Street address is required'),
check('city')
    .exists({ checkFalsy: true })
    .withMessage("City is required"),
  check('state')
    .exists({ checkFalsy: true })
    .withMessage("State is required"),
  check('lat')
    .exists({ checkFalsy: true })
    .withMessage('Latitude is required')
    .isFloat({
      min: -180,
      max: 180
  })    
    .withMessage("Latitude is not valid"),
    check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required')
    .isFloat({
      min: -180,
      max: 180
  })    
    .withMessage("Longitude is not valid"),
    handleValidationErrors
  ]


  router.put('/:venueId', requireAuth, requireAuthorizationVenueMemOnly,validateVenues, async (req,res,next) => {

    const {address,city,state,lat,lng} = req.body

    const venue = await Venue.findByPk(req.params.venueId)

    if(!venue){
        return res.status(404).json({
            "message": "Venue couldn't be found"
        })
    }

    const updatedVenue = await venue.update({
        address,city,state,lat,lng
    })

    const VenueObj = {
        id: updatedVenue.id,
        groupId: updatedVenue.groupId,
        address,
        city,
        state,
        lat,
        lng
    }

    res.json(VenueObj)



})

  module.exports = router;
