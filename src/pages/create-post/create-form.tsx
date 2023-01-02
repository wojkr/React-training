import { useForm } from "react-hook-form";
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

interface CreateFormData {
    title: string,
    description: string
}

export const CreateForm = () => {
    const [user] = useAuthState(auth);
    const navigate = useNavigate();

    const schema = yup.object().shape({
        title: yup.string().required("you must add a title."),
        description: yup.string().required("you must add a description.")
    })

    const { register, handleSubmit, formState: { errors } } = useForm<CreateFormData>({
        resolver: yupResolver(schema)
    });

    const postsRef = collection(db, "posts")

    const onCreatePost = async (data: CreateFormData) => {
        console.log(data)
        await addDoc(postsRef, {
            ...data,
            username: user?.displayName,
            userId: user?.uid
        })
        navigate('/')
    }
    return <form className="create-post-form" onSubmit={handleSubmit(onCreatePost)}>
        <p>Add a new post: </p>
        <input placeholder="Title..." {...register("title")} />
        <p className="create-post-form-error">{errors.title?.message}</p>
        <textarea placeholder="Description..." {...register("description")} />
        <p className="create-post-form-error">{errors.description?.message}</p>
        <input type="submit" className="create-post-form-btn" />
    </form>
}