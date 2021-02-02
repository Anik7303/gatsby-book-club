import { useState, useEffect } from "react"

const useComments = ({ firebase, bookId }) => {
    const [comments, setComments] = useState([])
    const [error, setError] = useState(null)

    useEffect(() => {
        let unsubscribe
        if (firebase) {
            unsubscribe = firebase.subscribeToComments({
                bookId,
                onSnapshot: snapshot => {
                    const temp = []
                    snapshot.forEach(doc =>
                        temp.push({
                            id: doc.id,
                            ...doc.data(),
                        })
                    )
                    setComments(temp)
                },
                onError: err => setError(err),
            })
        }

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [firebase, bookId])

    return { comments, error }
}

export default useComments
