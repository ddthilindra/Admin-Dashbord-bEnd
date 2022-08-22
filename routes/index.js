const routes = require('express').Router();

const userRoutes = require('./user/index');
const LeaveRoutes = require('./Leave/index');

routes.use('/user', userRoutes);
routes.use('/leave', LeaveRoutes);
module.exports = routes;