import {db} from './db.js';
export const notify=(userId,text)=>db.notification.create({data:{userId,text}});
