
/* =====================================================================
   Cursos: cada matéria é um pacote de conteúdo (PACKS, montado pelo
   build). Só o curso escolhido é carregado; trocar de curso recarrega o
   app, como trocar de idioma no Duolingo. Nome, ofensiva, gemas, vidas e
   preferências são do perfil (compartilhados); trilha, XP e memória são
   de cada curso.
   ===================================================================== */
const APP_NAME='SaberLingo';
const CKEY='lingo_curso',PKEY='lingo_perfil';
const lsGet=k=>{ try{ return localStorage.getItem(k); }catch(e){ return null; } };
const lsSet=(k,v)=>{ try{ localStorage.setItem(k,v); }catch(e){} };
let COURSE_ID=lsGet(CKEY);
const FIRST_RUN=!PACKS[COURSE_ID];
if(FIRST_RUN) COURSE_ID=COURSE_ORDER[0];
const COURSE=PACKS[COURSE_ID];
COURSE.load();
BRAND.app=APP_NAME; BRAND.course=COURSE.name;
function courseSummary(id){ try{ return JSON.parse(lsGet('lingo_resumo_'+id)||'null'); }catch(e){ return null; } }
function switchCourse(id){ if(!PACKS[id])return; lsSet(CKEY,id); if(id===COURSE_ID&&!FIRST_RUN){ closeModal(); return; } location.reload(); }
