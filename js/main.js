document.addEventListener('DOMContentLoaded', () => {
  fetch('./config/data.json')
    .then(response => response.json())
    .then(data => {
      populateData(data);
      initAnimations();
    })
    .catch(error => {
      console.error('Ошибка при загрузке данных:', error);
      loadFallbackData();
    });

  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

function populateData(data) {
  document.getElementById('tagline').textContent = data.tagline;
  document.getElementById('about-text').textContent = data.about;
  
  document.getElementById('email').textContent = data.contact.email;
  document.getElementById('email').href = `mailto:${data.contact.email}`;
  document.getElementById('linkedin').textContent = new URL(data.contact.linkedin).hostname;
  document.getElementById('linkedin').href = data.contact.linkedin;
  document.getElementById('twitter').textContent = new URL(data.contact.twitter).hostname;
  document.getElementById('twitter').href = data.contact.twitter;
  document.getElementById('github-link').href = data.github;
  
  const skillsContainer = document.querySelector('.skills-container');
  data.skills.forEach(skillCategory => {
    const skillCard = document.createElement('div');
    skillCard.className = 'skill-card';
    
    const skillHeader = document.createElement('div');
    skillHeader.className = 'skill-header';
    
    const skillTitle = document.createElement('h3');
    skillTitle.className = 'text-xl font-semibold';
    skillTitle.textContent = skillCategory.category;
    
    skillHeader.appendChild(skillTitle);
    skillCard.appendChild(skillHeader);
    
    const skillBody = document.createElement('div');
    skillBody.className = 'skill-body';
    
    skillCategory.techs.forEach(tech => {
      const skillTag = document.createElement('span');
      skillTag.className = 'skill-tag';
      skillTag.textContent = tech;
      skillBody.appendChild(skillTag);
    });
    
    skillCard.appendChild(skillBody);
    skillsContainer.appendChild(skillCard);
  });
}

function loadFallbackData() {
  const fallbackData = {
    name: "CodeDestroyer",
    tagline: "Превращаю сложные задачи в элегантный код",
    about: "Опытный full-stack разработчик, специализирующийся на создании высокопроизводительных веб-приложений с безупречным пользовательским опытом.",
    skills: [
      {
        category: "Frontend",
        techs: ["JavaScript", "React", "Vue", "TypeScript", "HTML5", "CSS3", "Tailwind"]
      },
      {
        category: "Backend",
        techs: ["Node.js", "Express", "Python", "Django", "GraphQL", "REST API"]
      },
      {
        category: "DevOps",
        techs: ["Docker", "Kubernetes", "CI/CD", "AWS", "Azure", "Git"]
      },
      {
        category: "Базы данных",
        techs: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase"]
      }
    ],
    github: "https://github.com/vadimx-stack",
    contact: {
      email: "vadimkapro0123@gmail.com",
      linkedin: "https://linkedin.com/in/codedestroyer",
    }
  };
  
  populateData(fallbackData);
  initAnimations();
}

function initAnimations() {
  const animElements = document.querySelectorAll('.neon-box, .skill-card, .terminal');
  animElements.forEach(el => {
    el.classList.add('opacity-0', 'translate-y-4', 'transition-all', 'duration-700');
  });
  
  const neonElements = document.querySelectorAll('.neon-text, .neon-box, .neon-icon');
  initNeonFlicker(neonElements);
  
  initScreenGlare();
  
  const terminalCursor = document.querySelector('.cursor');
  if (terminalCursor) {
    setInterval(() => {
      const commands = [
        'ls -la',
        'git status',
        'npm run build',
        'docker-compose up',
        'ssh codedestroyer@server',
        'sudo systemctl restart nginx'
      ];
      
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      typeCommand(terminalCursor, randomCommand);
    }, 8000);
  }
}

function initNeonFlicker(elements) {
  elements.forEach(el => {
    const randomDelay = Math.random() * 10;
    const randomDuration = 0.1 + Math.random() * 0.3;
    
    el.style.animation = `neonFlicker ${randomDuration}s ease-in-out ${randomDelay}s infinite alternate`;
  });
  
  const flickerAnimation = `
    @keyframes neonFlicker {
      0%, 100% {
        opacity: 1;
      }
      95% {
        opacity: 1;
      }
      96% {
        opacity: 0.8;
      }
      97% {
        opacity: 1;
      }
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = flickerAnimation;
  document.head.appendChild(styleElement);
}

function initScreenGlare() {
  const glare = document.createElement('div');
  glare.className = 'screen-glare';
  
  const glareStyle = `
    .screen-glare {
      position: fixed;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.03) 25%,
        rgba(255, 255, 255, 0.08) 50%,
        rgba(255, 255, 255, 0.03) 75%,
        rgba(255, 255, 255, 0) 100%
      );
      pointer-events: none;
      z-index: 9999;
      animation: screenGlare 10s linear infinite;
    }
    
    @keyframes screenGlare {
      0% {
        transform: translateX(0%);
      }
      100% {
        transform: translateX(200%);
      }
    }
  `;
  
  const styleElement = document.createElement('style');
  styleElement.textContent = glareStyle;
  document.head.appendChild(styleElement);
  
  document.body.appendChild(glare);
}

function typeCommand(element, command) {
  element.innerHTML = '$';
  let charIndex = 0;
  
  const typeInterval = setInterval(() => {
    element.innerHTML = `$ <span class="command">${command.substring(0, charIndex + 1)}</span>`;
    charIndex++;
    
    if (charIndex === command.length) {
      clearInterval(typeInterval);
      
      setTimeout(() => {
        const commandLine = document.createElement('div');
        commandLine.className = 'line';
        commandLine.innerHTML = `$ <span class="command">${command}</span>`;
        
        element.parentNode.insertBefore(commandLine, element);
        
        setTimeout(() => {
          const resultLine = document.createElement('div');
          resultLine.className = 'line';
          resultLine.textContent = getCommandResult(command);
          element.parentNode.insertBefore(resultLine, element);
          
          const terminalBody = document.querySelector('.terminal-body');
          if (terminalBody) {
            terminalBody.scrollTop = terminalBody.scrollHeight;
          }
        }, 300);
      }, 500);
    }
  }, 100);
}

function getCommandResult(command) {
  const results = {
    'ls -la': 'total 32\ndrwxr-xr-x  4 codedestroyer  staff   128B Mar 10 21:58 .\ndrwxr-xr-x 14 codedestroyer  staff   448B Mar 10 20:12 ..\n-rw-r--r--  1 codedestroyer  staff   2.1K Mar 10 21:45 index.html\n-rw-r--r--  1 codedestroyer  staff   8.2K Mar 10 21:56 style.css',
    'git status': 'On branch main\nYour branch is up to date with \'origin/main\'.\n\nChanges not staged for commit:\n  modified:   src/components/App.js',
    'npm run build': '> codedestroyer-portfolio@1.0.0 build\n> webpack --mode production\n\nassets by status 1.22 MiB [cached] 1 asset\noptimizing modules 302/302 modules\nbuilding webpackJsonpChunks[0] 0% [0/0 modules]webpack 5.75.0 compiled successfully in 3214 ms',
    'docker-compose up': 'Creating network "codedestroyer_default" with the default driver\nCreating codedestroyer_frontend_1 ... done\nAttaching to codedestroyer_frontend_1',
    'ssh codedestroyer@server': 'Welcome to CodeDestroyer Server\nLast login: Thu Mar 10 18:24:37 2023 from 192.168.1.5',
    'sudo systemctl restart nginx': 'Service nginx restarted successfully'
  };
  
  return results[command] || 'Command executed successfully';
}

function handleScroll() {
  const elements = document.querySelectorAll('.opacity-0.translate-y-4');
  
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    if (rect.top <= windowHeight * 0.8) {
      el.classList.remove('opacity-0', 'translate-y-4');
    }
  });
} 