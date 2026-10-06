import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const rows = await p.clip.findMany({ orderBy: { createdAt: 'desc' }, take: 3, select: { id:true, sourceUrl:true, startSeconds:true, endSeconds:true, subtitleSource:true, language:true, status:true } });
console.log(JSON.stringify(rows, null, 2));
const jobs = await p.clipJob.findMany({ orderBy: { createdAt: 'desc' }, take: 3 });
console.log('---jobs---');
console.log(JSON.stringify(jobs.map(j=>({clipId:j.clipId,status:j.status,error:j.error?.slice(0,200), logTail:j.logTail?.slice(0,800)})), null, 2));
await p.$disconnect();
