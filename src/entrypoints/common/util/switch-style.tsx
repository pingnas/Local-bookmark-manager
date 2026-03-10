export let Style_Video = () => <style>
    {
        `
    body {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.88));
}

body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    backdrop-filter: none;
    background: transparent;
}

#bg-video {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    object-fit: cover;
    opacity: 0;
    filter: brightness(1.05);
    transition: opacity 0.5s ease;
}
    `
    }
</style>

export let Style_Image = () => <style>
    {
        `
    body {
    position: relative;
    min-height: 100vh;
    overflow-x: hidden;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.88));
}

body::after {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    backdrop-filter: none;
    background: transparent;
}

#bg-location {
    position: fixed;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    z-index: -2;
    // opacity: 0.4;
    filter: brightness(1.05);
    transition: opacity 0.5s ease;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
    `
    }
</style>