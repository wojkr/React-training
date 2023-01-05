import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore"
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

export const Post = (props: Props) => {
    const { post } = props
    const [editedPost, setEditedPost] = useState(post)
    const [editedPostDescription, setEditedPostDescription] = useState(post.description)
    const [editedPostTitle, setEditedPostTitle] = useState(post.title)
    const [user] = useAuthState(auth)
    const [likes, setLikes] = useState<Like[] | null>(null);
    const [editMode, setEditMode] = useState(false)
    const likesRef = collection(db, "likes")
    //-----------------------------------------------------------------THE POST PART
    const likesDoc = query(likesRef, where("postId", "==", post.id))
    const getLikes = async () => {
        console.log("in post.tsx -- FIREBASE -- gettingDoc")
        const data = await getDocs(likesDoc)
        // console.log(data.docs.map(d => ({ ...d.data(), id: d.id })))
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
        console.log("in post.tsx setting edit mode")
        console.log(editedPostTitle, editedPostDescription)
        setEditMode(prev => !prev)
    }


    // useEffect(() => {
    //     console.log("in post.tsx in useEffect...")
    //     getLikes()
    // }, [])
    useEffect(() => {
        console.log('UPDATE!!!!!')
        setEditedPostDescription(post.description)
        setEditedPostTitle(post.title)
    }, [editMode])

    console.log('in Post', post.id, likes)

    return (!editMode ?
        //-----------------------------------------POST
        <section className="post-container" key={post.id}>
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
            {isUserAuthor && <button onClick={goToEdit}>Edit {editMode ? 'editMode ON' : 'editMode OFF'}</button>}
        </section>
        :
        //-----------------------------------------EDIT
        // <form className="post-container">
        // <form className="post-container" onSubmit={handleSubmit(onEditPost)}>
        //     <p>Editing a post</p>
        //     <input {...register("title")} placeholder="Title..." value={editedPostTitle} onChange={(e) => setEditedPostTitle(e.target.value)} />
        //     <p className="edit-post-form-error">{errors.title?.message}</p>
        //     <textarea {...register("description")} onChange={(e) => setEditedPostDescription(e.target.value)} placeholder="Description..." value={editedPostDescription} />
        //     <p className="edit-post-form-error">{errors.description?.message}</p>
        //     <input type="submit" className="edit-post-form-btn" />
        //     <button onClick={goToEdit} type="button">go back</button>
        <FormEditPost
            setEditMode={setEditMode}
            editedPostTitle={editedPostTitle}
            setEditedPostTitle={setEditedPostTitle}
            editedPostDescription={editedPostDescription}
            setEditedPostDescription={setEditedPostDescription}
        />
        // </form>
    )
}