export default {
  mongoUrl: process.env.MONGO_URL ?? 'mongodb://mongodb:27017/clean-node-api',
  port: process.env.PORT ?? 5050,
  jwtSecret: process.env.JWT_SECRET ?? 'lkj98fdas78f'
}
