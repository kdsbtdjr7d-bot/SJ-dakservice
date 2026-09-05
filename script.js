const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.addEventListener('keydown', event => {if(event.key === 'Escape' && nav.classList.contains('open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();}});
document.querySelector('#year').textContent = new Date().getFullYear();
const galleries = {
 smal: {title:'Dakwerk naast zonnepanelen', photos:[['smal-dak-resultaat','Overzicht van de afgewerkte dakbedekking'],['smal-dak-werk','Dakbedekking tijdens de uitvoering'],['smal-dak-aanleg','De aanleg van de dakbedekking'],['smal-dak-detail','Detail van de dakbedekking'],['smal-dak-rand','Detail van de dakrand en aansluiting']]},
 plat: {title:'Van plat dak naar groendak', photos:[['plat-dak-voor','Bestaande dakbedekking'],['plat-dak-voor-overzicht','Overzicht van de bestaande dakbedekking'],['plat-dak-na','Vernieuwde dakbedekking'],['plat-dak-na-overzicht','Nieuwe dakbedekking vóór de groene afwerking'],['groendak','Eindresultaat: het dak met groene afwerking']]},
 groen: {title:'Groendak', photos:[['groendak','Dak met begroeiing op een uitbouw']]}
};
const dialog = document.querySelector('#gallery'); let active; let current=0;
function renderPhoto(){const [file,caption]=active.photos[current];const img=document.querySelector('#gallery-photo');img.src=`assets/${file}.webp`;img.alt=caption;document.querySelector('#gallery-title').textContent=active.title;document.querySelector('#gallery-caption').textContent=`${current+1} / ${active.photos.length} — ${caption}`;document.querySelector('#prev-photo').disabled=current===0;document.querySelector('#next-photo').disabled=current===active.photos.length-1;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{active=galleries[button.dataset.gallery];current=0;renderPhoto();dialog.showModal();document.body.style.overflow='hidden';}));
document.querySelector('#close-gallery').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.style.overflow='');
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
function move(step){if(current+step>=0&&current+step<active.photos.length){current+=step;renderPhoto();}}
document.querySelector('#prev-photo').addEventListener('click',()=>move(-1));document.querySelector('#next-photo').addEventListener('click',()=>move(1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}});
