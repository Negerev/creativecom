function scrollVideo () {
    if(window.innerWidth < 1024) {
        document.addEventListener('scroll', () => {
        const autoVideo = document.querySelector('.auto-video');
        const screenHeight = window.screen.height;
        const watchVideo = document.querySelector('.promo-video');
        if(watchVideo.getBoundingClientRect().top <= (screenHeight)
        && (watchVideo.clientHeight + watchVideo.getBoundingClientRect().top) >= 0) {
            
        } else {
            watchVideo.pause();
            console.log(1);
        }
        
        if (autoVideo.getBoundingClientRect().top <= (screenHeight)
            && (autoVideo.clientHeight + autoVideo.getBoundingClientRect().top) >= 0) {
            autoVideo.play();
            console.log('play');
        } else {
            autoVideo.pause();
        }
    });
    }
    
}
module.exports = scrollVideo;