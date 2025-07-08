// =======================================================
// BÖLÜM 1: TRIANGLIFY ARKA PLAN KODU
// =======================================================
$(document).ready(function(){
    var width = $(window).width();
    var height = $(window).height();
    $('#background-container, #background-1, #background-2').css({ 'min-width': width, 'min-height': height });
    svgNew();
    recreateSvg();
});
var svg = {}; var draw = 1;
var svgNew = function(){
    var options = { width: $(window).width(), height: $(window).height(), cell_size: 150, x_colors: ['#0d1117', '#2e1a47', '#001f3f'] };
    svg.pattern = Trianglify(options);
    if (draw === 1) { svgDraw1(); } else { svgDraw2(); }
};
var svgDraw1 = function (){ draw = 2; $('.background-1').css({ 'background-image': 'url(' + svg.pattern.canvas().toDataURL() + ')' }); fade1(); };
var svgDraw2 = function(){ draw = 1; $('.background-2').css({ 'background-image': 'url(' + svg.pattern.canvas().toDataURL() + ')' }); fade2(); };
var fade1 = function(){ $('.background-1').velocity("fadeIn", { duration: 3000 }); $('.background-2').velocity("fadeOut", { duration: 4000 }); };
var fade2 = function(){ $('.background-2').velocity("fadeIn", { duration: 3000 }); $('.background-1').velocity("fadeOut", { duration: 4000 }); };
var recreateSvg = function(){ window.setInterval(svgNew, 5000); };


// ===================================================================
// BÖLÜM 2: CANVAS PARÇACIK ANİMASYONU KODU
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('interactive-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particleCount = 200;
    const repulsionRadius = 100;
    const repulsionStrength = 1.5;
    const symbolBaseSize = 12;
    let particles = [];
    const shapes = ['circle', 'square', 'triangle', 'cross'];
    const colors = { triangle: '#11BF8E', circle: '#F24B78', cross: '#0583F2', square: '#AE6882' };
    const mouse = { x: null, y: null };
    let ripples = [];
    const rippleInterval = 100;
    let lastRippleTime = 0;
    const rippleSpeed = 2;
    const maxRippleRadius = 80;
    window.addEventListener('mousemove', (event) => { mouse.x = event.clientX; mouse.y = event.clientY; const currentTime = Date.now(); if (currentTime - lastRippleTime > rippleInterval) { ripples.push(new Ripple(mouse.x, mouse.y)); lastRippleTime = currentTime; } });
    window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
    class Ripple { constructor(x, y) { this.x = x; this.y = y; this.radius = 0; this.opacity = 1; } draw() { ctx.strokeStyle = `rgba(229, 231, 235, ${this.opacity})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); ctx.stroke(); } update() { this.radius += rippleSpeed; if (this.radius > 1) { this.opacity = 1 - (this.radius / maxRippleRadius); } } }
    class Particle { constructor(x, y, velX, velY, shape) { this.x = x; this.y = y; this.velX = velX; this.velY = velY; this.size = Math.random() * 5 + symbolBaseSize; this.shape = shape; this.color = colors[shape];} draw() { ctx.strokeStyle = this.color; ctx.lineWidth = 2; ctx.shadowColor = this.color; ctx.shadowBlur = 15; ctx.globalAlpha = 0.7; ctx.beginPath(); switch (this.shape) { case 'circle': ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2); break; case 'square': ctx.rect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size); break; case 'triangle': ctx.moveTo(this.x, this.y - this.size / 2); ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2); ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2); ctx.closePath(); break; case 'cross': const s = this.size / 2; ctx.moveTo(this.x - s, this.y - s); ctx.lineTo(this.x + s, this.y + s); ctx.moveTo(this.x + s, this.y - s); ctx.lineTo(this.x - s, this.y + s); break; } ctx.stroke(); } update() { if (mouse.x && mouse.y) { const dx = this.x - mouse.x; const dy = this.y - mouse.y; const distance = Math.sqrt(dx * dx + dy * dy); if (distance < repulsionRadius) { const force = (repulsionRadius - distance) / repulsionRadius; this.x += (dx / distance) * force * repulsionStrength; this.y += (dy / distance) * force * repulsionStrength; } } this.x += this.velX; this.y += this.velY; if (this.x > canvas.width + this.size) this.x = -this.size; if (this.x < -this.size) this.x = canvas.width + this.size; if (this.y > canvas.height + this.size) this.y = -this.size; if (this.y < -this.size) this.y = canvas.height + this.size; } }
    function init() { particles = []; for (let i = 0; i < particleCount; i++) { let x = Math.random() * canvas.width; let y = Math.random() * canvas.height; let velX = (Math.random() - 0.5) * 0.4; let velY = (Math.random() - 0.5) * 0.4; let shape = shapes[Math.floor(Math.random() * shapes.length)]; particles.push(new Particle(x, y, velX, velY, shape)); } }
    function animate() { ctx.clearRect(0, 0, canvas.width, canvas.height); for (let i = ripples.length - 1; i >= 0; i--) { ripples[i].update(); ripples[i].draw(); if (ripples[i].opacity <= 0) { ripples.splice(i, 1); } } for (const particle of particles) { particle.update(); particle.draw(); } requestAnimationFrame(animate); }
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); });
    init();
    animate();
});


// ===============================================================
// BÖLÜM 3: TYPEWRITER EFEKTİ KODU
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.getElementById('typewriter-text');
    const cursorElement = document.querySelector('.cursor');
    if (!textElement || !cursorElement) return;
    const texts = ["Game Developer", "Unity Developer", "5+ years experience"];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    const deletingSpeed = 75;
    const pauseDuration = 3500;
    function typeWriter() {
        const currentText = texts[textIndex];
        cursorElement.style.display = 'inline-block';
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(typeWriter, 500);
            } else {
                setTimeout(typeWriter, deletingSpeed);
            }
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseDuration);
            } else {
                setTimeout(typeWriter, typingSpeed);
            }
        }
    }
    setTimeout(typeWriter, 1000);
});

// ===============================================================
// BÖLÜM 4: SCROLL İLE BAŞLIĞI SABİTLEME KODU
// ===============================================================
document.addEventListener('scroll', function() {
    const headerContent = document.querySelector('.header-content');
    const scrollIndicator = document.querySelector('.scroll-down-indicator'); // YENİ

    if (!headerContent || !scrollIndicator) return;

    // Belirli bir kaydırma miktarından sonra 'scrolled' ve 'hidden' sınıflarını ekle/kaldır
    if (window.scrollY > 50) {
        headerContent.classList.add('scrolled');
        scrollIndicator.classList.add('hidden'); // YENİ: İkonu gizle
    } else {
        headerContent.classList.remove('scrolled');
        scrollIndicator.classList.remove('hidden'); // YENİ: İkonu göster
    }
});

// ===============================================================
// BÖLÜM 5: PORTFOLYO MODAL YÖNETİMİ
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    const modal = document.getElementById('portfolio-modal');
    if (!modal) return;
    const closeModalButton = modal.querySelector('.close-button');
    const modalTitle = modal.querySelector('.modal-title');
    const modalDescription = modal.querySelector('.modal-description');
    const modalMediaContainer = modal.querySelector('.modal-media-container');
    const modalLinksContainer = modal.querySelector('.modal-links');

    let modalSwiper = null;
    
    const projectDetails = {
        '1': {
            title: 'Patrol Officer',
            description: 'Chase Down Criminals and Protect the Streets: Track down suspects, stop speeders, and enforce the law in your patrol car. Take on dangerous car chases, write tickets, and perform body searches. Use your police skills to keep the city safe from crime.',
            images: ['images/patrol/img0.png',"images/patrol/img1.png","images/patrol/img2.png"],
            video: 'images/patrol/video0.mp4',
            link_ios: 'https://apps.apple.com/tr/app/patrol-officer-polis-oyunu/id6450002086',
            link_aos: 'https://play.google.com/store/apps/details?id=com.flatgames.patrolofficer',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '2': {
            title: 'Arcade Idle Framework',
            description: `
                <p>
                    🚀 Thrilled to announce that I've been hard at work on developing an Idle Arcade Framework using the Unity game engine! 🕹️ Think of it as a comprehensive template within Unity that makes it easy to bring your own idle arcade games to life.
                </p>
                <p>
                    By examining existing games and resources, I'm confident that this framework includes everything you need for a fantastic idle arcade game. From core mechanics to potential features, it aims to provide a starting point where your creativity can shine. ✨
                </p>
                <p>
                    The framework is still under development. Upcoming updates:
                </p>
                <ul class="feature-list">
                    <li>Customer System 🧑‍🤝‍🧑</li>
                    <li>Shooting System (think Archero-style!) 🏹</li>
                    <li>Dungeon System 🗝️</li>
                    <li>New Map System 🗺️</li>
                    <li>And much more to come! ➕</li>
                </ul>
            `,
            images: ['images/aif/img0.png',"images/aif/img1.png","images/aif/img2.png"],
            video: 'images/aif/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: 'https://github.com/SemihKC94/AIF-v01.git' // Github linki yoksa boş bırakılır.
        },
        '3': {
            title: 'Airport Deputy',
            description: `
            <p>As an Airport Deputy police, your job is more than just checking bags—you’re the last line of defense in this high-stakes airport adventure. Catch contraband criminals, secure the air terminal, and ensure only law-abiding passengers and plane crew members proceed to their flights. Whether you’re inspecting a passport photo or thwarting a daring escape, your vigilance will help keep the sky safe.
            </p>
            <p>
            Game Features:
            </p>
            <p>
            Experience the intensity of Airport adventures, taking on the role of an Airport Deputy.
            </p>
            <p>
            Keep the airport terminal secure with your x-ray scanner, reveal concealed contraband, and stop bad guys in their tracks.
            </p>
            <p>
            Master the passport control, scan for fake legal papers, and handle critical emergency scenarios.
            </p>
            <p>
            Hone your skills in airport security checks, rise through the police ranks, and prove your prowess as the ultimate Airport Deputy.
            </p>
            <p>
            Ensure sky safety through careful air control, protecting passengers, the crew, and every plane in the terminal.
            </p>
            <p>
            Become the guardian of the sky & terminal, thwart criminals, and keep the sky clear. Your airport terminal is counting on you!
            </p>
            `,
            images: ['images/ad/img0.png',"images/ad/img1.png","images/ad/img2.png"],
            video: 'images/ad/video0.mp4',
            link_ios: 'https://apps.apple.com/tr/app/airport-deputy-safe-terminal/id6642698584',
            link_aos: 'https://play.google.com/store/apps/details?id=com.flatgames.airport.deputy.safe.terminal',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '4': {
            title: 'Wedding Rush 3D!',
            description: `
            <p>Ever thought what your wedding day might feel like? Or thought about how your dress will look? Here’s the chance!
            </p>
            <p>
            It’s time to experience Wedding Rush! Marriage is never easy, especially the wedding day.
            </p>
            <p>
            Plan your dream wedding and overcome obstacles to live your happiest day and be happily ever after. Easy & fun wedding mini games made to entertain you!
            </p>
            <p>
            But remember, there will be challenges waiting for you to ruin your wedding day, only you can overcome them by playing! It’s all up to you to overcome the Wedding Rush!
            </p>
            `,
            images: ['images/wr/img0.png',"images/wr/img1.png","images/wr/img2.png","images/wr/img3.png"],
            video: 'images/wr/video0.mp4',
            link_ios: 'https://apps.apple.com/us/app/wedding-rush-3d/id1547766347',
            link_aos: 'https://play.google.com/store/apps/details?hl=en&id=com.oskankayirci.weddingrush',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '5': {
            title: 'Survival Challange: 456 Master',
            description: `
            <p>Are you ready for the ultimate adventure? Welcome to Survival Challenge, where you’ll face intense inspired tasks, thrilling games, and the ultimate test of strategy and courage. Outsmart your opponents, master every challenge, and prove you’re the true mastermind in this epic game of survival!
            </p>
            <p>
            Game Features:
            </p>
            <p>
            A classic survival challenge! Run when it’s safe, freeze when it’s not, and don’t get caught moving. Timing is everything—can you outlast the competition?
            </p>
            <p>
            Glass Jump: The floor is fragile! Step on the correct glass panels to cross safely. This inspired challenge will test your instincts—one wrong move and it’s game over.
            </p>
            <p>
            Cookie Carve: Carve the perfect circle from your cookie without breaking it. This survival task demands precision and patience. Do you have the skills to succeed?
            </p>
            <p>
            Team up and pull your way to victory in this iconic game. Work together or risk being pulled into defeat!
            </p>
            <p>
            Basketball Shot: Beat the clock in this fast-paced survival challenge. Tap quickly, aim sharply, and score big to stay in the game!
            </p>
            <p>
            Each level brings tougher challenges and higher stakes, pushing your survival instincts to the limit. These games are more than just luck—they demand strategy, quick thinking, and the courage of a true mastermind.
            </p>
            <p>
            
            Can you survive the chaos, conquer every survival task, and rise to the top? The ultimate test of wit and endurance awaits.
            </p>
            <p>
            `,
            images: ['images/sc/img0.png',"images/sc/img1.png","images/sc/img2.png","images/sc/img3.png"],
            video: 'images/sc/video0.mp4',
            link_ios: '',
            link_aos: 'https://play.google.com/store/apps/details?id=com.flatgames.dalgona.survival.challenge',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '6': {
            title: 'Borderland Defender - SWAT Sim',
            description: `
            <p>Thrust into the role of a virtual border police patrol, you’ll be on the frontline defending America. This police patrol simulator will plunge you into the heart of border security. As the Borderland Defender, your SWAT police duty is clear: defend the borders at all costs.
            </p>
            <p>
            Here's what you'll get with Borderland Defender - SWAT Sim:
            </p>
            <ul class="feature-list">
            <li>Play as a frontline Border patrol in this immersive security cop simulator.</li>
            <li>Defend America's borders against crime and threats with strategic gameplay and intense SWAT missions.</li>
            <li>Engage in border patrol games featuring rugged terrains, daring thieves, and escape attempts.</li>
            <li>Armed with the latest gear, including SWAT support, military tank, helicopter, fighter jet, police jeep, confront dangers and defuse bombs.</li>
            <li>Patrol with a jeep and helicopter, ensuring the safety and security of the frontline of America.</li>
            <li>Experience hundreds of border patrol levels and diverse stories in this action-packed patrol police game.</li>
            </ul>
            `,
            images: ['images/bd/img0.png',"images/bd/img1.png","images/bd/img2.png"],
            video: 'images/bd/video0.mp4',
            link_ios: '',
            link_aos: 'https://play.google.com/store/apps/details?id=com.flatgames.borderlandpatrol',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '7': {
            title: 'Garage Grind',
            description: `
            <p>Get ready to soar through the skies in style with Garage Grind - Plane Tuning, the adrenaline-pumping airplane modification game that puts you in the pilot's seat of your dreams! Take your passion for car tuning to new heights as you dive into the thrilling world of customizing and upgrading your very own aircraft.
            </p>
            <p>
            Customize Your Ride: Unleash your creativity and personalize every aspect of your plane in the garage. From sleek body kits to powerful engine upgrades, the possibilities are endless. Transform your aircraft into a true reflection of your style and personality.
            </p>
            <p>
            High-Flying Action: Take to the skies and experience the rush of adrenaline as you compete in intense races and challenges at various airports around the world. Master the art of flight as you navigate through challenging courses, perfect your landings, and outmaneuver your opponents to claim victory.
            </p>
            <p>
            Upgrade and Boost: Push the limits of speed and performance with a wide range of upgrades and boosters. Fine-tune your engine for maximum power, enhance your aerodynamics for better control, and equip special boosts to leave your rivals in the dust.
            </p>
            <p>
            Become the Ultimate Pilot: Test your skills against the best pilots in the world and rise through the ranks to become the ultimate champion. From rookie rider to seasoned aviator, the journey to greatness is yours to conquer.
            </p>
            `,
            images: ['images/gg/img0.png',"images/gg/img1.png","images/gg/img2.png","images/gg/img3.png"],
            video: 'images/gg/video0.mp4',
            link_ios: '',
            link_aos: 'https://play.google.com/store/apps/details?id=com.FunjitsuGames.Brix',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '8': {
            title: 'Roller Coaster Level Up',
            description: '<p>Will you be able to bring your passengers to the end of each attraction? Each level has its own challenges. You will have to drive your wagons to avoid the bombs and impasses that will unfold during the ride. Don\'t forget to gather the people on your way if you want the reward to be higher, as passengers will be waiting for you along the loopings.\n' +
                '</p>',
            images: ['images/rc/img0.png'],
            video: 'images/rc/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '9': {
            title: 'Pixel Shredder',
            description: `
            <p>Control a cute shredder and shred colorful objects into tiny little pixels! Objects will jump and dance on the gears as they are shred into pieces and slowly disappear in your shredders mouth! This a feast of colors and pixels! So satisfying!
            </p>
            <p>
            Game features:
            </p>
            <ul class="feature-list">
            <li>Shred dozens of colorful objects into tiny little pixels!"</li>
            <li>Unlock dozens of fun shredders! They are all cute and popular!</li>
            <li>Upgrade your shredders to maximum speed, size and shredding power!</li>
            <li>Pick up various collectibles like coins, gems, and stars. Convert them into items and skills.</li>
            <li>Complete tasks to get rewards like legendary shredders!</li>
            <li>Play through more than a dozen colorful levels!</li>
            </ul>
            `,
            images: ['images/ps/img0.png'],
            video: 'images/ps/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: '' // Github linki yoksa boş bırakılır.
        },
        '10': {
            title: 'World Puzzle Case Project',
            description: `
            <p>⚒️ This gameplay video demonstrates a word game developed using the Trie data structure. The objective is to find hidden words within a grid of letters. The Trie data structure optimizes word search operations, enabling quick results. The visual assets used in the game were generated using artificial intelligence. This project is a test case study conducted for a company and was developed in 2 days. It includes several applications of the game development process. For those interested in accessing the source files, please visit the GitHub repository: https://lnkd.in/d88SntZK. For more detailed information, please refer to the README file in the repository. 
            </p>
            `,
            images: ['images/wp/img0.png'],
            video: 'images/wp/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: 'https://github.com/SemihKC94/Happy-Hour-Test-Case.git' // Github linki yoksa boş bırakılır.
        },
        '11': {
            title: 'Bus Out Case Project with Level Editor',
            description: `
            <p>A grid-based puzzle game where players maneuver snake-like buses to their designated destinations to pick up passengers. The project features a robust, custom-built Level Editor for creating and managing all aspects of a level.</p>
            `,
            images: ['images/bo/img0.png','images/bo/img1.png','images/bo/img2.png'],
            video: 'images/bo/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: 'https://github.com/SemihKC94/bus-out-8GreatGames-Case.git' // Github linki yoksa boş bırakılır.
        },
        '12': {
            title: 'Deterministic Roulette Case Project',
            description: `
            <p>This project is a comprehensive implementation of a classic roulette game, incorporating all standard features and betting options. Notably, it includes a deterministic mode, allowing players to pre-select the winning number. The game meticulously tracks player statistics, including spin count, wins, losses, total winnings, and total losses, all of which are accessible via a dedicated statistics interface. Furthermore, player progress is persistently stored using a custom-designed save system.
            </p>`,
            images: ['images/dr/img0.png','images/dr/img1.png','images/dr/img2.png'],
            video: 'images/dr/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: 'https://github.com/SemihKC94/Deterministic-Roulette-Game.git' // Github linki yoksa boş bırakılır.
        },
        '13': {
            title: 'Unity Editor Kanban Board System',
            description: `
            <p>Welcome to the Unity Editor Kanban Board System! This is a powerful, customizable, and intuitive task management tool built directly within the Unity Editor. Designed to streamline your game development workflow, it helps teams track tasks, manage progress, and assign responsibilities without ever leaving your development environment.
            </p>
            <p>
            This project is currently in its early stages of development, but it's already a highly functional tool that aims to evolve into a comprehensive solution for game development task management. Your feedback and contributions are always welcome!
            </p>
            `,
            images: ['images/kb/img0.png','images/kb/img1.png','images/kb/img2.png','images/kb/img3.png','images/kb/img4.png'],
            video: 'images/kb/video0.mp4',
            link_ios: '',
            link_aos: '',
            link_github: 'https://github.com/SemihKC94/kanban-board-system.git' // Github linki yoksa boş bırakılır.
        },
    };

    portfolioCards.forEach(card => {
        card.addEventListener('click', function(event) {
            event.preventDefault();
            const projectId = this.getAttribute('data-project-id');
            const project = projectDetails[projectId] || { title: 'Proje Bulunamadı', description: '', images: [], video: '' };

            modalTitle.textContent = project.title;
            //modalDescription.textContent = project.description;
            modalDescription.innerHTML = project.description;

            const swiperWrapper = modal.querySelector('.swiper-wrapper');
            swiperWrapper.innerHTML = ''; // Önceki slaytları temizle

            // YENİ: LİNKLERİ KONTROL EDEREK BUTONLARI OLUŞTURMA
            modalLinksContainer.innerHTML = ''; // Önceki butonları temizle
            if (project.link_ios) {
                modalLinksContainer.innerHTML += `<a href="${project.link_ios}" target="_blank" class="link-button"><i class="fab fa-apple"></i> App Store</a>`;
            }
            if (project.link_aos) {
                modalLinksContainer.innerHTML += `<a href="${project.link_aos}" target="_blank" class="link-button"><i class="fab fa-google-play"></i> Google Play</a>`;
            }
            if (project.link_github) {
                modalLinksContainer.innerHTML += `<a href="${project.link_github}" target="_blank" class="link-button"><i class="fab fa-github"></i> GitHub</a>`;
            }

// Önce görselleri ekle
            // Varsa videoyu ilk slayt olarak ekle
            if (project.video) {
                const videoSlide = document.createElement('div');
                videoSlide.classList.add('swiper-slide');
                if (project.video.includes('youtube.com') || project.video.includes('youtu.be') || project.video.includes('http://googleusercontent.com/youtube.com/7')) {
                    videoSlide.innerHTML = `<iframe src="${project.video}" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else {
                    videoSlide.innerHTML = `<video controls><source src="${project.video}" type="video/mp4">Tarayıcınız video etiketini desteklemiyor.</video>`;
                }
                swiperWrapper.appendChild(videoSlide);
            }

            // Sonra görselleri slayt olarak ekle
            if (project.images && project.images.length > 0) {
                project.images.forEach(imageSrc => {
                    const imageSlide = document.createElement('div');
                    imageSlide.classList.add('swiper-slide');
                    imageSlide.innerHTML = `<img src="${imageSrc}" alt="${project.title}">`;
                    swiperWrapper.appendChild(imageSlide);
                });
            }

            modal.style.display = "block";

            // YENİ: Swiper'ı başlat
            // Eğer önceden bir Swiper varsa onu silip yeniden oluşturuyoruz
            if (modalSwiper) {
                modalSwiper.destroy(true, true);
            }
            modalSwiper = new Swiper('.swiper', {
                loop: true, // Sonsuz döngü
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        });
    });

    const closeAllModals = () => {
        modal.style.display = "none";
        // YENİ: Modalı kapatırken videoyu durdur ve Swiper'ı temizle
        const swiperWrapper = modal.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = "";
        if (modalSwiper) {
            modalSwiper.destroy(true, true);
            modalSwiper = null;
        }
    }

    closeModalButton.addEventListener('click', closeAllModals);

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeAllModals();
        }
    });
});

// ===============================================================
// YENİ BÖLÜM 6: AJAX İLE FORM GÖNDERİMİ VE BİLDİRİM
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    const notificationBanner = document.getElementById('notification-banner');

    if (!form || !notificationBanner) return;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Formun normal gönderimini ve sayfa yenilenmesini engelle

        const formData = new FormData(form);
        const submitButton = form.querySelector('.submit-btn');
        const originalButtonText = submitButton.innerHTML;
        submitButton.innerHTML = "Gönderiliyor...";
        submitButton.disabled = true;

        fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                // Başarılı olduğunda
                showNotification();
                form.reset(); // Formdaki tüm alanları temizle
            } else {
                // Sunucudan hata dönerse
                response.json().then(data => {
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert('Something went wrong, please try again later.');
                    }
                })
            }
        }).catch(error => {
            // Ağ hatası veya başka bir sorun olduğunda
            console.error('Form gönderim hatası:', error);
            alert('Your message was not sent. Please check your internet connection..');
        }).finally(() => {
            // Her durumda (başarılı veya başarısız) butonu eski haline getir
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
    });

    function showNotification() {
        // Bildirimi göster
        notificationBanner.classList.add('show');

        // 2 saniye sonra bildirimi gizle
        setTimeout(() => {
            notificationBanner.classList.remove('show');
        }, 2000);
    }
});

// ===============================================================
// YENİ BÖLÜM 7: OTOMATİK TELİF HAKKI YILI
// ===============================================================
document.addEventListener('DOMContentLoaded', function() {
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }
});