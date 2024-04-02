window.onload = function() {
    console.log("Window loaded");

    document.querySelector('.preloader').style.display = 'none';

    const syncPointer = (event) => {
        console.log("Mouse moved");
        const pointerX = event.clientX;
        const pointerY = event.clientY;
        console.log("PointerX:", pointerX, "PointerY:", pointerY);
        const x = pointerX.toFixed(2);
        const y = pointerY.toFixed(2);
        const xp = (pointerX / window.innerWidth).toFixed(2);
        const yp = (pointerY / window.innerHeight).toFixed(2);
        console.log("X:", x, "Y:", y, "XP:", xp, "YP:", yp);
        document.documentElement.style.setProperty('--x', x);
        document.documentElement.style.setProperty('--xp', xp);
        document.documentElement.style.setProperty('--y', y);
        document.documentElement.style.setProperty('--yp', yp);
    }
    document.addEventListener('pointermove', syncPointer);

    const navButtons = document.querySelectorAll('.nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', toggleMenu);
    });

    // Image slider functionality
    const images = document.querySelectorAll('.slider img');
    let index = 0;

    setInterval(() => {
        images[index].style.display = 'none';
        index = (index + 1) % images.length;
        images[index].style.display = 'block';
    }, 3000);
};

function toggleMenu() {
    console.log("Menu toggled");
    var navigation = document.querySelector('.navigation');
    navigation.classList.toggle('active');
}
console.log("CSS Variables --x:", getComputedStyle(document.documentElement).getPropertyValue('--x'), "--y:", getComputedStyle(document.documentElement).getPropertyValue('--y'), "--xp:", getComputedStyle(document.documentElement).getPropertyValue('--xp'), "--yp:", getComputedStyle(document.documentElement).getPropertyValue('--yp'));
