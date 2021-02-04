import app from "firebase/app"
import "firebase/auth"
import "firebase/storage"
import "firebase/firestore"
import "firebase/functions"

import config from "./config"

class Firebase {
    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
        this.storage = app.storage()
        this.db = app.firestore()
        this.functions = app.functions()
    }

    /*
    // uses firebase functions
    createBook = ({ title, summary, bookCover, authorId }) => {
        const createBookCallable = this.functions.httpsCallable("createBook")
        return createBookCallable({ title, summary, bookCover, authorId })
    }
    */

    getAuthors = () => {
        return this.db.collection("authors").get()
    }

    /*
    // uses firebase functions
    addAuthor = ({ name }) => {
        const addAuthorCallable = this.functions.httpsCallable("addAuthor")
        return addAuthorCallable({ name })
    }
    */

    addAuthor = async ({ name }) => {
        console.log({ auth: this.auth })
        this.checkAuthentication(true)
        this.dataValidation({ name }, { name: "string" })

        const exists = await this.db
            .collection("authors")
            .where("name", "==", name)
            .limit(1)
            .get()

        if (!exists.empty) {
            throw new Error("This author already exists")
        }

        return this.db.collection("authors").add({ name })
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
        this.checkAuthentication()

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
        console.log({ check: email === process.env.GATSBY_ADMIN_EMAIL, email })
        return this.db
            .collection("profiles")
            .doc(username)
            .set({
                userId: user.user.uid,
                isAdmin: email === process.env.GATSBY_ADMIN_EMAIL,
            })
    }

    login = ({ email, password }) =>
        this.auth.signInWithEmailAndPassword(email, password)

    logout = () => this.auth.signOut()

    checkAuthentication = (admin = false) => {
        if (!this.auth.currentUser) {
            throw new Error("You need to be signed in to access this feature")
        }
        if (
            admin &&
            this.auth.currentUser.email !== process.env.GATSBY_ADMIN_EMAIL
        ) {
            throw new Error("You are not authorized to access this feature")
        }
    }

    dataValidation = (data, keyValues) => {
        if (Object.keys(data).length !== Object.keys(keyValues).length) {
            throw new Error("Invalid number of properties provided")
        }
        for (let key in data) {
            if (!keyValues[key] || typeof data[key] !== keyValues[key]) {
                throw new Error(`${key} contains invalid datatype`)
            }
        }
    }
}

let instance

const getInstance = () => {
    if (!instance) {
        instance = new Firebase()
    }
    return instance
}

export default getInstance
