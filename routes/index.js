const routes = require('express').Router();


const LeaveRoutes = require('./Leave/index');

routes.use('/leave', LeaveRoutes);
module.exports = routes;