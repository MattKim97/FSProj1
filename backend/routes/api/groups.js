const express = require('express');
const { Op, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { Group, GroupImage , Membership} = require('../../db/models');

const router = express.Router();
router.get('/', async (req,res,next) => {
    const groups = await Group.findAll({
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

module.exports = router;
