import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth, db } from "../../config/firebase"
import { postSchema } from "./posts"
import { FormEditPost } from "./formEditPost"


interface Props {
    post: postSchema
}

interface Like {
    userId: string,
    likeId: string
}
interface postSchema1 {
    id: string,
    userId: string,
    username: string,
    description: string,
    title: string
}

export const Post = (props: Props) => {
    let { post } = props
    const [newPost, setNewPost] = useState(post)
    const [oldPost, setOldPost] = useState(post)

    const [user] = useAuthState(auth)

    const [likes, setLikes] = useState<Like[] | null>(null);
    const likesRef = collection(db, "likes")

    const [editMode, setEditMode] = useState<boolean>(false)

    //-----------------------------------------------------------------THE POST PART
    const likesDoc = query(likesRef, where("postId", "==", post.id))
    const getLikes = async () => {
        console.log("in post.tsx -- FIREBASE -- gettingDoc")
        const data = await getDocs(likesDoc)
        setLikes(data.docs.map(d => ({ userId: d.data().userId, likeId: d.id })))
    }

    const addLike = async () => {
        try {
            console.log("in post.tsx -- FIREBASE -- addingDoc")
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
            console.log("in post.tsx -- FIREBASE -- gettingDoc & deletingDoc")
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

    const isUserAuthor = (post.userId === user?.uid)
    const goToEdit = () => {
        setEditMode(prev => !prev)
    }

    useEffect(() => {
        console.log("in post.tsx in useEffect...")
        getLikes()
    }, [])

    return (!editMode ?
        //-----------------------------------------POST
        <section className="post-container" key={newPost.id}>
            <div className="post-title">
                <p className="post-title-text">
                    <span className="post-title-text-username">@{newPost.username}:</span> {newPost.title}
                </p>
            </div>
            <hr />
            <div className="post-description">
                <p className="post-description-text">
                    {newPost.description}
                </p>
            </div>
            <button onClick={hasUserLiked ? removeLike : addLike} className="post-btn-like">{hasUserLiked ? <>&#128078;</> : <>&#128077;</>}</button>
            {likes && <p>Likes: {likes?.length}</p>}
            {isUserAuthor && <button onClick={goToEdit}>Edit {editMode ? 'editMode ON' : 'editMode OFF'}</button>}
        </section>
        :
        //-----------------------------------------EDIT
        <FormEditPost
            setEditMode={setEditMode}
            oldPost={oldPost}
            newPost={newPost}
            setNewPost={setNewPost}
            setOldPost={setOldPost}
            postId={post.id}
        />
    )
}