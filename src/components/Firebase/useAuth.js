import { useState, useEffect } from "react"

import getFirebaseInstance from "./firebase"

const useAuth = () => {
    const [user, setUser] = useState({})
    const [firebase, setFirebase] = useState(null)
    const [loading, setLoading] = useState(true)

    // console.log({ firebase, user, loading })

    useEffect(() => {
        let unsubscribe
        let profileUnsubscribe

        const firebaseInstance = getFirebaseInstance()
        setFirebase(firebaseInstance)

        unsubscribe = firebaseInstance.auth.onAuthStateChanged(userResult => {
            if (userResult) {
                profileUnsubscribe = firebaseInstance.getProfile({
                    userId: userResult.uid,
                    onSnapshot: snapshot => {
                        // This uses firebase custom claims and firebase functions
                        // because this is run on a free tier project, firebase functions are not available
                        // that's why this portion is commented out and an alternative appoarch is taken
                        // firebaseInstance.auth.currentUser
                        //     .getIdTokenResult(true)
                        //     .then(token => {
                        //         setUser({
                        //             uid: userResult.uid,
                        //             email: userResult.email,
                        //             username: snapshot.empty
                        //                 ? null
                        //                 : snapshot.docs[0].id,
                        //             isAdmin: token.claims.admin,
                        //         })
                        //         setLoading(false)
                        //     })
                        setUser({
                            uid: userResult.uid,
                            email: userResult.email,
                            isAdmin:
                                !snapshot.empty &&
                                snapshot.docs[0].data().isAdmin,
                            username: snapshot.empty
                                ? null
                                : snapshot.docs[0].id,
                        })
                        setLoading(false)
                    },
                })
            } else {
                setUser(null)
                setLoading(false)
            }
        })

        return () => {
            if (unsubscribe) unsubscribe()
            if (profileUnsubscribe) profileUnsubscribe()
        }
    }, [])

    return { user, firebase, loading }
}

export default useAuth
