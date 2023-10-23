import React from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { useDispatch, useSelector } from 'react-redux';
import { getGroups } from '../../store/group';
import { useEffect } from 'react';
import './GroupDetails.css'


export default function GroupDetails() {

    const dispatch = useDispatch()

    const {groupId} = useParams()


    const groups = useSelector((state) => state.groupReducer.groups);


    const group = groups.find(group => group.id == groupId)

    const handleOnClick = () => {
        window.alert('Feature Coming Soon...')
    }
    

    useEffect(() => {
        dispatch(getGroups());
      }, [dispatch]);

    if(!group) return null

  return (
    <div>

      <div>
        <i class="fa-solid fa-less-than"></i>
        <a href='/groups'> Groups </a>
      </div>

      <div className='groupDetailGridContainer'>
            <div>
                <img className='groupDetailsImages'src={group.previewImage}/>
            </div>
            <div className='groupDetailsTextContainer'>
                <div>
                    <h1>{group.name}</h1>
                </div>
                <div>
                    {group.city}, {group.state}
                </div>
                <div className="eventsprivateContainter">
                <div>## events</div>
                <i style={{fontSize:'3px', display:'flex', alignItems:'center'}} class="fa-solid fa-circle"></i>
                {group.private ? <div>Private</div> : <div>Public</div>}
              </div>
              <div>Organized by: First Name Last Name</div>
              <div>
                <button
                onClick={(e) => handleOnClick()}
                 className='groupDetailsButton'>Join this group</button>
              </div>
            </div>
        </div>
       
    </div>
  )
}
