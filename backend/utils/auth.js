// backend/utils/auth.js
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User, Group , Membership, Venue, Event} = require('../db/models');

const { secret, expiresIn } = jwtConfig;

// Sends a JWT Cookie
const setTokenCookie = (res, user) => {
    // Create the token.
    const safeUser = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    const token = jwt.sign(
      { data: safeUser },
      secret,
      { expiresIn: parseInt(expiresIn) } // 604,800 seconds = 1 week
    );
  
    const isProduction = process.env.NODE_ENV === "production";
  
    // Set the token cookie
    res.cookie('token', token, {
      maxAge: expiresIn * 1000, // maxAge in milliseconds
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction && "Lax"
    });
  
    return token;
  };

  const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;
  
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
      if (err) {
        return next();
      }
  
      try {
        const { id } = jwtPayload.data;
        req.user = await User.findByPk(id, {
          attributes: {
            include: ['email', 'createdAt', 'updatedAt']
          }
        });
      } catch (e) {
        res.clearCookie('token');
        return next();
      }
  
      if (!req.user) res.clearCookie('token');
  
      return next();
    });
  };

  // If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    if (req.user) return next();
  
    const err = new Error('Authentication required');
    err.message = 'Authentication required';
    err.status = 401;
    return next(err);
  }

const requireAuthorizationGroup = async function (req,res,next){

  const user = req.user

  const group = await Group.findByPk(req.params.groupId)

  if(!group){
    return res.status(404).json({
        "message": "Group couldn't be found"
    })
}

  if(user.id === group.organizerId) return next()


 const err = new Error('Forbidden');
 err.message = 'Forbidden';
 err.status = 403;
 return next(err);
}

const requireAuthorizationVenue = async function (req,res,next){

  const user = req.user


  const group = await Group.findByPk(req.params.groupId)

  console.log(group)

  if(!group){
    return res.status(404).json({
        "message": "Group couldn't be found"
    })
  }

const membership = await group.getMemberships({
  where:{
    userId: user.id
  }
})

if(membership.length){
  if(membership[0].status == "co-host") return next()
} 
if(  user.id === group.organizerId
  ) {
    return next()
}

 const err = new Error('Forbidden');
 err.message = 'Forbidden';
 err.status = 403;
 return next(err);
}

const requireAuthorizationVenueMemOnly = async function (req,res,next){

  const user = req.user

  const venue = await Venue.findByPk(req.params.venueId)

  if(!venue){
    return res.status(404).json({
        "message": "Venue couldn't be found"
    })
}

const group = await venue.getGroup()

const membership = await group.getMemberships({
  where:{
    userId: user.id
  }
})


if(membership.length){
  if(membership[0].status == "co-host") return next()
} 
if(  user.id === group.organizerId
  ) {
    return next()
}

 const err = new Error('Forbidden');
 err.message = 'Forbidden';
 err.status = 403;
 return next(err);
}

const requireAuthorizationEvents = async function (req,res,next){

const user = req.user

const event = await Event.findByPk(req.params.eventId)


if(!event){
  return res.status(404).json({message: "Event couldn't be found"})
}

const group = await event.getGroup()

const membership = await group.getMemberships({
  where:{
    userId: user.id
  }
})

const attendance = await event.getAttendances({
  where:{
    userId: user.id
  }
})


if(membership.length){
  if(membership[0].status == "co-host") return next()
} 
if(  user.id === group.organizerId
  ) {
    return next()
}
if (attendance.length){
  if(attendance[0].status === "attending") return next()
}


 const err = new Error('Forbidden');
 err.message = 'Forbidden';
 err.status = 403;
 return next(err);
}

const requireAuthorizationEventsHostsOnly = async function (req,res,next){

  const user = req.user
  
  const event = await Event.findByPk(req.params.eventId)

  if(!event){
    return res.status(404).json({message: "Event couldn't be found"})
}
  
  const group = await event.getGroup()
  
  const membership = await group.getMemberships({
    where:{
      userId: user.id
    }
  })
  
  if(membership.length){
    if(membership[0].status == "co-host") return next()
  } 
  if (  user.id === group.organizerId
    ) {
      return next()
  }  
  
   const err = new Error('Forbidden');
   err.message = 'Forbidden';
   err.status = 403;
   return next(err);
  }

  module.exports = { setTokenCookie, restoreUser, requireAuth, requireAuthorizationGroup, requireAuthorizationVenue, requireAuthorizationVenueMemOnly, requireAuthorizationEvents, requireAuthorizationEventsHostsOnly};
