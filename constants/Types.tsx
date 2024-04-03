

export type Exp = {
    image: string | null,
    id: number,
    content: string,
    user: User,
    title: string,
    responses?: Responses []
}
export type User = {
    id: number,
    username: string,
    fullname: string,
    avatar: string,
    skills?: undefined,
    phone: string,
    bio: string | null
}

export type Responses = {
    user: User,
    content: string,
    likes: number,
    dislikes: number
}

