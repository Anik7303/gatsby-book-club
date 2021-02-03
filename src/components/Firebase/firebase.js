import app from "firebase/app"
import "firebase/auth"
import "firebase/storage"
import "firebase/firestore"
// import "firebase/functions"

import config from "./config"

class Firebase {
    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
        this.storage = app.storage()
        this.db = app.firestore()
        // this.functions = app.functions()
    }

    /*
    // posting comments to firestore using firebase functions
    // because firebase functions is not available in free tier, this is commented out
    postComment = async ({ comment, bookId }) => {
        const postCommentCallable = this.functions.httpsCallable("postComment")
        return postCommentCallable({ comment, bookId })
    }
    */

    postComment = async ({ userId, bookId, comment }) => {
        const profile = await this.db
            .collection("profiles")
            .where("userId", "==", userId)
            .limit(1)
            .get()
        const bookRef = this.db.collection("books").doc(bookId)

        return this.db.collection("comments").add({
            content: comment,
            book: bookRef,
            user: profile.docs[0].id,
            created: new Date(),
        })
    }

    subscribeToComments = ({
        bookId,
        onSnapshot,
        onError = err => console.error(err),
    }) => {
        const bookRef = this.db.collection("books").doc(bookId)
        return this.db
            .collection("comments")
            .where("book", "==", bookRef)
            .orderBy("created", "desc")
            .onSnapshot(onSnapshot, onError)
    }

    getProfile = ({
        userId,
        onSnapshot,
        onError = err => console.error(err),
    }) =>
        this.db
            .collection("profiles")
            .where("userId", "==", userId)
            .limit(1)
            .onSnapshot(onSnapshot, onError)

    /*
    // creation of profile is move to firebase functions
    // but as firebase functions is not available in free tier, this is commented out

    register = async ({ username, email, password }) => {
        await this.auth.createUserWithEmailAndPassword(email, password)

        const createProfileCallable = await this.functions.httpsCallable(
            "createProfile"
        )

        return createProfileCallable({ username });
    }
    */

    register = async ({ username, email, password }) => {
        // checks if the provided username already exists in database
        const existingUsername = await this.db
            .collection("profiles")
            .doc(username)
            .get()
        if (existingUsername.exists) {
            throw new Error(
                "This username is already associated with an account. Please use a different username"
            )
        }

        // tries to create a new user using firebase auth with the provided email and password
        const user = await this.auth.createUserWithEmailAndPassword(
            email,
            password
        )

        // creates a profiles associated with the newly created user and returns the promise
        return this.db
            .collection("profiles")
            .doc(username)
            .set({ userId: user.user.uid })
    }

    login = ({ email, password }) =>
        this.auth.signInWithEmailAndPassword(email, password)

    logout = () => this.auth.signOut()
}

let instance

const getInstance = () => {
    if (!instance) {
        instance = new Firebase()
    }
    return instance
}

export default getInstance
