import React from 'react'
import Component from './Component'
import {makeStyles, List, Divider, Paper, IconButton, Container } from '@material-ui/core'
import FormMakerAddButton from './FormMakerAddButton'
import EditDeleteBar from './EditDeleteBar'
import { connect } from 'react-redux'

const useStyles = makeStyles((theme) => ({
  sectionPaper: {
    backgroundColor: theme.palette.secondary.main,
    padding: theme.spacing(1),
    paddingTop: 0.3,
    width: '87%',
    height: '100%',
    marginBottom: 20
  }
}))


export default function Section({id, title, data}) {
  const classes = useStyles()
  const { componentsOrder, components, itemsOrder, items } = data

  return (
    <Paper className={classes.sectionPaper}>
      <EditDeleteBar 
        renderTitle={()=><h4>{title}</h4>}
        type={'section'}
        id ={id}/>
      <Divider/>
      <List>
      {
        (id in componentsOrder) ?
        componentsOrder[id].map(componentId => {
          return <Component key={componentId} id={componentId} title={components[componentId]} data={{itemsOrder, items}}/>
        })
        : null 
      }
      <FormMakerAddButton type="component"/>
      </List>
    </Paper>
  )
}