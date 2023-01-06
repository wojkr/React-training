import { Dispatch, SetStateAction } from 'react';
import { useForm } from "react-hook-form"
import { doc, updateDoc } from "firebase/firestore"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { CreateFormData as EditedData } from "./create-form"
import { db } from '../../config/firebase';
import { postSchema } from './posts';

interface IProps {
    setEditMode: Dispatch<SetStateAction<boolean>>,
    setOldPost: Dispatch<SetStateAction<postSchema>>,
    setNewPost: Dispatch<SetStateAction<postSchema>>,
    oldPost: postSchema,
    newPost: postSchema,
    postId: string
}
export const FormEditPost = ({ setEditMode, setNewPost, setOldPost, oldPost, newPost, postId }: IProps) => {
    //------------------------------------------------------------------EDIT PART
    const schema = yup.object().shape({
        title: yup.string().required("you must add a title."),
        description: yup.string().required("you must add a description.")
    })

    const { register, handleSubmit, formState: { errors } } = useForm<EditedData>({
        resolver: yupResolver(schema)
    });

    const goToEdit = () => {
        setEditMode(prev => !prev)
    }

    const onEditPost = async (data: EditedData) => {
        const postRef = doc(db, 'posts', postId)
        if (oldPost.title !== newPost.title || oldPost.description !== newPost.description) {
            console.log("in formEditPost.tsx -- FIREBASE -- updatingDoc")
            await updateDoc(postRef, { ...data })
            setNewPost({ ...data, id: newPost.id } as postSchema)
            setOldPost({ ...data, id: newPost.id } as postSchema)
        } else {
            console.log('NO CHANGE')
            setNewPost(oldPost as postSchema)
        }
        goToEdit();
    }
    const onNoEdit = () => {
        setNewPost(oldPost as postSchema)
        goToEdit()
    }


    return (
        <form className="post-container" onSubmit={handleSubmit(onEditPost)}>
            <p>Editing a post</p>
            <input {...register("title")} placeholder="Title..." value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} />
            <p className="edit-post-form-error">{errors.title?.message}</p>
            <textarea {...register("description")} onChange={(e) => setNewPost({ ...newPost, description: e.target.value })} placeholder="Description..." value={newPost.description} />
            <p className="edit-post-form-error">{errors.description?.message}</p>
            <input type="submit" className="edit-post-form-btn" />
            <button className="edit-post-form-btn-back" onClick={onNoEdit} type="button">go back</button>
        </form>
    )
}