import app from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
import "firebase/functions"
import "firebase/storage"

import config from "./config"

class Firebase {
    constructor() {
        app.initializeApp(config)

        this.auth = app.auth()
        this.db = app.firestore()
        this.functions = app.functions()
        this.storage = app.storage()
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
            .onSnapshot(onSnapshot, onError)
    }

    getProfile = ({ userId }) =>
        this.db.collection("profiles").where("userId", "==", userId).get()

    register = async ({ username, email, password }) => {
        const newUser = await this.auth.createUserWithEmailAndPassword(
            email,
            password
        )
        return this.db
            .collection("profiles")
            .doc(username)
            .set({ userId: newUser.user.uid })
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
