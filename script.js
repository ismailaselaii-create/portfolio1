(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('in');
        var n = e.target.querySelector('[data-count]');
        if(n) count(n);
        io.unobserve(e.target);
      }
    });
  },{threshold:.15});
  document.querySelectorAll('.reveal').forEach(function(el,i){
    el.style.transitionDelay = (i%3)*80+'ms';
    io.observe(el);
  });

  function count(el){
    var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec||0,10);
    if(reduce){ el.textContent = to.toFixed(dec); return; }
    var t0 = performance.now(), dur = 1200;
    (function step(t){
      var p = Math.min((t-t0)/dur,1), v = to*(1-Math.pow(1-p,3));
      el.textContent = v.toFixed(dec);
      if(p<1) requestAnimationFrame(step);
    })(t0);
  }

  if(!reduce && window.matchMedia('(pointer:fine)').matches){
    var glow = document.querySelector('.glow');
    var chips = document.querySelectorAll('.chip');
    window.addEventListener('mousemove', function(e){
      glow.style.left = e.clientX+'px';
      glow.style.top = e.clientY+'px';
      var cx = (e.clientX/innerWidth-.5), cy = (e.clientY/innerHeight-.5);
      chips.forEach(function(c){
        var d = parseFloat(c.dataset.depth||0);
        c.style.transform = 'translate('+(cx*d)+'px,'+(cy*d)+'px)';
      });
    });
    document.querySelectorAll('.tilt').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
        card.style.transform = 'perspective(1000px) rotateY('+(x*3)+'deg) rotateX('+(-y*3)+'deg)';
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  }

  document.getElementById('yr').textContent = new Date().getFullYear();
})();
