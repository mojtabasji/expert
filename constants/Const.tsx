
export const max_comment_see_in_home = 2;

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

















