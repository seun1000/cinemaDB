const vars = require('../../../../configs/vars')
const { Users } = require(vars.dirs.models)
const { Unauthorised } = require(vars.dirs.configs+"/errors")

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body
    const userData = await Users.findOne( { username } )
    if(!userData) {
      throw new Unauthorised("Invalid credentials")
    }
    const passwordCheck = userData.matchPassword(password)
    if(!passwordCheck) {
      throw new Unauthorised("Invalid credentials")
    }
    return res.json( { success: true, message: "Logged in successfull", token: userData.token() } )
  }
  catch(e) {
    return next(e)
  }
}

exports.register = async (req, res, next) => {
  try {
    const user = new Users(req.body)
    await user.save()
    return res.json(user)
  }
  catch(e) {
    return next(e)
  }
}
