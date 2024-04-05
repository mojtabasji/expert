

export type Exp = {
    image: string | null,
    id: number,
    content: string,
    user: User,
    title: string,
    responses?: Response []
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

export type Response = {
    user: User,
    content: string,
    likes: number,
    dislikes: number
}

export type Skill = {
    id: number,
    name: string
}
