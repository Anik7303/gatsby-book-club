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

        firebaseInstance.auth.onAuthStateChanged(userResult => {
            if (userResult) {
                firebaseInstance
                    .getProfile({ userId: userResult.uid })
                    .then(result => {
                        setUser({
                            ...userResult,
                            username: result.empty ? null : result.docs[0].id,
                        })
                        setLoading(false)
                    })
                    .catch(err => console.error({ err }))
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
