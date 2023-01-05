import React, { Dispatch, SetStateAction } from 'react';
import { yupResolver } from "@hookform/resolvers/yup"
import { CreateFormData as EditedData } from "./create-form"
import { useForm } from "react-hook-form"
import * as yup from "yup"

interface IProps {
    setEditMode: Dispatch<SetStateAction<boolean>>,
    editedPostTitle: string,
    setEditedPostTitle: Dispatch<SetStateAction<string>>,
    editedPostDescription: string,
    setEditedPostDescription: Dispatch<SetStateAction<string>>
}

export const FormEditPost = (
    { setEditMode,
        editedPostTitle,
        setEditedPostTitle,
        editedPostDescription,
        setEditedPostDescription }: IProps
) => {

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
        console.log(data)
        setEditedPostDescription(data.description)
        setEditedPostTitle(data.title)
        goToEdit();
        // await addDoc(postsRef, {
        //     ...data,
        //     username: user?.displayName,
        //     userId: user?.uid
        // })
    }


    return (
        <form className="post-container" onSubmit={handleSubmit(onEditPost)}>
            <p>Editing a post</p>
            <input {...register("title")} placeholder="Title..." value={editedPostTitle} onChange={(e) => setEditedPostTitle(e.target.value)} />
            <p className="edit-post-form-error">{errors.title?.message}</p>
            <textarea {...register("description")} onChange={(e) => setEditedPostDescription(e.target.value)} placeholder="Description..." value={editedPostDescription} />
            <p className="edit-post-form-error">{errors.description?.message}</p>
            <input type="submit" className="edit-post-form-btn" />
            <button onClick={goToEdit} type="button">go back</button>
        </form>
    )
}