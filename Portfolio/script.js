(function () {
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const initial = stored || 'dark';
  if (initial === 'dark') root.setAttribute('data-theme', 'dark');
  if (initial === 'light') root.setAttribute('data-theme', 'light');

  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  function updateIcon() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    themeIcon.src = isDark ? 'assets/icons/moon.svg' : 'assets/icons/sun.svg';
    themeIcon.alt = isDark ? 'Dark mode' : 'Light mode';
  }

  function toggleTheme() {
    const current = root.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon();
  }

  function toggleNav() {
    const isOpen = navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
  if (navToggle) navToggle.addEventListener('click', toggleNav);
  updateIcon();

  // dynamic year
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // comment form handling
  const commentForm = document.querySelector('.comment-form');
  const commentsList = document.getElementById('comments-list');
  const noCommentsMsg = document.querySelector('.no-comments');
  
  // Load comments from localStorage
  function loadComments() {
    const comments = JSON.parse(localStorage.getItem('portfolioComments') || '[]');
    const commentCount = document.getElementById('comment-count');
    
    // Update comment count
    commentCount.textContent = `${comments.length} comment${comments.length !== 1 ? 's' : ''}`;
    
    if (comments.length === 0) {
      noCommentsMsg.style.display = 'block';
      return;
    }
    
    noCommentsMsg.style.display = 'none';
    commentsList.innerHTML = '';
    
    comments.forEach(comment => {
      const commentElement = document.createElement('div');
      commentElement.className = 'comment-item';
      commentElement.innerHTML = `
        <div class="comment-header">
          <span class="comment-name">${comment.studentId}</span>
          <span class="comment-rating">${comment.rating}/10</span>
        </div>
        <div class="comment-text">${comment.comment || 'No comment provided.'}</div>
        <div class="comment-date">${new Date(comment.date).toLocaleDateString()}</div>
      `;
      commentsList.appendChild(commentElement);
    });
  }
  
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(commentForm);
      const studentId = formData.get('studentId');
      const rating = formData.get('rating');
      const comment = formData.get('comment');
      
      // Save comment to localStorage (limit to 60 comments)
      const comments = JSON.parse(localStorage.getItem('portfolioComments') || '[]');
      comments.unshift({
        studentId: studentId,
        rating: rating,
        comment: comment,
        date: new Date().toISOString()
      });
      
      // Keep only the latest 60 comments
      if (comments.length > 60) {
        comments.splice(60);
      }
      
      localStorage.setItem('portfolioComments', JSON.stringify(comments));
      
      // Reload comments display
      loadComments();
      
      // Show thank you message
      const thankYou = document.createElement('div');
      thankYou.innerHTML = `
        <div style="background: var(--panel); border: 1px solid var(--border); border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center;">
          <h3 style="color: var(--accent); margin: 0 0 10px;">Thank you, ${studentId}!</h3>
          <p style="margin: 0; color: var(--text);">Your ${rating}/10 rating and feedback have been recorded.</p>
        </div>
      `;
      
      commentForm.parentNode.insertBefore(thankYou, commentForm.nextSibling);
      commentForm.reset();
      
      // Remove thank you message after 3 seconds
      setTimeout(() => {
        if (thankYou.parentNode) {
          thankYou.parentNode.removeChild(thankYou);
        }
      }, 3000);
    });
  }
  
  // Load comments on page load
  loadComments();

  // Scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Parallax effect for hero section
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-visual');
    if (parallax) {
      const speed = scrolled * 0.5;
      parallax.style.transform = `translateY(${speed}px)`;
    }
  });

  // Add typing effect to hero text
  const typingText = document.querySelector('.typing-text');
  if (typingText) {
    const text = typingText.textContent;
    typingText.textContent = '';
    typingText.style.borderRight = '2px solid var(--accent)';
    
    let i = 0;
    const typeWriter = () => {
      if (i < text.length) {
        typingText.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        // Remove cursor after typing is complete
        setTimeout(() => {
          typingText.style.borderRight = 'none';
        }, 1000);
      }
    };
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
  }

  // Add hover effects to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });

  // Add click animation to buttons
  document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function(e) {
      // Create ripple effect
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      ripple.classList.add('ripple');
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Create particle system
  function createParticleSystem() {
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
    `;
    document.body.appendChild(particleContainer);

    function createParticle() {
      const particle = document.createElement('div');
      const size = Math.random() * 4 + 2;
      const colors = ['#ff6b35', '#00d4ff', '#ff4081', '#7c3aed'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100%;
        box-shadow: 0 0 ${size * 2}px ${color};
        animation: particle-float-up ${Math.random() * 10 + 10}s linear forwards;
      `;
      
      particleContainer.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 20000);
    }

    // Create particles periodically
    setInterval(createParticle, 2000);
  }

  // Add CSS for particle animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particle-float-up {
      0% {
        transform: translateY(0) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translateY(-100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Initialize particle system
  createParticleSystem();

  // Add mouse trail effect
  let mouseTrail = [];
  const maxTrailLength = 20;

  document.addEventListener('mousemove', function(e) {
    const trail = document.createElement('div');
    trail.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      background: radial-gradient(circle, rgba(255,107,53,0.8), transparent);
      border-radius: 50%;
      left: ${e.clientX - 3}px;
      top: ${e.clientY - 3}px;
      pointer-events: none;
      z-index: 1000;
      animation: trail-fade 1s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    mouseTrail.push(trail);
    
    if (mouseTrail.length > maxTrailLength) {
      const oldTrail = mouseTrail.shift();
      if (oldTrail.parentNode) {
        oldTrail.parentNode.removeChild(oldTrail);
      }
    }
    
    setTimeout(() => {
      if (trail.parentNode) {
        trail.parentNode.removeChild(trail);
      }
    }, 1000);
  });

  // Add trail fade animation
  const trailStyle = document.createElement('style');
  trailStyle.textContent = `
    @keyframes trail-fade {
      0% {
        opacity: 1;
        transform: scale(1);
      }
      100% {
        opacity: 0;
        transform: scale(0);
      }
    }
  `;
  document.head.appendChild(trailStyle);

  // Enhanced scroll effects
  let ticking = false;
  function updateScrollEffects() {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    
    // Parallax for hero visual
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      heroVisual.style.transform = `translateY(${rate}px)`;
    }
    
    // Floating elements animation
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
      const speed = (index + 1) * 0.5;
      element.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
    });
    
    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
})();


