const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); });
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}));
document.addEventListener('keydown', event => {if(event.key === 'Escape' && nav.classList.contains('open')){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');menu.focus();}});
document.querySelector('#year').textContent = new Date().getFullYear();
const galleries = {
 dakramen:{title:'Pannendak met dakramen',photos:[['pannen-dakramen-werk.svg','Tijdens: het dak nadat de oude pannen zijn verwijderd'],['pannen-dakramen-na.svg','Na: nieuwe donkere dakpannen rondom de dakramen']]},
 dakkapel:{title:'Pannendak met dakkapel',photos:[['pannen-dakkapel-voor.svg','Vóór: het dak met de oude dakpannen'],['pannen-dakkapel-werk.svg','Tijdens: de dakpannen zijn verwijderd'],['pannen-dakkapel-opbouw.svg','Tijdens: de nieuwe opbouw van het dak'],['pannen-dakkapel-na-zij.svg','Na: het vernieuwde dakvlak'],['pannen-dakkapel-na.svg','Na: het pannendak rondom de dakkapel']]},
 zink:{title:'Zinkwerk bij een pannendak',photos:[['zink-werk.svg','Tijdens: werkzaamheden aan de goot'],['zink-na.svg','Zinken goot bij het pannendak']]},
 smal: {title:'Dakwerk naast zonnepanelen', photos:[['smal-dak-werk','Vóór: het oude dak bij de start van de werkzaamheden'],['smal-dak-aanleg','Vóór: de bestaande dakbedekking en verweerde dakranden'],['smal-dak-detail','Na: de nieuwe dakbedekking'],['smal-dak-rand','Na: de afgewerkte dakrand en aansluiting'],['smal-dak-resultaat','Eindresultaat: overzicht van het vernieuwde dak']]},
 plat: {title:'Van plat dak naar groendak', photos:[['plat-dak-voor','Bestaande dakbedekking'],['plat-dak-voor-overzicht','Overzicht van de bestaande dakbedekking'],['plat-dak-na','Vernieuwde dakbedekking'],['plat-dak-na-overzicht','Nieuwe dakbedekking vóór de groene afwerking'],['groendak','Eindresultaat: het dak met groene afwerking']]},
 groen: {title:'Groendak', photos:[['groendak','Dak met begroeiing op een uitbouw']]}
};
const dialog = document.querySelector('#gallery'); let active; let current=0;
function renderPhoto(){const [file,caption]=active.photos[current];const img=document.querySelector('#gallery-photo');img.src=`assets/${file.endsWith('.svg')?file:file+'.webp'}`;img.alt=caption;document.querySelector('#gallery-title').textContent=active.title;document.querySelector('#gallery-caption').textContent=`${current+1} / ${active.photos.length} — ${caption}`;document.querySelector('#prev-photo').disabled=current===0;document.querySelector('#next-photo').disabled=current===active.photos.length-1;}
document.querySelectorAll('[data-gallery]').forEach(button=>button.addEventListener('click',()=>{active=galleries[button.dataset.gallery];current=0;renderPhoto();dialog.showModal();document.body.style.overflow='hidden';}));
document.querySelector('#close-gallery').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.style.overflow='');
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
function move(step){if(current+step>=0&&current+step<active.photos.length){current+=step;renderPhoto();}}
document.querySelector('#prev-photo').addEventListener('click',()=>move(-1));document.querySelector('#next-photo').addEventListener('click',()=>move(1));
dialog.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){event.preventDefault();move(-1);}if(event.key==='ArrowRight'){event.preventDefault();move(1);}});

/* Native verzending met fotobijlagen en controle vóór versturen. */
const quoteForm = document.querySelector('#quote-form');
if (quoteForm) {
 const photoFields = Array.from(quoteForm.querySelectorAll('.photo-field'));
 const photoInputs = photoFields.map(field => field.querySelector('input'));
 const addPhoto = document.querySelector('#add-photo');
 const uploadError = document.querySelector('#upload-error');
 const submitButton = quoteForm.querySelector('[type="submit"]');
 const submitLabel = submitButton.innerHTML;
 function validatePhotos() {
  let total = 0;
  let error = '';
  photoInputs.forEach(input => {
   input.setCustomValidity('');
   for (const file of input.files) {
    total += file.size;
    if (!/\.(jpe?g|png|webp)$/i.test(file.name) || (file.type && !['image/jpeg','image/png','image/webp'].includes(file.type))) error = 'Kies een JPG-, PNG- of WebP-foto. Andere bestanden kunt u via WhatsApp sturen.';
   }
  });
  if (total > 10000000) error = 'De foto’s zijn samen groter dan 10 MB. Kies kleinere foto’s of stuur ze via WhatsApp.';
  uploadError.textContent = error;
  const firstSelected = photoInputs.find(input => input.files.length);
  if (firstSelected && error) firstSelected.setCustomValidity(error);
  return !error;
 }
 photoFields.forEach((field, index) => {field.hidden = index > 0 && !photoInputs[index].files.length;});
 addPhoto.hidden = photoFields.every(field => !field.hidden);
 addPhoto.addEventListener('click', () => {
  const field = photoFields.find(item => item.hidden);
  if (field) {field.hidden = false; field.querySelector('input').focus();}
  addPhoto.hidden = photoFields.every(item => !item.hidden);
 });
 photoInputs.forEach(input => input.addEventListener('change', validatePhotos));
 quoteForm.addEventListener('submit', event => {
  if (!validatePhotos()) {event.preventDefault(); quoteForm.reportValidity(); return;}
  submitButton.disabled = true;
  submitButton.textContent = 'Aanvraag wordt verstuurd…';
  // Bij een netwerkprobleem kan de bezoeker opnieuw proberen.
  window.setTimeout(() => {submitButton.disabled = false;submitButton.innerHTML = submitLabel;}, 15000);
 });
 window.addEventListener('pageshow', () => {submitButton.disabled = false;submitButton.innerHTML = submitLabel;validatePhotos();});
}

/* Eén dakkeuze toont zowel de bijbehorende diensten als projectcases. */
const roofKinds = ['pannendaken', 'platte-daken'];
function selectRoof(kind) {
 if (!roofKinds.includes(kind)) kind = 'all';
 document.querySelectorAll('[data-roof]').forEach(item => { item.hidden = kind !== 'all' && item.dataset.roof !== kind; });
 document.querySelectorAll('[data-roof-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.roofFilter === kind)));
 document.querySelector('.roof-services').classList.toggle('is-filtered', kind !== 'all');
 document.querySelector('#project-status').textContent = kind === 'all' ? 'Vier projecten: twee pannendaken en twee platte daken.' : kind === 'pannendaken' ? 'Twee projecten met pannendaken.' : 'Twee projecten met platte daken.';
}
document.querySelectorAll('[data-roof-select]').forEach(link => link.addEventListener('click', () => selectRoof(link.dataset.roofSelect)));
document.querySelectorAll('[data-roof-filter]').forEach(button => button.addEventListener('click', () => selectRoof(button.dataset.roofFilter)));
function applyRoofHash() { const kind = location.hash.slice(1); if (roofKinds.includes(kind)) selectRoof(kind); }
window.addEventListener('hashchange', applyRoofHash);
applyRoofHash();
document.querySelectorAll('.compare-range').forEach(input => {
 const update = () => {
  input.parentElement.style.setProperty('--split', input.value + '%');
  input.setAttribute('aria-valuetext', input.value + '% van de voorfoto zichtbaar');
 };
 input.addEventListener('input', update);
 // Full-image pointer dragging, while native range keeps keyboard support.
 let pointer = null;
 function setFromPointer(event) {
  const rect = input.getBoundingClientRect();
  input.value = String(Math.round(Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100))));
  update();
 }
 input.addEventListener('pointerdown', event => { if (event.button !== 0) return; pointer = event.pointerId; input.setPointerCapture(pointer); input.focus({preventScroll:true}); setFromPointer(event); });
 input.addEventListener('pointermove', event => { if (event.pointerId === pointer) setFromPointer(event); });
 input.addEventListener('pointerup', () => { pointer = null; });
 input.addEventListener('pointercancel', () => { pointer = null; });
 update();
});
