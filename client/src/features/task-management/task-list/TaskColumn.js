import React from 'react'
import { connect } from 'react-redux'
import TaskCard from './TaskCard'
import TaskAddButton from './TaskAddButton'
import { Droppable } from 'react-beautiful-dnd'
import { Avatar, Grid, Typography } from '@material-ui/core'

/**
  Displays all the columns in the Task Manager. Each column belongs to a specific CCA user with
  their names as the title of the column.

  @param {string} ownerId id of a CCA user who owns the column
  @param {number} taskData from the corresponding redux slice, to retrieve all the data related
  the a particular owner to pass them on and populate the column.
  @param {object} ccaDetails from the corresponding redux slice, to retrieve all the data of the CCA users for 
  each column and pass it on to the sub components
*/

const columnStyle = {
  backgroundColor: '#dfe3e6',
  padding: 8,
  borderRadius: 3,
  width: 200,
  height: '100%',
  marginRight: 8,
  marginLeft: 3
}

export function TaskColumn({ownerId, taskData, ccaDetails}) {
  return (
    <div style={columnStyle}>
      {
        ccaDetails.map((ccaUserObj) => {
          if (ownerId === ccaUserObj.ccaId) { // if the ownerId matches a ccaUserObj Id then print the ccaUser name for TM column header
            return (
              <div>
                <Grid container direction="row">
                  <Avatar src={ccaUserObj.picture} style={{marginTop: 5, height: 17, width: 17}}/>
                  <Typography variant="h6" style={{marginLeft: 3}}>
                    {ccaUserObj.firstName + " " + ccaUserObj.lastName}
                  </Typography>
                </Grid>
              </div>
            )
          }
        })
      } 
      <Droppable droppableId={String(ownerId)}>
      {
        (provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {
              taskData.taskList.map((taskObj, index) => {
                if ((ownerId === taskObj.ownerId && taskObj.archive === false) || 
                (ownerId === taskObj.ownerId && taskObj.taskId[0] ==='s' && taskObj.check !== true)) {
                  return (
                    <TaskCard taskId={taskObj.taskId} index={index} key={taskObj.taskId}/>
                  )
                }
              })
            }
            {provided.placeholder}
            <TaskAddButton ownerId={ownerId} isColumn={false}/>
          </div>
        )
      }
      </Droppable>
    </div>
  )
}

const mapStateToProps = (state) => ({
  taskData: state.taskData,
  ccaDetails: state.ccaDetails.ccaList,
})

export default connect(mapStateToProps) (TaskColumn)
