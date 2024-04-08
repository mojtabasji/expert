import { Exp, User, Response, Notification, Skill } from "../constants/Types";

const data: Exp[] = [
    {
        image: "https://cdn.dribbble.com/userupload/12570642/file/original-b8c53e55863dec68ae052301723e9787.jpg?resize=320x240&vertical=center",
        user: {
            username: 'ali',
            fullname: "aliVali",
            avatar: 'https://cdn.dribbble.com/users/594316/screenshots/16557702/media/d77aa195b67473edb6c386b355126078.jpg?resize=768x576&vertical=center',
            id: 1,
            phone: '09123456789',
            bio: 'I am a software engineer and I have been working in the field for 5 years.',
        },
        content: 'What programming language is commonly used for Android app development?',
        responses: [
            {
                user: {
                    username: 'mojtaba_sji',
                    avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
                    id: 2,
                    phone: '09123456789',
                    bio: 'I am a software engineer and I have been working in the field for 5 years.',
                    fullname: "mojtaba",
                },
                content: 'Synchronous programming involves executing tasks one after the other, while asynchronous programming allows tasks to run independently and notifies the main program when they are done.',
                likes: 11,
                dislikes: 2,
            },
            {
                user: {
                    username: 'aliAlidari_1232',
                    avatar: 'https://cdn.dribbble.com/users/1355613/screenshots/15252730/media/28f348daf9654c440f5dcf398d8e097a.jpg?resize=768x576&vertical=center',
                    id: 4,
                    phone: '09123456789',
                    bio: null,
                    fullname: "ali",
                },
                content: 'Java and Kotlin are commonly used for Android app development.',
                likes: 10,
                dislikes: 2,
            }
        ],
        title: 'Android app development',
        id: 1,
    },
    {
        image: "https://cutewallpaper.org/28/dark-fall-landscape-wallpaper/85729959.jpg",
        user: {
            username: 'mojtaba_sji',
            avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
            id: 2,
            phone: '09123456789',
            bio: null,
            fullname: "mojtaba",
        },
        content: 'How do you handle user input in iOS app development using Swift?',
        id: 2,
        title: 'iOS app development',
    },
    {
        image: null,
        user: {
            username: 'Mammmadd1321',
            avatar: 'https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Rachel-Montan%CC%83ez.jpeg',
            id: 3,
            phone: '09123456789',
            bio: null,
            fullname: "mamad",
        },
        content: 'What is the difference between synchronous and asynchronous programming in the context of app development?',
        id: 3,
        title: 'App development',
    },
    {
        image: "https://c02.purpledshub.com/uploads/sites/62/2022/09/GettyImages-200386624-001-d80a3ec.jpg?w=1029&webp=1",
        user: {
            username: 'aliAlidari_1232',
            avatar: 'https://cdn.dribbble.com/users/1355613/screenshots/15252730/media/28f348daf9654c440f5dcf398d8e097a.jpg?resize=768x576&vertical=center',
            id: 4,
            phone: '09123456789',
            bio: null,
            fullname: "ali",
        },
        content: 'How do you optimize images for mobile app development to ensure fast loading times?',
        id: 4,
        title: 'Mobile app development',
    },
];

export const skills: Skill[] = [
    {
        id: 1,
        name: 'Java',
    },
    {
        id: 2,
        name: 'Kotlin',
    },
    {
        id: 3,
        name: 'Swift',
    },
    {
        id: 4,
        name: 'Objective-C',
    },
    {
        id: 5,
        name: 'React Native',
    },
    {
        id: 6,
        name: 'Flutter',
    },
    {
        id: 7,
        name: 'Python',
    },
    {
        id: 8,
        name: 'JavaScript',
    },
    {
        id: 9,
        name: 'C++',
    },
    {
        id: 10,
        name: 'C#',
    },
];

export const top_users: User[] = [
    {
        username: 'ali',
        avatar: 'https://cdn.dribbble.com/users/594316/screenshots/16557702/media/d77aa195b67473edb6c386b355126078.jpg?resize=768x576&vertical=center',
        id: 1,
        // points: 100,
        bio: 'I am a software engineer and I have been working in the field for 5 years.',
        fullname: "aliVali",
        phone: '09123456789',
        skills: skills.slice(0, 3),
    },
    {
        username: 'mojtaba_sji',
        avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
        id: 2,
        // points: 90,
        bio: 'I am a software engineer and I have been working in the field for 5 years.',
        fullname: "mojtaba",
        phone: '09123456789',
        skills: skills.slice(3, 6),
    },
    {
        username: 'Mammmadd1321',
        avatar: 'https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Rachel-Montan%CC%83ez.jpeg',
        id: 3,
        // points: 80,
        bio: 'I am a software engineer and I have been working in the field for 5 years.',
        fullname: "mamad",
        phone: '09123456789',
        skills: skills.slice(6, 9),
    },
    {
        username: 'aliAlidari_1232',
        avatar: 'https://cdn.dribbble.com/users/1355613/screenshots/15252730/media/28f348daf9654c440f5dcf398d8e097a.jpg?resize=768x576&vertical=center',
        id: 4,
        // points: 70,
        bio: 'I am a software engineer and I have been working in the field for 5 years.',
        fullname: "ali",
        phone: '09123456789',
        skills: skills.slice(9, 10),
    },
];

export const notifications: Notification[] = [
    {
        id: 1,
        user: {
            username: 'ali',
            avatar: 'https://cdn.dribbble.com/users/594316/screenshots/16557702/media/d77aa195b67473edb6c386b355126078.jpg?resize=768x576&vertical=center',
            id: 1,
            phone: '09123456789',
            bio: 'I am a software engineer and I have been working in the field for 5 years.',
            fullname: "aliVali",
        },
        content: 'liked your response.',
        created_at: '2022-09-17T08:00:00',
        is_read: false,
        exp: data[0],
    },
    {
        id: 2,
        user: {
            username: 'mojtaba_sji',
            avatar: 'https://images.ctfassets.net/h6goo9gw1hh6/2sNZtFAWOdP1lmQ33VwRN3/24e953b920a9cd0ff2e1d587742a2472/1-intro-photo-final.jpg?w=1200&h=992&q=70&fm=webp',
            id: 2,
            phone: '09123456789',
            bio: 'I am a software engineer and I have been working in the field for 5 years.',
            fullname: "mojtaba",
        },
        content: 'liked your response.',
        created_at: '2022-09-17T08:00:00',
        is_read: false,
        exp: data[0],
    },
    {
        id: 3,
        user: {
            username: 'Mammmadd1321',
            avatar: 'https://cultivatedculture.com/wp-content/uploads/2019/12/LinkedIn-Profile-Picture-Example-Rachel-Montan%CC%83ez.jpeg',
            id: 3,
            phone: '09123456789',
            bio: 'I am a software engineer and I have been working in the field for 5 years.',
            fullname: "mamad",
        },
        content: 'liked your response.',
        created_at: '2022-09-17T08:00:00',
        is_read: false,
        exp: data[0],
    },
    {
        id: 4,
        user: {
            username: 'aliAlidari_1232',
            avatar: 'https://cdn.dribbble.com/users/1355613/screenshots/15252730/media/28f348daf9654c440f5dcf398d8e097a.jpg?resize=768x576&vertical=center',
            id: 4,
            phone: '09123456789',
            bio: 'I am a software engineer and I have been working in the field for 5 years.',
            fullname: "ali",
        },
        content: 'liked your response.',
        created_at: '2022-09-17T08:00:00',
        is_read: true,
        exp: data[1],
    }
];

export default data;
