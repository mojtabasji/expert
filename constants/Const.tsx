
export const max_comment_see_in_home = 2;

export const serverAddress = 'https://bytecraft.ir/expert/api/';

export const api = {
    is_auth_valid: serverAddress + 'users/authcheck',
    login: serverAddress + 'users/login',
    is_username_valid: serverAddress + 'users/usernamecheck?',
    logout: serverAddress + 'users/logout',
    register: serverAddress + 'users/create',
    new_exp: serverAddress + 'exps/create',
    get_skills: serverAddress + 'skills',
    skills_add: serverAddress + 'skills/add', // add new skill to skills table
    get_user_skills: serverAddress + 'users/skills',    // GET
    add_skill_to_user: serverAddress + 'users/skills/add', // POST
    my_exps: serverAddress + 'exps/myexps',
    show_exp: serverAddress + 'exps/show',
    get_user_info: serverAddress + 'users/show/',
    update_user_info: serverAddress + 'users/update',
    get_user_related_exps: serverAddress + 'exps/showuserrelated',
    add_exp_comment: serverAddress + 'exps/responses/add',
    uploadProfileImage: serverAddress + 'users/profileupload', // POST
    get_notifications: serverAddress + 'notifications', // GET
    set_notification_read: serverAddress + 'notifications/read', // GET
}

















