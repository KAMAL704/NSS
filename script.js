const menu=document.querySelector('.menu-btn');const nav=document.querySelector('.nav');if(menu&&nav){menu.addEventListener('click',()=>{nav.classList.toggle('open');menu.setAttribute('aria-expanded',nav.classList.contains('open'))});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}

const items=document.querySelectorAll('.reveal');const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.1});items.forEach(el=>io.observe(el));

const progress=document.querySelector('.scroll-progress');const updateScroll=()=>{if(progress){const max=document.documentElement.scrollHeight-window.innerHeight;progress.style.width=`${max>0?(window.scrollY/max)*100:0}%`}};window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();

const prefersReduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
 document.querySelectorAll('.hero-card,.hero-center,.orbit').forEach((el,i)=>{el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5;const y=(e.clientY-r.top)/r.height-.5;el.style.transition='transform .15s ease';el.style.transform=`translate(${x*10}px,${y*10}px) ${i===0?'rotate(-5deg)':i===1?'rotate(5deg)':''}`});el.addEventListener('pointerleave',()=>{el.style.transition='transform .6s ease';el.style.transform=''})});
}

document.querySelectorAll('[data-count]').forEach(el=>{const target=Number(el.dataset.count);let done=false;const counter=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!done){done=true;const start=performance.now();const tick=now=>{const p=Math.min((now-start)/1100,1);el.textContent=Math.floor((1-Math.pow(1-p,3))*target);if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);counter.disconnect()}});counter.observe(el)});

window.addEventListener('scroll',()=>document.documentElement.style.setProperty('--scrollY',`${window.scrollY*.04}px`),{passive:true});