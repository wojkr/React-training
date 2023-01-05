import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../config/firebase"
import { postSchema } from "./posts"

interface Props {
    post: postSchema
}

interface Like {
    userId: string,
    likeId: string
}

export const Post = (props: Props) => {
    const { post } = props
    const [user] = useAuthState(auth)
    const [likes, setLikes] = useState<Like[] | null>(null);
    const likesRef = collection(db, "likes")

    const likesDoc = query(likesRef, where("postId", "==", post.id))
    const getLikes = async () => {
        const data = await getDocs(likesDoc)
        console.log(data.docs.map(d => ({ ...d.data(), id: d.id })))
        setLikes(data.docs.map(d => ({ userId: d.data().userId, likeId: d.id })))
    }

    const addLike = async () => {
        try {
            const newDoc = await addDoc(likesRef, { userId: user?.uid, postId: post.id })
            if (user) {
                setLikes((prev) => prev ? [...prev, { userId: user?.uid, likeId: newDoc.id }] : [{ userId: user?.uid, likeId: newDoc.id }])
            }
        } catch (err) {
            console.log(err)
        }
    }
    const removeLike = async () => {
        try {
            const likeToDeleteQuery = query(likesRef, where("postId", "==", post.id), where("userId", "==", user?.uid))
            const likeToDeleteData = await getDocs(likeToDeleteQuery);
            const likeId = likeToDeleteData.docs[0].id;
            const likeToDelete = doc(db, 'likes', likeId)
            await deleteDoc(likeToDelete)
            if (user) {
                setLikes((prev) => prev && prev.filter(l => l.likeId !== likeId))
            }
        } catch (err) {
            console.log(err)
        }
    }

    const hasUserLiked = likes?.find(l => l.userId === user?.uid)

    useEffect(() => {
        getLikes()
    }, [])

    return <section className="post-container">
        <div className="post-title">
            <p className="post-title-text">
                <span className="post-title-text-username">@{post.username}:</span> {post.title}
            </p>
        </div>
        <hr />
        <div className="post-description">
            <p className="post-description-text">
                {post.description}
            </p>
        </div>
        <button onClick={hasUserLiked ? removeLike : addLike} className="post-btn-like">{hasUserLiked ? <>&#128078;</> : <>&#128077;</>}</button>
        {likes && <p>Likes: {likes?.length}</p>}
    </section>
}