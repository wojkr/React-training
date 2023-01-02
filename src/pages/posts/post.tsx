import { postSchema } from "./posts"

interface Props {
    post: postSchema
}

export const Post = (props: Props) => {
    const { post } = props
    return <section className="post-container">
        <div className="post-title">
            <p className="post-title-text">
                {post.title}
            </p>
        </div>
        <div className="post-description">
            <p className="post-description-text">
                {post.description}
            </p>
        </div>
        <div className="post-username">
            <p className="post-username-text">
                @{post.username}
            </p>
        </div>
    </section>
}