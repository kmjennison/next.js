import { setAuthCookies } from 'next-firebase-auth'

const handler = async (req, res) => {
  const { idToken, refreshToken, AuthUser } = await setAuthCookies(req)
  console.log('login result:', idToken, refreshToken, AuthUser)

  return res.status(200).json({ status: true })
}

export default handler
