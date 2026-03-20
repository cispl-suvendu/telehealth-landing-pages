// 1. Scene Setup
const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 2. Object (Abstract Shape)
const geometry = new THREE.IcosahedronGeometry(1, 15);
const material = new THREE.MeshStandardMaterial({
    color: 0x333333,
    wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// 3. Lights
const mainLight = new THREE.DirectionalLight(0xffffff, 2);
mainLight.position.set(1, 1, 2);
scene.add(mainLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 4. Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
scene.add(camera);

// 5. Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 6. Scroll Animations (GSAP)
gsap.registerPlugin(ScrollTrigger);

const sections = document.querySelectorAll('.container');

sections.forEach((section, index) => {
    // Animate HTML Text
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: true,
        },
        opacity: 1,
        y: 0
    });

    // Animate 3D Object based on section
    let tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
        }
    });

    if (index === 1) {
        tl.to(mesh.rotation, { y: Math.PI * 2, x: 1 });
        tl.to(mesh.position, { x: 1.5 }, 0);
    } else if (index === 2) {
        tl.to(mesh.scale, { x: 2, y: 2, z: 2 });
        tl.to(mesh.position, { x: -1.5 }, 0);
    } else if (index === 3) {
        tl.to(mesh.rotation, { z: Math.PI });
        tl.to(mesh.position, { x: 0, y: 0.5 }, 0);
    }
});

// 7. Parallax Mouse Effect
window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / sizes.width - 0.5) * 0.5;
    const y = (event.clientY / sizes.height - 0.5) * 0.5;
    
    gsap.to(camera.position, {
        x: x,
        y: -y,
        duration: 2,
        ease: "power2.out"
    });
});

// 8. Resize Handler
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
});

// 9. Animation Loop
const tick = () => {
    mesh.rotation.y += 0.005; // Gentle constant rotation
    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
};

tick();