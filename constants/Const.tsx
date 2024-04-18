
export const max_comment_see_in_home = 2;

export const serverAddress = 'https://bytecraft.ir/expert/api/';

export const api = {
    is_auth_valid: serverAddress + 'users/authcheck',
    login: serverAddress + 'users/login',
    is_username_valid: serverAddress + 'users/usernamecheck?',
    logout: serverAddress + 'users/logout',
    register: serverAddress + 'users/create',

    new_exp: serverAddress + 'exps/create',
    my_exps: serverAddress + 'exps/myexps',
    show_exp: serverAddress + 'exps/show',  // GET PathValues: /exp_id/title
    get_user_related_exps: serverAddress + 'exps/showuserrelated',
    delete_exp: serverAddress + "exps/delete",      // DELETE Values: exp_id

    get_skills: serverAddress + 'skills',
    skills_add: serverAddress + 'skills/add', // add new skill to skills table
    get_user_skills: serverAddress + 'users/skills',    // GET
    add_skill_to_user: serverAddress + 'users/skills/add', // POST
    remove_skill_from_user: serverAddress + 'users/skills/remove', // POST

    my_responses: serverAddress + 'users/responses',    // GET Values: user_id
    add_exp_comment: serverAddress + 'exps/responses/add',  // POST Values: exp_id, content
    changeLikeState: serverAddress + 'responses/like', // POST
    delete_response: serverAddress + 'exps/responses/remove', // POST Values: response_id
    
    get_user_info: serverAddress + 'users/show/',
    update_user_info: serverAddress + 'users/update',   // POST Values: fullname, bio, password?, phone, 
    uploadProfileImage: serverAddress + 'users/profileupload', // POST
    get_top_users: serverAddress + 'gettopusers',  // GET
    get_top_users_detail: serverAddress + 'gettopuserdetail',  // GET
    add_me2tops: 'https://bytecraft.ir/send_email', // POST Values: sender_name, sender_email, message_body, subject
    
    get_notifications: serverAddress + 'notifications', // GET
    set_notification_read: serverAddress + 'notifications/read', // GET

    search: serverAddress + 'exps/search', // GET Values: query

    report: serverAddress + 'report'    // POST Values: description, content_type, content, detail

    
}

















