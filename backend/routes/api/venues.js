const express = require('express');
const { Op, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationVenueMemOnly} = require("../../utils/auth.js");


const { Group, GroupImage , Membership , User , Venue, Organizer} = require('../../db/models');

const router = express.Router();

const validateGroups = [
    check('name')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a name.')
      .isLength({ min: 1, max: 60 })
      .withMessage("Name must be 60 characters or less"),
    check('about')
      .exists({ checkFalsy: true })
      .withMessage('Please provide an about blurb.')
      .isLength({ min: 50})
      .withMessage("About must be 50 characters or less"),
    check('type')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a type.')
      .isIn(['Online','In Person'])
      .withMessage("Type must be 'Online' or 'In Person'"),
    check('private')
      .exists({ checkFalsy: true })
      .withMessage('Please provide a private status.')
      .isBoolean()
      .withMessage("Private must be a boolean"),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
   handleValidationErrors
  ];

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
    .isDecimal()
    .withMessage("Latitude is not valid"),
    check('lng')
    .exists({ checkFalsy: true })
    .withMessage('Longitude is required')
    .isDecimal()
    .withMessage("Longitude is not valid"),
    handleValidationErrors
  ]


  router.put('/:venueId', requireAuth, validateVenues, async (req,res,next) => {

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
