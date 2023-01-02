import { getDocs, collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../../config/firebase"
import { Post } from "./post"

export interface postSchema {
    id: string,
    userId: string,
    username: string,
    description: string,
    title: string
}

export const Posts = () => {
    const [postsList, setPostsList] = useState<postSchema[] | null>(null);//array of postSchema or null, then added in mapping!
    const postsRef = collection(db, "posts")
    const getPosts = async () => {
        const data = await getDocs(postsRef)
        setPostsList(data.docs.map(d => ({ ...d.data(), id: d.id })) as postSchema[])
    }
    useEffect(() => {
        getPosts()
    }, [])

    return (<main>

        {postsList?.map(post => (
            <Post post={post} />
        ))}
    </main>)
}