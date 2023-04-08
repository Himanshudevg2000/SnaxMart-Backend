const bcrypt = require('bcrypt');

const saltSounds = 10;

exports.generateNewPassword = text => bcrypt.hashSync(text, saltSounds);

exports.comparePassword = (text, hash) => bcrypt.compare(text, hash);
