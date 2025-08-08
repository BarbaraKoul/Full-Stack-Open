const app = require('./app') 
const config = require('./utils/config')
const info = require('./utils/loggers')


app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})