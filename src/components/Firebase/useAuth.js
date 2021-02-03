import { useState, useEffect } from "react"

import getFirebaseInstance from "./firebase"

const useAuth = () => {
    const [user, setUser] = useState(null)
    const [firebase, setFirebase] = useState(null)
    const [loading, setLoading] = useState(true)

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
                        console.log({ snapshot, userResult })
                        setUser({
                            uid: userResult.uid,
                            email: userResult.email,
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
