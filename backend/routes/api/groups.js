const express = require('express');
const { Op, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth} = require("../../utils/auth.js");


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

router.post('/:groupId/images',requireAuth, async (req,res,next) => {

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

router.put('/:groupId',requireAuth,validateGroups, async (req,res,next) => {
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

router.delete('/:groupId',requireAuth, async (req,res,next) => {
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
        const nonPendingMembers = groupMembers.filter((member) =>{
            return member.status == 'co-host' || member.status == 'member'
        })
        group.numMembers = nonPendingMembers.length;
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

    res.json(groupsJSON)
})

router.get('/current', requireAuth, async (req,res,next) => {

    user = req.user

    const groups = await Group.findAll({
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
    })

    const groupsJSON = groups.map((group) => {
        const groupData = group.toJSON()
        return groupData;
    });

    const groupIds = groupsJSON.map((group) => group.id);

    const members = await Membership.findAll({
        where:{
            groupId: {
                [Op.in]: groupIds
            },
            status: {
                [Op.in]: ['co-host', 'member']
            }
        }
    })

    const membersJSON = members.map((member) => {
        const memberData = member.toJSON()
        return memberData;
    });

    groupsJSON.forEach((group) => {
        const groupId = group.id;
        const groupMembers = membersJSON.filter((member) => member.groupId === groupId);
        group.numMembers = groupMembers.length;
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


    res.json(groupsJSON)


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
          model: User, as: 'Organizer'
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
