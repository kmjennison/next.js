import Link from 'next/link'
import {
  init as initAuth,
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth'

const isServerSide = typeof window === 'undefined'
initAuth({
  // onAuthStateChanged: () => {},
  // authRequiredRedirectURL: '/auth',
  // appRedirectURL: '/demo',
  // Don't set the Firebase admin config on the client side.
  ...(isServerSide && {
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // https://stackoverflow.com/a/41044630/1332513
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
  }),
  firebaseClientInitConfig: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  },
  cookies: {
    cookieName: 'myDemo',
  },
})

const Demo = (props) => {
  const AuthUser = useAuthUser()
  return (
    <div>
      <p>
        This page is does not require user auth, so it won't redirect to the
        login page if you are not signed in.
      </p>
      <p>
        If you remove getServerSideProps from this page, the page will be static
        and load the authed user on the client side.
      </p>
      {AuthUser.id ? (
        <p>You're signed in. Email: {AuthUser.email}</p>
      ) : (
        <p>
          You are not signed in.{' '}
          <Link href={'/auth'}>
            <a>Sign in</a>
          </Link>
        </p>
      )}
      <Link href={'/'}>
        <a>Home</a>
      </Link>
    </div>
  )
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser({ authRequired: false })(Demo)
