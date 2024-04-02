
export const max_comment_see_in_home = 2;

type Exp = {
    image_uri: string,
    uID: number,
    username: string,
    description: string,
}


export const exps: Exp[] = [
    {
        image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
        uID: 1,
        username: 'ali',
        description: 'this is a description',
    },
    {
        image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
        uID: 1,
        username: 'ali',
        description: 'this is a description',
    },
    {
        image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
        uID: 1,
        username: 'ali',
        description: 'this is a description',
    },
    {
        image_uri: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
        uID: 1,
        username: 'ali',
        description: 'this is a description',
    },
];

export const serverAddress = 'http://bytecraft.ir/expert/api/';

export const api = {
    is_auth_valid: serverAddress + 'users/authcheck',
    login: serverAddress + 'users/login',
    is_username_valid: serverAddress + 'users/usernamecheck?',
    logout: serverAddress + 'users/logout',
    register: serverAddress + 'users/create',
    new_exp: serverAddress + 'exps/create',
    get_skills: serverAddress + 'skills',
    skills_add: serverAddress + 'skills/add', // add new skill to skills table
    my_exps: serverAddress + 'exps/myexps',
    show_exp: serverAddress + 'exps/show',
    get_user_info: serverAddress + 'users/show/',
    update_user_info: serverAddress + 'users/update',
    get_user_related_exps: serverAddress + 'exps/showuserrelated',
    add_exp_comment: serverAddress + 'exps/responses/add',
}

















