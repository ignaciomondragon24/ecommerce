const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../dao/models/userModel');

const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]),
  secretOrKey: 'nacho2004' // Cambia esto por una variable de entorno
};

passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id);
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

module.exports = passport;