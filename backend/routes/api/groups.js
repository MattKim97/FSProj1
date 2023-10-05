const express = require('express');
const { Op, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth, requireAuthorizationGroup, requireAuthorizationVenue} = require("../../utils/auth.js");


const { Group, GroupImage , Membership , User , Venue, Organizer, Event} = require('../../db/models');
const venue = require('../../db/models/venue');

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
      .isIn(['Online','In person'])
      .withMessage("Type must be 'Online' or 'In person'"),
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

  const validateEvents = [
    check('venueId')
        // .exists({ checkFalsy: true })
        // .withMessage('Venue must be provided')
        .custom(async value => {

            if (value == null) return true

            const venues = await Venue.findByPk(value)

            if (!venues) throw new Error ("Venue does not exist")

            return true
        }),
    check('name')
        .exists({ checkFalsy: true })
        .withMessage("Name is required")
        .isLength({ min: 5})
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a type.')
        .isIn(['Online','In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('capacity')
        .exists({ checkFalsy: true })
        .withMessage('Capacity is required')
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .withMessage('Price is required')
        .isDecimal()
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check('startDate')
        .exists({ checkFalsy: true })
        .withMessage("startDate is required")
        .isAfter(new Date().toLocaleDateString())
        .withMessage("startDate must be in the future"),
    check('endDate')
        .exists({ checkFalsy: true })
        .isAfter(this.startDate)
        .withMessage("End date is less than start date"),

    handleValidationErrors

]


router.post('/', requireAuth,validateGroups, async (req,res,next) => {
    const {name,about,type,private,city,state} = req.body

    const user = req.user
   
    const group = await Group.create({
        organizerId: user.id,
        name,
        about,
        type,
        private,
        city,
        state
})

res.json(group)

})


router.post('/:groupId/images',requireAuth,requireAuthorizationGroup, async (req,res,next) => {

    const {url , preview} = req.body

    const group = await Group.findOne({
        where:{
            id: req.params.groupId
        }
    })

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

   const image = await group.createGroupImage({
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

router.put('/:groupId',requireAuth,requireAuthorizationGroup,validateGroups, async (req,res,next) => {
const {name,about,type,private,city,state} = req.body

const group = await Group.findOne({
    where :{
        id: req.params.groupId
    }
})

if(!group){
    return res.status(404).json({
        "message": "Group couldn't be found"
    })
}

const updatedGroup = await group.update({
    name,about,type,private,city,state
})

res.json(updatedGroup)

})

router.put('/:groupId/membership',requireAuth, async (req,res,next) => {

    const {memberId, status} = req.body

    const user = req.user;

    const group = await Group.findByPk(req.params.groupId)

    const otherUser = await User.findByPk(memberId)

    const userMembershipStatus = await group.getMemberships({
        where: {
            userId : user.id
        }
    })

    const otherUserMembershipStatus = await group.getMemberships({
        where: {
            userId : memberId
        }
    })

    if(otherUserMembershipStatus.length === 0){
        return res.status(404).json({
            "message": "Membership between the user and the group does not exist"
        })
    }

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    if(!otherUser){
        return res.status(400).json({
            message: 'Validations Error',
            errors: {
                status: "User couldn't be found"
            }
        })
    }

    if(status == 'pending'){
        return res.status(400).json({
            message: 'Validations Error',
            errors: {
                status: "Cannot change a membership status to pending"
            }
        })
    }

    if(status == 'member'){
        if(user.id !== group.organizerId ||userMembershipStatus[0].status !== 'co-host' ){
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
    }
    if(status == 'co-host'){
        if(user.id !== group.organizerId){
            return res.status(403).json({
                message: 'Forbidden'
            })
        }
    }

    const updatedMembership = await otherUserMembershipStatus[0].update({
        memberId,status
    })

    const updatedMembershipObj = {
        id:  updatedMembership.id,
        groupId: updatedMembership.groupId,
        memberId,
        status
    }

    res.json(updatedMembershipObj)

})

router.delete('/:groupId/membership',requireAuth, async (req,res,next) => {
    const user = req.user

    const {memberId} = req.body

    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const deleteUser = await User.findByPk(memberId)

    if (!deleteUser){
        return res.status(400).json({
            "message": "Validation Error",
            "errors": {
              "memberId": "User couldn't be found"
            }
          })
    }

    const deleteUserMembership = await group.getMemberships({
        where:{
            userId : memberId
        }
    })

    if(deleteUserMembership.length === 0){
        return res.status(404).json({
            "message": "Membership does not exist for this User"
          })
    }

    if(!user.id === memberId || user.id !== group.organizerId){
        return res.status(403).json({
            message: 'Forbidden'
        })
    }

    await deleteUserMembership[0].destroy()

    res.json({
        "message": "Successfully deleted membership from group"
    })



})

router.delete('/:groupId',requireAuth,requireAuthorizationGroup, async (req,res,next) => {
    const group = await Group.findOne({
        where :{
            id: req.params.groupId
        }
    })

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    await group.destroy()

    res.json({
        "message": "Successfully deleted"
    })

})





router.get('/', async (req,res,next) => {
    const groups = await Group.findAll({
    })


    const groupsJSON = groups.map((group) => {
        const groupData = group.toJSON()
        return groupData;
    });

    const groupIds = groupsJSON.map((group) => group.id);

    const members = await Membership.findAll({
    })

    const membersJSON = members.map((member) => {
        const memberData = member.toJSON()
        return memberData;
    });

    groupsJSON.forEach((group) => {
        const groupId = group.id;
        const groupMembers = membersJSON.filter((member) => member.groupId === groupId);
        const nonpendingMembers = groupMembers.filter((member) =>{
            return member.status == 'co-host' || member.status == 'member'
        })
        group.numMembers = nonpendingMembers.length;
    });


    const images = await GroupImage.findAll()

    for(let i = 0; i < groupsJSON.length; i++){
        for(let j = 0; j<images.length; j++)
        if(images[j].groupId == groupsJSON[i].id){
            if(images[j].preview === true){
            groupsJSON[i].previewImage = images[j].url
            } else {
                groupsJSON[i].previewImage = 'No preview available'
            }
        }
    }

    res.json({Groups:groupsJSON})
})

router.get('/current', requireAuth, async (req, res, next) => {
    const user = req.user;
    
    const memberGroups = await Group.findAll({
        include: {
            model: Membership,
            where: {
                userId: user.id,
                status: {
                    [Op.in]: ['co-host', 'member']
                }
            },
            attributes: []
        }
    });

    const ownedGroups = await Group.findAll({
        where: {
            organizerId: user.id
        }
    });

    const uniqueGroupIds = new Set();

    memberGroups.forEach((group) => {
        uniqueGroupIds.add(group.id);
    });

    ownedGroups.forEach((group) => {
        uniqueGroupIds.add(group.id);
    });

    const groupData = await Group.findAll({
        where: {
            id: {
                [Op.in]: [...uniqueGroupIds]
            }
        }
    });

    const groups = groupData.map((group) => {
        const groupData = group.toJSON()
        return groupData;
    });

    const groupIds = groups.map((group) => group.id);
    
    const members = await Membership.findAll({
        where: {
            groupId: {
                [Op.in]: groupIds
            },
            status: {
                [Op.in]: ['co-host', 'member']
            }
        }
    });

    const membersJSON = members.map((member) => member.toJSON());

    groups.forEach((group) => {
        const groupId = group.id;
        const groupMembers = membersJSON.filter((member) => member.groupId === groupId);
        group.numMembers = groupMembers.length;
    });

    const images = await GroupImage.findAll();

    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < images.length; j++) {
            if (images[j].groupId == groups[i].id) {
                if (images[j].preview === true) {
                    groups[i].previewImage = images[j].url;
                } else {
                    groups[i].previewImage = 'No preview available';
                }
            }
        }
    }

    res.json({ Groups: [...groups] });
});

router.get('/:groupId/events',async (req,res,next) => {

    const group = await Group.findByPk(req.params.groupId, {
        attributes: ['id','name','city','state']
    })

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const preEvents = await group.getEvents({
        attributes:{
        exclude: ['createdAt','updatedAt','description','capacity','price']
        }
    })

    // const attendances = await Events.getAttendances()
    // const image = await Events.getEventImage()
    // const venue = await Events.getVenue()

    const Events = preEvents.map((event) => {
        const eventData = event.toJSON()
        return eventData;
    });

    for (let i = 0; i<Events.length; i++){

        const venue = await preEvents[i].getVenue({ attributes:{
            exclude: ['createdAt','updatedAt','groupId','address','lat', 'lng']
        }});

        const attendances = await preEvents[i].getAttendances({where:{status: 'attending'}})
        const image = await preEvents[i].getEventImages()
        // res.json(image)
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


    res.json({Events:Events})

})



router.get('/:groupId/venues', requireAuth, requireAuthorizationVenue, async (req,res,next) => {

    
    const group = await Group.findOne({
        where :{
            id: req.params.groupId
        },
    })

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const venue = await Venue.findAll({
        where:{
            groupId: req.params.groupId
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    })

    res.json({
        "Venues":venue
    })

})

router.get('/:groupId/members',async (req,res,next) => {
    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const members = await group.getMemberships()

    const object = {
        Members : []
    }
    const user = req.user

    if(user.id == group.organizerId){
    for (let i = 0; i<members.length; i++){
        
        const user = await User.findByPk(members[i].userId)


        const userObj = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            Membership: {
                status: members[i].status
            }
        }
        object.Members.push(userObj)
    }
}  else {

    const trueMembers = await group.getMemberships({
        where: {
            status:{
                [Op.in]:['co-host','member']
            }
        }
    })

    for (let i = 0; i<trueMembers.length; i++){

    const user = await User.findByPk(trueMembers[i].userId)

    
    const userObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        Membership: {
            status: trueMembers[i].status
        }
    }

    object.Members.push(userObj)
}

}

    res.json(object)

})

router.post('/:groupId/membership', requireAuth, async (req,res,next)=>{
    
    const group = await Group.findByPk(req.params.groupId)

    const user = req.user

    
    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const membership = await group.getMemberships({
        where:{
            userId : user.id
        }
    })

    if(membership.length === 0){

        await group.createMembership({
            userId: user.id,
            status: "pending"
        })
    
        const memRequestObj = {
            memberId: user.id,
            status: "pending"
        }
    
       return res.json(memRequestObj)
    }

    else if(membership[0].status == "pending"){
        return res.status(400).json({message: "Membership has already been requested"})
    }
    else if(membership){
        return res.status(400).json({message: "User is already a member of the group"})
    }


})

router.post('/:groupId/venues', requireAuth, requireAuthorizationVenue, validateVenues, async (req,res,next) => {
    const {address,city,state,lat,lng} = req.body


    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const venue = await group.createVenue({
        address,city,state,lat,lng
    })

    const venueObj = {
        id: venue.id,
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    }

    res.json(venueObj)


})

router.post('/:groupId/events', requireAuth, requireAuthorizationVenue, validateEvents, async (req,res,next) => {

    const {venueId,name,type,capacity,price,description,startDate,endDate} = req.body

    // const venue = await Venue.findByPk(req.body.venueId)

    // if(!venue){
    //     res.send(400).json({'venueId': 'Venue does not exist'})
    // }


    const group = await Group.findByPk(req.params.groupId)

    if(!group){
        return res.status(404).json({
            "message": "Group couldn't be found"
        })
    }

    const newEvent = await group.createEvent({
        venueId,name,type,capacity,price,description,startDate,endDate
    })

    const newEventObj = {
        id: newEvent.id,
        groupId: newEvent.groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    }

    res.json(newEventObj)

})


router.get('/:groupId', async (req,res,next) => {




    const group = await Group.findOne({
     where:{
        id: req.params.groupId
     } , 
     include: [
        {
          model: GroupImage,
          attributes: ['id', 'url', 'preview']
        },
        {
          model: User, as: 'Organizer',
          attributes:['id','firstName','lastName']
        },
        {
          model: Venue,
          attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        }
      ]
    })

    if(group){

    const groupJSON = group.toJSON()



    const members = await Membership.findAll({
        where:{
            groupId: group.id,
            status: {
                [Op.in]: ['co-host', 'member']
            }
        }
    })

        
    const numbermembers = members.length
    
    groupJSON.numMembers = numbermembers
    
    res.json(groupJSON)
} else {
    return res.status(404).json({"message": "Group couldn't be found",})
}




})

module.exports = router;
