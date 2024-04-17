

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
    avatar: string | null,
    skills?: Skill[],
    phone: string,
    bio: string | null | undefined,
    exps_count: number,
    answers_count: number,
}

export type Response = {
    id: number,
    user: User,
    content: string,
    likes: number[],
    dislikes: number[]
}

export type Skill = {
    id: number,
    name: string
}

export type Notification = {
    id: number,
    user: User,
    exp: Exp,
    content: string,
    is_read: boolean,
    created_at: string
}

export type Report = {
    content_type : "EXP" | "RESPONSE" | "USER" | "HIGHLIGHT"
}
