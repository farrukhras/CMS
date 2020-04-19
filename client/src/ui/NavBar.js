import React, { useState } from 'react'
import {Link} from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu'
import ListAltIcon from '@material-ui/icons/ListAlt'
import EditIcon from '@material-ui/icons/Edit'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import SettingsIcon from '@material-ui/icons/Settings'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import DonutSmallIcon from '@material-ui/icons/DonutSmall';
import { makeStyles } from '@material-ui/core/styles'
import {AppBar, Toolbar, IconButton, Drawer, Avatar, Typography, Container, Box, Grid} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    left: '30%',
  },
  drawerPaper: {
    backgroundColor: theme.palette.primary.main,
  },
  roundButton: {
    padding: 18,
    margin: 10,
  },
}))

export default function NavBar() {
  const classes = useStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  function toggleDrawer() {
    setDrawerOpen(!drawerOpen)
  }

  function RoundLinkButton({ link, icon, title }) {
    return (
      <Grid container direction='column' alignItems='center' style={{paddingBottom: 16}}>
        <Grid item xs>
          <Link to={link}>
            <IconButton color='primary' onClick={toggleDrawer} classes={classes.roundButton} style={{backgroundColor: 'white'}}>
              {icon}
            </IconButton>
          </Link>
        </Grid>
        <Grid item>
          <Typography color='secondary' variant="h6">
            <Box fontSize={12} m={1} marginTop={0.2}>
              {title}
            </Box>
          </Typography>
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      <AppBar position="static" style={{boxShadow: "none", background: 'linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(246,246,246,1) 82%,rgba(237,237,237,1) 100%)'}} >
        <Toolbar style={{minHeight: 30}} >
          <IconButton edge="start" onClick={toggleDrawer} >
            <MenuIcon />
          </IconButton>
          <Box display='flex' flexDirection='row' style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
            <DonutSmallIcon color="primary" fontSize='large' style={{marginTop: 4, paddingRight: 5}}/>
            <Typography>
              <Box color="black" fontSize={26} fontWeight={600}>
                {"CMS"}
              </Box>
            </Typography>
          </Box>
          <Container style={{
              marginLeft: '75%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
          }}>
            <Avatar
              style={{margin: 8}} 
              alt="User" 
              src="https://pbs.twimg.com/profile_images/1031129865590898689/AOratooC_400x400.jpg"
            />
            <Typography>
              <Box color="black" fontWeight={600} m={1}>
                {"Farrukh Rasool"}
              </Box>
            </Typography>
            <Link to='settings'>
              <IconButton edge="end" style={{padding: 10}}>
                <SettingsIcon/>
              </IconButton>
            </Link>
            <Link to='/'>
              <IconButton  edge="end" style={{padding: 10}}>
                <ExitToAppIcon />
              </IconButton>
            </Link>
          </Container>
        
        </Toolbar>
      </AppBar>
      <Drawer open={drawerOpen} onClose={toggleDrawer} classes={{paper: classes.drawerPaper}}>
        <br/>
        <br/>
        <br/>
        <RoundLinkButton link={'/'} icon={<VpnKeyIcon fontSize='large'/> } title={'Login'}/>
        <RoundLinkButton link={'/task-manager'} icon={<PlaylistAddCheckIcon fontSize='large'/>} title={'Task Manager'}/>
        <RoundLinkButton link={'/form-maker'} icon={<EditIcon fontSize='large'/>} title={'Form Maker'}/>
        <RoundLinkButton link={'/request-list'} icon={<ListAltIcon fontSize='large'/>} title={'Request List'}/>
      </Drawer>
    </div>
  )
}

